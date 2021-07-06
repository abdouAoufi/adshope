const express = require("express");
const fs = require("fs");
const path = require("path");
const root = require("../helpers/path");

const router = express.Router();
const products = [];
router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(root, "views", "add-product.html")); // we send html file here
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  var tagline = "No programming concept is complete without a cute animal mascot.";
  res.render("add-product", { pageTitle: "Add orders" , path : "/admin/add-product" ,  headerValue : "You can enter your information Here " , tagline , mascots});
});

// we add another middleware to handle another request
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title, quantity: req.body.quantity });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
