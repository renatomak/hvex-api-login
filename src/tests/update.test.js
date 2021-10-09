const frisby = require('frisby');
const { MongoClient } = require('mongodb');
const { STATUS_200_OK, STATUS_201_CREATED, STATUS_409_CONFLICT, STATUS_400_BAD_REQUEST } = require('../util');


const mongoDbUrl = 'mongodb://localhost:27017/api-login';

const url = 'http://localhost:3001';

describe('3 - Endpoint PUT /users/:id', () => {
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

  test('3.1 - It will be validated that it is possible to update a user successfully', async () => {
    let resultUserId;

    await frisby
      .post(`${url}/users`, {
        body: {
          name: 'user',
          userName: 'user.user',
          password: '123456',
        },
      })
      .expect('status', STATUS_201_CREATED)
      .then((responseCreate) => {
        const { json } = responseCreate;
        resultUserId = json.user._id;
      });

    await frisby
      .put(`${url}/users/${resultUserId}`, {
        name: 'Renato Marques',
        userName: 'renato.marques',
        password: '123456',
      })
      .expect('status', STATUS_200_OK)
      .then((secondResponse) => {
        const {
          json: { user },
        } = secondResponse;
        const userName = user.name;
        const userUserName = user.userName;
        expect(userName).toEqual('Renato Marques');
        expect(userUserName).toEqual('renato.marques');
      });
  });

  test('3.2 - It will be validated that the "userName" field is unique', async () => {
    let resultUserId;

    await frisby
      .post(`${url}/users`, {
        body: {
          name: 'renato',
          userName: 'renato.silva',
          password: '123456',
        },
      })
      .expect('status', STATUS_201_CREATED);

    await frisby
      .post(`${url}/users`, {
        body: {
          name: 'user',
          userName: 'user.user',
          password: '123456',
        },
      })
      .expect('status', STATUS_201_CREATED)
      .then((responseCreate) => {
        const { json } = responseCreate;
        resultUserId = json.user._id;
      });

    await frisby
      .put(`${url}/users/${resultUserId}`, {
        userName: 'renato.silva',
      })
      .expect('status', STATUS_409_CONFLICT)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json).toEqual({
          message: 'User already registered!',
        });
      });
  });

  test('3.3 - It will be validated that it is not possible to update a record with an invalid userName field.', async () => {
    let resultUserId;

    await frisby
      .post(`${url}/users`, {
        body: {
          name: 'user',
          userName: 'user.user',
          password: '123456',
        },
      })
      .expect('status', STATUS_201_CREATED)
      .then((responseCreate) => {
        const { json } = responseCreate;
        resultUserId = json.user._id;
      });

    await frisby
      .put(`${url}/users/${resultUserId}`, {
        name: 'Renato Marques',
        userName: 'renato mark',
        password: '123456',
      })
      .expect('status', STATUS_400_BAD_REQUEST)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json).toEqual({
          message: 'the username can then have letters, numbers or ".", "_", "-"',
        });
      });

    await frisby
      .put(`${url}/users/${resultUserId}`, {
        name: 'Renato Marques',
        userName: '@gmail.com',
        password: '123456',
      })
      .expect('status', STATUS_400_BAD_REQUEST)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json).toEqual({
          message: 'the username can then have letters, numbers or ".", "_", "-"',
        });
      });

    await frisby
      .put(`${url}/users/${resultUserId}`, {
        name: 'Renato Marques',
        userName: 'renato.mark@',
        password: '123456',
      })
      .expect('status', STATUS_400_BAD_REQUEST)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json).toEqual({
          message: 'the username can then have letters, numbers or ".", "_", "-"',
        });
      });
  });

  test('3.4 - It will be validated that it is not possible to update a record with an invalid name field.', async () => {
    let resultUserId;

    await frisby
      .post(`${url}/users`, {
        body: {
          name: 'user',
          userName: 'user.user',
          password: '123456',
        },
      })
      .expect('status', STATUS_201_CREATED)
      .then((responseCreate) => {
        const { json } = responseCreate;
        resultUserId = json.user._id;
      });

    await frisby
      .put(`${url}/users/${resultUserId}`, {
        name: 'use',
      })
      .expect('status', STATUS_400_BAD_REQUEST)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json).toEqual({
          message: 'The "name" field must be at least 4 characters long',
        });
      });
  });
});
