const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const idProduct = req.params.productId;
  console.log(idProduct);
  if (!editMode) {
    res.redirect("/");
  } else {
    Product.findByPk(idProduct)
      .then((product) => {
        console.log(product);
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

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  })
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
  res.redirect("/admin/add-product");
};

// get porducts for admin page
exports.getProducts = (req, res) => {
  Product.findAll().then((products) => {
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
  Product.findByPk(prodId)
    .then((prod) => {
      prod.title = updatedTitle;
      prod.price = updatedPrice;
      prod.imageUrl = updatedImageUrl;
      prod.description = updatedDesreption;
      return prod.save();
    })
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
