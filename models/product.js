const fs = require("fs");
const path = require("path");

const getProductFromFile = (cb) => {
  const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
  );
  fs.readFile(p, (err, content) => {
    if (err) return cb([]);
    cb(JSON.parse(content));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
    this.storedProduct = [];
  }
  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    getProductFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
  static fetchAll(cb) {
    getProductFromFile(cb);
  }
};
