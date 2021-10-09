const { createModel, findUserNameModel, readByIdModel } = require('../models');
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

const readByIdService = async (id) => {
  try {
    const result = await readByIdModel(id);
    return result;
  } catch (error) {
    throw Error(error.message + messageError('search Users by ID'));
  }
};

module.exports = { createService, readByIdService }