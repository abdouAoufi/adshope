const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://abbdou:abdoumca1921@firsttry.vojoa.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected !!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "no db found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
