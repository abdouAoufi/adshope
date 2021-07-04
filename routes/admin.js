const express = require("express");
const fs = require("fs");
const path = require("path");
const root = require("../helpers/path");

const router = express.Router();

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(root, "views", "add-product.html"));
});

// we add another middleware to handle another request
router.post("/add-product", (req, res, next) => {
  console.log("requst coming => ", req.body);
  res.redirect("/");
});

module.exports = router;
