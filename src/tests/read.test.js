const frisby = require('frisby');
const { MongoClient } = require('mongodb');
const { STATUS_201_CREATED, STATUS_422_UNPROCESSABLE_ENTITY, STATUS_200_OK } = require('../util');


const mongoDbUrl = 'mongodb://localhost:27017/api-login';

const url = 'http://localhost:3001';

describe('2 - Endpoint GET /users/:id', () => {
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
      userName: 'root@userName.com',
      password: 'admin',
    };
    await db.collection('users').insertOne(users);
  });

  afterAll(async () => {
    await connection.close();
  });

  test('2.1 - It will be validated that the endpoint returns a user based on the route id', async () => {
    let result;

    await frisby
      .post(`${url}/users`, {
        name: 'user',
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
      .get(`${url}/users/${result.user._id}`)
      .expect('status', STATUS_200_OK)
      .then((secondResponse) => {
        const {
          json: { user },
        } = secondResponse;
        const userName = user.name;
        const quantityuser = user.userName;
        expect(userName).toEqual('user');
        expect(quantityuser).toEqual('user.silva');
      });
  });

  test('2.2 - It will be validated that it is not possible to list a user that does not exist', async () => {
    await frisby
      .get(`${url}/users/999999`)
      .expect('status', STATUS_422_UNPROCESSABLE_ENTITY)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const { message } = json;
        expect(message).toEqual("User not found");
      });
  });
});
