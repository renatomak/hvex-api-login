const { createModel } = require('../models');
const { messageError } = require('../util');

const createService = async (user) => {
  try {
    const result = await createModel(user);
    return result;
  } catch (error) {
    throw Error(messageError(error.message, 'register users'));
  }
};

module.exports = { createService }