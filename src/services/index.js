const { createModel, findUserNameModel } = require('../models');
const { messageError } = require('../util');

const createService = async (user) => {
  try {

    const registered = await findUserNameModel(user.userName);

    if (registered?.user) {
      return { registered: true };
    }

    const result = await createModel(user);

    return result;
  } catch (error) {
    throw Error(messageError(error.message, 'register users'));
  }
};

module.exports = { createService }