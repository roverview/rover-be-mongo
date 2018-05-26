'use strict';

// const debug = require('debug')('roverview:photo');
const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  imageId: { type: String },
  roverName: { type: String },
  camName: { type: String },
  earthDate: { type: String },
  imgSrc: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);