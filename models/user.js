const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        }, // object id
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCart = function (cartId) {
  let updatedList = this.cart.items.filter((item) => {
    return item.productId.toString() !== cartId.toString();
  });
  this.cart.items = updatedList;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const getDb = require("../util/database").getDb;
// const mongoConnect = require("mongoDb");

// class User {
//   constructor(userName, email, cart, id) {
//     this.name = userName;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//   save() {
//     const db = getDb(); // gives us instance for database ....
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     console.log("LIST OF ITEMS ...", this.cart.items);
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId == product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items]; // copy of old carts in DB

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongoConnect.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     db.collection("users").updateOne(
//       { _id: new mongoConnect.ObjectId(this._id) },
//       { $set: { cart: updatedCart } }
//     );
//   }

//   getCart() {
//     const db = getDb();
//     const productsIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productsIds } }) // find all products that matchs the list in the cart ...
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }
//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongoConnect.ObjectId(prodId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongoConnect.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongoConnect.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongoConnect.ObjectId(this._id) })
//       .toArray();
//   }

//   deleteById(prodId) {
//     const db = getDb();
//     let updatedList = [...this.cart.items];
//     updatedList = updatedList.filter((prod) => {
//       return prod.productId.toString() !== prodId.toString();
//     });
//     const updatedCart = {
//       items: updatedList,
//     };
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoConnect.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       )
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
