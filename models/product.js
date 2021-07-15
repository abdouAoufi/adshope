const Cart = require("./cart");
const db = require("../util/database");
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.descreption = description;
    this.price = price;
  }
  // get all products form database ..
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
  save() {
    return db.execute(
      "INSERT INTO products (title , price , imageUrl , description) VALUES (? , ? , ? , ?)",
      [this.title, this.price, this.imageUrl, this.descreption]
    );
  }
  static deleteProduct(id) {}

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }
};
