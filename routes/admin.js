const express = require("express");
const fs = require("fs");
const path = require("path");
const root = require("../helpers/path");

const router = express.Router();
const products = [];
router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(root, "views", "add-product.html")); // we send html file here
  res.render("add-product", { pageTitle: "Add orders" , path : "/admin/add-product" });
});

// we add another middleware to handle another request
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title, quantity: req.body.quantity });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
