const Product = require("../models/product");
// ? GET ADD PRODUCT ADMIN
exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};
// ? POST ADD PRODUCT ADMIN
exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const desc = req.body.description;
  const product = new Product({
    title,
    price,
    desc,
    imageUrl,
    userId: req.user,
  });
  // we have save method
  product
    .save()
    .then((result) => {
      res.redirect("/admin/add-product");
    })
    .catch((err) => console.log(err));
};
// ? GET EDIT PRODUCT
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
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  }
};

// ? GET PRODUCTS FOR ADMIN PAGE
//
exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .populate("userId")
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

// ? POST EDIT PRODUCT
exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesreption = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.desc = updatedDesreption;
      product.imageUrl = updatedImageUrl;
      return product.save().then((result) => res.redirect("/"));
    })
    .catch((err) => console.log(err));
};
// ? DELETE PRODUCT
exports.deleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
