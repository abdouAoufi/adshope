const express = require("express");
const path = require("path");
const root = require("../helpers/path");

const router = express.Router();
const orders = [];
router.get("/order", (req, res, next) => {
  // res.sendFile(path.join(root, "views", "orders.html")); ! // ! instead we will render a pug file
  res.render("order", { pageTitle: "Orders" , path : "/order" });
});

router.post("/order", (req, res, next) => {
  orders.push(req.body);
  res.redirect("/");
});

exports.router = router;
exports.orders = orders;
