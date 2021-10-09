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

const readByIdModel = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return connect().then(async (db) => {
    const user = await db.collection(COLLECTION_NAME).findOne(ObjectId(id));
    return { user };
  });
};

const updateModel = async (user) => {
  const { _id, name, userName, password } = user;
  const dateAccess = new Date();

  await connect().then((db) => {
    db.collection(COLLECTION_NAME).updateOne({ _id: ObjectId(_id) }, [
      { $set: { name, userName, password,  dateAccess } },
    ]);
  });
  return { user: { _id, name, userName, dateAccess } };
};

const deleteModel = async (id) => {
  const result = await connect().then((db) => db.collection(COLLECTION_NAME).deleteOne({ _id: ObjectId(id)}))
  console.log(result);
  return result;
}

module.exports = {
  createModel,
  findUserNameModel,
  readByIdModel,
  updateModel,
  deleteModel,
};
