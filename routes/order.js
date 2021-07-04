const express = require("express");

const router = express.Router();

router.get("/order", (req, res, next) => {
  console.log("Using another middleware called orders");
  res.send(`<h1>Order page </h1>`);
});

module.exports = router;
