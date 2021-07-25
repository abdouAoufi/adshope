const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, desc, imageUrl) {
    this.title = title;
    this.price = price;
    this.decs = desc;
    this.imageUrl = imageUrl;
  }

  save(){

  }
}

module.exports = Product;
