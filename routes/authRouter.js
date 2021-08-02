const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();
// ? GET REQUEST
router.get("/login", authController.getLogin);
// ? POST REQUEST
router.post("/login", authController.postLogin);
// ? POST REQUEST
router.post("/logout" , authController.postLogout)

module.exports = router;
