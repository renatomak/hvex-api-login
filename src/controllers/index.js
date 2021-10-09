const rescue = require('express-rescue');
const {
  STATUS_201_CREATED,
  STATUS_400_BAD_REQUEST,
  STATUS_409_CONFLICT,
} = require('../util');
const { createService } = require('../services');

const createUser = rescue(async (req, res) => {
  try {
    const { name, userName, password } = req.body;

    const user = await createService({ name, userName, password });
    console.log(user)
    
    if (user.registered) {
      return res
        .status(STATUS_409_CONFLICT)
        .json({ message: 'User already registered!' });
    }

    return res.status(STATUS_201_CREATED).json({ user });
  } catch (error) {
    console.error(error.message);
    return res
      .status(STATUS_400_BAD_REQUEST)
      .json({ message: 'Invalid fields' });
  }
});

module.exports = { createUser };
