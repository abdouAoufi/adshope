const Product = require("../models/product");
const Cart = require("../models/cart");

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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productID;
  console.log(37, prodId);
  Product.findById(prodId, (p) => {
    Cart.deleteProduct(prodId , p.price);
    res.redirect("/cart")
  });
};

exports.postCart = (req, res) => {
  Product.findById(req.body.productId, (product) => {
    Cart.addProduct(req.body.productId, product.price);
  });
  res.redirect("/cart");
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

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (result) => {
    res.render("shop/product-detail", {
      path: "/products",
      pageTitle: result.title,
      product: result,
    });
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", { pageTitle: "Orders", path: "/orders" });
};
exports.getCheckout = (req, res) => {
  res.render("/shop/checkout", { pageTitle: "Checkout page" });
};
