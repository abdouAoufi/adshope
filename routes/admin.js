const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/add-product", (req, res, next) => {
  fs.readFile("./index.html", "utf-8", (error, data) => {
    if (error) {
      res.send("<h1>Error getting data !</h1>");
    }
    res.send(data);
  });
});

// we add another middleware to handle another request
router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
