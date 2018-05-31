'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const debug = require('debug')('roverview:user');
const createError = require('http-errors');

const Photo = require('./photo.js');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    required: [true, 'can\'t be blank'],
    // match: [/\S+@\S+\.\S+/, 'is invalid'], 
    unique: true,
  },
  password:{ type: String, required: true },
  findHash: { type: String, unique: true },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'photo' }],
}, { timestamps: true });

userSchema.methods.generatePasswordHash = function(password) {
  debug('Password Hashing');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.validatePasswordHash = function(password) {
  debug('Validate/compare Password hashes');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function() {
  debug('Generate Find Hash');

  return new Promise((resolve, reject) => {
    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then (() => resolve(this.findHash))
        .catch(reject);
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generate token');

  return new Promise((resolve, reject) => {
    this.generateFindHash()
      .then(findHash => resolve(jwt.sign({ token: findHash }, process.env.APP_SECRET)))
      .catch(reject);
  });
};

userSchema.methods.findByIdAndAddPhoto = function(id, photo) {
  debug('findByIdAndAddPhoto');

  return userSchema.findById(id)
    .then(user => {
      photo.userId = user._id;
      this.tempUser = user;
      return new Photo(photo).save();
    })
    .then(photo => {
      this.tempUser.photos.push(photo);
      this.tempPhoto = photo;
      return this.tempUser.save();
    })
    .then(() => {
      return this.tempUser;
    });
};

module.exports = mongoose.model('User', userSchema);