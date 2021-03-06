const { MongoClient } = require('mongodb')

const DB_NAME = process.env.DB_NAME || 'api-login';
const MONGO_DB_URL = process.env.MONGO_DB_URL || `mongodb://localhost:27017/${DB_NAME}`;
// const MONGO_DB_URL = `mongodb://mongodb:27017/${DB_NAME}`;

const connection = () =>
  MongoClient
    .connect(MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(DB_NAME))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = connection;