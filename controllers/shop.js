const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll((product) => {
    res.render("shop/product-list", {
      prods: product,
      pageTitle: "All products",
      path: "/products",
    });
  });
};

exports.getCart = (req, res) => {
  res.render("shop/cart", { pageTitle: "Your catr" , path:"/cart"});
};

// ! middleware for home page
exports.getIndex = (req, res) => {
  Product.fetchAll((product) => {
    res.render("shop/index", {
      prods: product,
      pageTitle: "Home",
      path: "/",
    });
  });
};


exports.getOrders = (req , res) => {
  res.render("shop/orders" , {pageTitle : "Orders" , path : "/orders"} )
}
exports.getCheckout = (req, res) => {
  res.render("/shop/checkout", { pageTitle: "Checkout page" });
};
