const express = require("express");
const adminData = require("./admin");
const orderData = require("./order");

const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log(orderData.orders);
  const orders = orderData.orders;
  const products = adminData.products;
  res.render("shop", { docTitle: "Shop", prods: products, ords: orders });
});

module.exports = router;
