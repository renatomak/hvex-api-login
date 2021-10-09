const express = require('express');
const { createUser, readUser } = require('../controllers');
const Middleware = require('../middlewares');

const router = express.Router();

router.post(
  '/users',
  Middleware.validateIfTheNameExists,
  Middleware.validateIfTheUserNameExists,
  Middleware.validateIfThePasswordExists,
  Middleware.validateUserNameFormat,
  Middleware.validateNameFormat,
  createUser
);

router.get('/users/:id', readUser);

module.exports = router;
