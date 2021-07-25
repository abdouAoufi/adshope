const getDb = require("../util/database").getDb;
const mongoConnect = require("mongoDb");

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    const db = getDb(); // gives us instance for database ....
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    console.log("LIST OF ITEMS ...", this.cart.items);
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId == product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]; // copy of old carts in DB

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongoConnect.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    db.collection("users").updateOne(
      { _id: new mongoConnect.ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }

  getCart() {
    
  }
  static findById(prodId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongoConnect.ObjectId(prodId) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
