const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};
exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl , null , req.user._id);
  product
    .save()
    .then((result) => {
      console.log("created");
      res.redirect("/admin/add-product");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const idProduct = req.params.productId;

  if (!editMode) {
    res.redirect("/");
  } else {
    Product.findById(idProduct)
      .then((product) => {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          product: product,
          path: "/admin/edit-product",
          editing: editMode,
        });
      })
      .catch((err) => console.log(err));
  }
};

// get porducts for admin page
exports.getProducts = (req, res) => {
  Product.fetchAll().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin products",
      path: "/admin/products",
    });
  });
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesreption = req.body.description;
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesreption,
    updatedImageUrl,
    prodId
  );
  product
    .save()
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
