'use strict';

const createError = require('http-errors');
const debug = require('debug')('roverview:errors');

module.exports = (err, req, res, next) => {
  debug('error middleware');

  console.log(err.message);
  if (err.status) {
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if (err.name === 'CastError') {
    err = createError(404, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }
  
  if (err.name === 'TypeError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }
};