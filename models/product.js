const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");
class Product {
  constructor(title, price, desc, imageUrl, id , userId) {
    this.title = title;
    this.price = price;
    this.decs = desc;
    this.imageUrl = imageUrl;
    if (id) this.id = new mongoDb.ObjectId(id);
    this.userId = userId ;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this.id) {
      // update product
      dbOp = db
        .collection("products")
        .updateOne({ _id: new mongoDb.ObjectId(this.id) }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const _db = getDb();
    return _db
      .collection("products")
      .find({ _id: new mongoDb.ObjectId(id) })
      .next()
      .then((product) => {
        console.log(26, product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const _db = getDb();
    return _db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDb.ObjectId(prodId) })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
