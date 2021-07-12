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
    Product.findById(idProduct, (product) => {
      console.log(product);
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        product: product,
        path: "/admin/edit-product",
        editing: editMode,
      });
    });
  }
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log(title);
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res) => {
  Product.fetchAll((product) => {
    res.render("admin/products", {
      prods: product,
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
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesreption,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect("/");
};

exports.deleteProduct = (req, res) => {
  Product.deleteProduct(req.body.productId);
  res.redirect("/");
};
