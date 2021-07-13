const fs = require("fs");
const Cart = require("./cart");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductFromFile = (cb) => {
  fs.readFile(p, (err, content) => {
    if (err) return cb([]);
    cb(JSON.parse(content)); // execute the callback with the array retrived from the file .....
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.descreption = description;
    this.price = price;
  }
  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    getProductFromFile((products) => {
      if (this.id) {
        console.log("we have id !!!");
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }
  static deleteProduct(id) {
    getProductFromFile((products) => {
      const product = products.find((p) => p.id === id); // gives us object
      const updatedProduct = products.filter((p) => p.id !== id); // gives us new array
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
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
