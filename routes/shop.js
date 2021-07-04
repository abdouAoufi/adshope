const express = require("express");
const path = require("path");
const root = require("../helpers/path");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(root, "views", "shop.html"));
});

module.exports = router;
