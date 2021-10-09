const {
  createModel,
  findUserNameModel,
  readByIdModel,
  updateModel,
} = require('../models');
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

const updateService = async (user) => {
  try {
    const { userName } = user;

    if (userName) {
      const registered = await findUserNameModel(userName);
      if (registered.user && user._id != registered.user._id) {
        return { registered: true };
      }
    }

    const result = await updateModel(user);
    return result;
  } catch (error) {
    throw Error(messageError(error.message, 'update to user'));
  }
};

module.exports = { createService, readByIdService, updateService };
