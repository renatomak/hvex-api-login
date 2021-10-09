const { STATUS_400_BAD_REQUEST } = require('../util');

const validateIfTheNameExists = (req, res, next) => {
  const { name } = req.body;

  if (!name)
    return res
      .status(STATUS_400_BAD_REQUEST)
      .send({ message: 'The "name" field is mandatory.' });

  next();
};

const validateNameFormat = (req, res, next) => {
  const { name } = req.body;

  if (name && name.length < 4) {
    return res
      .status(STATUS_400_BAD_REQUEST)
      .send({ message: 'The "name" field must be at least 4 characters long' });
  }
  
  next();
};

const validateIfTheUserNameExists = (req, res, next) => {
  const { userName } = req.body;
  if (!userName || userName === '') {
    return res
      .status(STATUS_400_BAD_REQUEST)
      .send({ message: 'The "userName" field is mandatory' });
  }
  next();
};

const validateUserNameFormat = (req, res, next) => {
  const { userName } = req.body;

  const RegExp = /^[A-Za-z]+([A-Za-z]*|[._-]?[A-Za-z0-9]+)*$/;

  if (!RegExp.test(userName)) {
    return res
      .status(STATUS_400_BAD_REQUEST)
      .send({
        message: 'the username can then have letters, numbers or ".", "_", "-"',
      });
  }

  next();
};

const validateIfThePasswordExists = (req, res, next) => {
  const { password } = req.body;

  if (!password || password === '') {
    return res
      .status(STATUS_400_BAD_REQUEST)
      .send({ message: 'The "password" field is mandatory' });
  }

  next();
};

module.exports = {
  validateIfTheNameExists,
  validateIfTheUserNameExists,
  validateIfThePasswordExists,
  validateUserNameFormat,
  validateNameFormat,
};
