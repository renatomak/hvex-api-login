const frisby = require('frisby');
const { MongoClient } = require('mongodb');
const {
  STATUS_201_CREATED,
  STATUS_200_OK,
  STATUS_404_NOT_FOUND,
} = require('../util');

const mongoDbUrl = 'mongodb://localhost:27017/api-login';

const url = 'http://localhost:3001';

describe('4 - Endpoint DELETE /users/:id', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('api-login');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
    const users = {
      name: 'admin',
      userName: 'admin',
      password: 'admin',
    };
    await db.collection('users').insertOne(users);
  });

  afterAll(async () => {
    await connection.close();
  });

  test('4.1 - It will be validated that it is possible to delete a user successfully', async () => {
    let result;

    await frisby
      .post(`${url}/users`, {
        name: 'user silva',
        userName: 'user.silva',
        password: '123456',
      })
      .expect('status', STATUS_201_CREATED)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        responseUserId = result._id;
      });

    await frisby
      .delete(`${url}/users/${result.user._id}`)
      .expect('status', STATUS_200_OK)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json).toEqual({ message: 'user removed successfully'});
      });
  });

  test('4.2 - Test for the case when trying to delete non-existent user', async () => {
    let result;

    await frisby
      .delete(`${url}/users/999999`)
      .expect('status', STATUS_404_NOT_FOUND)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json).toEqual({ message: 'Error while delete'});
      });

      await frisby
      .post(`${url}/users/`, {
        name: 'fulano de Tal',
        userName: 'fulano.tal',
        password: '12345678',
      })
      .expect('status', STATUS_201_CREATED)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        responseUserId = result.user._id;
      });

    await frisby
      .delete(`${url}/users/${responseUserId}`)
      .expect('status', STATUS_200_OK)
      .then((response) => {
        const { json } = response;
        expect(json).toEqual({ message: 'user removed successfully'});
      });

      await frisby
      .delete(`${url}/users/${responseUserId}`)
      .expect('status', STATUS_404_NOT_FOUND)
      .then((response) => {
        const { json } = response;
        expect(json).toEqual({ message: 'Error while delete' });
      });
  });
});
