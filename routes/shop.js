const express = require("express");
const adminData = require("./admin");
const orderData = require("./order");

const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log(orderData.orders);
  const orders = orderData.orders;
  const products = adminData.products;
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  res.render("index", { pageTitle: "Shop", prods: products, ords: orders , mascots});
});

module.exports = router;
