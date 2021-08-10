const Product = require("../models/product");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fileHelper = require("../util/file");

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
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      hasError: true,
      errorMessage: errors.array()[0].msg,
      editing: false,
      product: { title, price, description },
    });
  }
  // if the file wasn't image ...
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "add Product",
      path: "/admin/add-product",
      hasError: true,
      errorMessage: "Attached file is not an image!",
      editing: false,
      product: { title, price, description },
    });
  }
  // other wise save the product
  const imageUrl = image.path;
  const product = new Product({
    title,
    price,
    desc: description,
    imageUrl,
    userId: req.user,
  });
  // we have save method
  product
    .save()
    .then((result) => {
      res.redirect("/admin/add-product");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// ? GET EDIT PRODUCT
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const idProduct = req.params.productId;

  if (!editMode) {
    res.redirect("/");
  } else {
    Product.findById(idProduct)
      .then((product) => {
        console.log("Product to be send to edit => ", product);
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          product: product,
          hasError: true,
          path: "/admin/edit-product",
          editing: editMode,
          errorMessage: null,
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
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
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesreption = req.body.description;
  const errors = validationResult(req);
  console.log(errors.array());
  // validation step
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      hasError: true,
      errorMessage: errors.array()[0].msg,
      editing: true,
      product: {
        title: updatedTitle,
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
      // ? if we have valid image otherwise keep the old one
      if (image) {
        fileHelper(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then((result) => res.redirect("/"));
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// ? DELETE PRODUCT
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("product not found !!"));
      }
      fileHelper(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then((result) => {
      console.log("DESTROYED PRD .....");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
