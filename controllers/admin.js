const Product = require("../models/product");
const { validationResult } = require("express-validator");
// ? GET ADD PRODUCT ADMIN
exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};
// ? POST ADD PRODUCT ADMIN
exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const desc = req.body.description;
  const errors = validationResult(req);
  console.log(errors.array())
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      hasError: true,
      errorMessage: errors.array()[0].msg,
      editing: false,
      product: { title, imageUrl, price, description: desc },
    });
  }

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
          hasError: true,
          path: "/admin/edit-product",
          editing: editMode,
          errorMessage: null,
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
        errorMessage: null,
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
  const errors = validationResult(req);
  console.log(errors.array())
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      hasError: true,
      errorMessage: errors.array()[0].msg,
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesreption,
        errorMessage: errors.array()[0].msg,
      },
    });
  }
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
