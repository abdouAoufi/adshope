const Product = require("../models/product");

// this is a middleware
exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res) => {
  Product.fetchAll((product) => {
    res.render("shop/product-list", {
      prods: product,
      pageTitle: "Shop",
      path: "/",
      hasProducts: product.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};


exports.getCart = (req , res) => {
  res.render("shop/cart" , {pageTitle : "Cart"})
}

exports.getPProducts = (req , res) => {
  res.render("admin/products" , {pageTille : "Products .."})
}