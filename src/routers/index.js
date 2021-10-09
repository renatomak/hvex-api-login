const express = require('express');
const { createUser } = require('../controllers');
const Middleware = require('../middlewares');

const router = express.Router();

router.use(
  '/users',
  Middleware.validateIfTheNameExists,
  Middleware.validateIfTheUserNameExists,
  Middleware.validateIfThePasswordExists,
  Middleware.validateUserNameFormat,
  Middleware.validateNameFormat,
  createUser
);

module.exports = router;
