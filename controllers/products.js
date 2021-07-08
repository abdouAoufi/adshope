
// this is a middleware 
exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.addNewProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};
