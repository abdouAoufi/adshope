const getDb = require("../util/database").getDb;
const mongoConnect = require("mongoDb");

class User {
  constructor(userName, email) {
    this.name = userName;
    this.email = email;
  }
  save() {
    const db = getDb(); // gives us instance for database ....
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongoConnect.ObjectId(prodId) });
  }
}

module.exports = User;
