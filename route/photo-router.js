'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
// const createError = require('http-errors');
const debug = require('debug')('roverview: photo-router');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const User = require('../model/user.js');
const Photo = require('../model/photo.js');

const photoRouter = module.exports = Router();

// photoRouter.post('/api/:userId', bearerAuth, jsonParser, (req, res, next) => {
photoRouter.post('/api/:userId', jsonParser, (req, res, next) => {
  debug('POST: /api/:userId');

  let photoObj = {
    imageId: req.body.id,
    roverName: req.body.rover.name,
    camName: req.body.camera.full_name,
    earthDate: req.body.earth_date,
    imgSrc: req.body.img_src,
  };

  User.findById(req.params.userId)
    .then(user => {
      photoObj.userId = user._id;
      this.tempUser = user;
      return new Photo(photoObj).save();
    })
    .then(photo => {
      this.tempUser.photos.push(photo);
      this.tempPhoto = photo;
      return this.tempUser.save();
    })
    .then(() => {
      return res.json(this.tempUser);
    })
    .catch(next);
});

// photoRouter.delete('/api/:userId/:photoId', bearerAuth, function(req, res, next) {
photoRouter.delete('/api/:userId/:photoId', function(req, res, next) {
  debug('DELETE: /api/:userId/:photoId');

  User.findById(req.params.userId)
    .then(user => {
      return user;
    })
    .then(() => {
      return Photo.findByIdAndRemove(req.params.photoId);
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});
