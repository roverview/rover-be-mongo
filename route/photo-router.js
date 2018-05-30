'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('roverview: photo-router');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const User = require('../model/user.js');
const Photo = require('../model/photo.js');

const photoRouter = module.exports = Router();

photoRouter.post('/api/:userId', bearerAuth, jsonParser, (req, res, next) => {
  debug('POST: /api/:userId');

  console.log(req.body)
  // if(!req.body.email) return next(createError(400, 'bad request'));

  req.body.userId = req.user._id;
  new Photo(req.body).save()
    .then( photo => res.json(photo))
    .catch(next);
});

// photoRouter.get('/api/profile', bearerAuth, (req, res, next) => {
//   debug('GET: /api/profile');
//   Profile.findOne({ userId: req.user._id })
//     // .populate('companies')
//     .populate({
//       path: 'companies',
//       populate: [
//         { path: 'jobPosting', model: 'job' },
//         { path: 'events' },
//         { path: 'contacts' },
//       ],
//     })
//     .then( profile => res.json(profile))
//     .catch(next);
// });

// photoRouter.get('/api/profile/:profileId', bearerAuth, function(req, res, next) {
//   debug('GET: /api/profile/:profileId');

//   Profile.findById(req.params.profileId)
//     .populate({
//       path: 'companies',
//       populate: [
//         { path: 'jobPosting' },
//         { path: 'events' },
//         { path: 'contacts' },
//       ],
//     })
//     .then( profile => res.json(profile))
//     .catch(next);
// });

// photoRouter.delete('/api/profile/:profileId', bearerAuth, function(req, res, next) {
//   debug('DELETE: /api/profile');
//   Profile.findByIdAndRemove(req.params.profileId)
//     .then( () => res.send(204))
//     .catch(next);
// });

// photoRouter.put('/api/profile/:profileId', bearerAuth, jsonParser, function(req, res, next) {
//   debug('PUT: /api/profile/:profileId');

//   if(Object.keys(req.body).length === 0) return next(createError(400, 'bad request'));

//   Profile.findByIdAndUpdate(req.params.profileId, req.body, { new: true })
//     .populate({
//       path: 'companies',
//       populate: [
//         { path: 'jobPosting'},
//         { path: 'events' },
//         { path: 'contacts' },
//       ],
//     })
//     .then( profile => res.json(profile))
//     .catch(next);
// });