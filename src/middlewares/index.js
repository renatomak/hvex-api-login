const { STATUS_400_BAD_REQUEST } = require('../util');

const validateIfTheNameExists = (req, res, next) => {
  const { name } = req.body;

  if (!name)
    return res
      .status(STATUS_400_BAD_REQUEST)
      .send({ message: 'The "name" field is mandatory.' });

  next();
};

module.exports = { validateIfTheNameExists };
