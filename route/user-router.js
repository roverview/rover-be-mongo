'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('roverview: user-router');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const createError = require('http-errors');

const User = require('../model/user-model.js');

const userRouter = module.exports = Router();

userRouter.post('/api/signup', jsonParser, (req, res, next) => {
  debug('POST: /api/signup');
  if (!req.body.username) return next(createError(400, 'ValidationError'));

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => res.send(token))
    .catch(next);
});

userRouter.get('/api/signin', basicAuth, (req, res, next) => {
  debug('GET: /api/signin');

  User.findOne({ email: req.auth.email })
    .then(user => user.comparePasswordHash(req.auth.password))
    .then(user => user.generateToken())
    .then(token => res.send(token))
    .catch(next);
});