const frisby = require('frisby');
const { MongoClient } = require('mongodb');
const { STATUS_201_CREATED, STATUS_400_BAD_REQUEST } = require('../util');


const mongoDbUrl = 'mongodb://localhost:27017/api-login';

const url = 'http://localhost:3001';

const postUserMock = {
  user: {
    name: 'user',
    userName: 'user.user1',
  },
};

describe('1 - Endpoint POST /users', () => {
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
      name: 'admin', userName: 'admin', password: 'admin' };
    await db.collection('users').insertOne(users);
  });

  afterAll(async () => {
    await connection.close();
  });


  test('1.1 - Success case test in creating a new user', async () => {
    await frisby
      .post(`${url}/users`, {
        body: {
          name: 'user',
          userName: 'user.user1',
          password: '123456',
        },
      })
      .expect('status', STATUS_201_CREATED)
      .then((responseCreate) => {
        const { json: { user } } = responseCreate;
 
        expect(user.name).toEqual(postUserMock.user.name);
        expect(user.userName).toEqual(postUserMock.user.userName);
        expect(user.password).toEqual(postUserMock.user.password);
      });
  });

  test('1.2 - It will be validated that it is not possible to register an unnamed user', async () => {
    await frisby
      .post(`${url}/users`, {
        userName: 'user.user',
        password: '123456',
      })
      .expect('status', STATUS_400_BAD_REQUEST)
      .then((responseCreate) => {
        const { json } = responseCreate;
        expect(json).toEqual({ message: 'The "name" field is mandatory.' });
      });
  });

  test('1.3 - Test to see if the username field exists', async () => {
    await frisby
      .post(`${url}/users`, {
        name: 'user',
        password: '123456',
      })
      .expect('status', STATUS_400_BAD_REQUEST)
      .then((responseCreate) => {
        const { json } = responseCreate;
        expect(json).toEqual({ message: 'The "userName" field is mandatory' });
      });
  });

});
