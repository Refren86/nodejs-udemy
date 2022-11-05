const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; // extracting client constructor

let _db;

const connectToMongo = async (callback) => {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://root:root@cluster0.9w8do.mongodb.net/shop?retryWrites=true&w=majority'
    );
    console.log('Database connected!');
    _db = client.db(); // store access to the database

    callback();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

function getDb() {
  if (_db) {
    return _db;
  }

  throw 'No database found!';
};

exports.getDb = getDb;
exports.connectToMongo = connectToMongo;
