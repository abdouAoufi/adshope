const Product = require("../models/product");

// ? middleware to display more products

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

// ? middleware for home page
exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "All products",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// ? middleware to display carts

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your cart",
        products: user.cart.items,
      });
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productID;
  // console.log("=========",req.user.deleteCart);
  req.user.deleteCart(prodId).then((result) => {
    res.redirect("/cart");
  });
};

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

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
exports.getCheckout = (req, res) => {
  res.render("/shop/checkout", { pageTitle: "Checkout page" });
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
