const Product = require("../models/product");
const Order = require("../models/order");
const order = require("../models/order");

// ? GET HOME PAGE
exports.getIndex = (req, res) => {
  console.log(req.session.user);
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "All products",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// ? GET PRODUCTS
exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// ? DISPLAY THE PRODUTS OF THE CART
exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId") // extracat also the products
    .execPopulate()
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your cart",
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

// ? ADD PRODUCT TO CART
exports.postCart = (req, res) => {
  const prodId = req.body.productId; // get product id from post request
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/");
    });
};

// ? DELETE PRODUCT FROM CART
exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productID;
  req.user.deleteCart(prodId).then((result) => {
    res.redirect("/cart");
  });
};

// ? DISPLAY SINGLE PRODUCT
exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// ? ADD ORDERS
exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }, // get the produtcts with its data
        };
      });
      const order = new Order({
        user: { email: req.user.email, userId: req.user },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

// ? GET ORDERS
exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteOrder = (req, res, next) => {
  Order.deleteMany({ "user.userId": req.user._id })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res) => {
  res.render("/shop/checkout", { pageTitle: "Checkout page" });
};
