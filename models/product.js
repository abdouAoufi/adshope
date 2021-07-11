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
    cb(JSON.parse(content)); // execute the callback with the array retrived from the file .....
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.descreption = description;
    this.price = price;
  }
  save() {
    this.id = Math.random().toString();
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

  static findById(id, cb) {
    getProductFromFile((products) => {
      let product = products.find((p) => p.id === id); // gives us back an object
      cb(product); // ? execute the callback function with that object [RETRIEVED]
    });
  }
};
