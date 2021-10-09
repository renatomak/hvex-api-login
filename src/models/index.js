const connect = require('../../config/conn');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'users';

const createModel = async ({ name, userName, password }) =>
  connect().then(async (db) => {
    const result = await db
      .collection(COLLECTION_NAME)
      .insertOne({ name, userName, password });
    const user = {
      _id: result.insertedId,
      name,
      userName,
      dateAccess: new Date(),
    };
    return user;
  });

const findUserNameModel = async (userName) => {
  const result = await connect().then((db) =>
    db.collection(COLLECTION_NAME).findOne({ userName })
  );
  console.log({ user: result})
  return { user: result};
};

module.exports = {
  createModel,
  findUserNameModel,
};
