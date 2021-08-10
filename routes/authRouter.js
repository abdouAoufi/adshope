const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const resetContreoller = require("../controllers/reset")
const User = require("../models/user");

const router = express.Router();
// ? GET REQUEST LOGIN
router.get("/login", authController.getLogin);
// ? POST REQUEST LOGIN
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email ...")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("This email is not bound with any account!");
          }
        });
      }),
    body("password", "Please enter valid password!")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
// ? POST REQUEST
router.post("/logout", authController.postLogout);
// ? GET REQUEST
router.get("/signup", authController.getSignup);
// ? POST REQUEST
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email ...")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already exists, pick up one different!!"
            );
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter valid password!")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password has to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);
// ? GET REQUEST
router.get("/reset", resetContreoller.getReset);
// ? POST REQUEST
router.post("/reset", resetContreoller.postReset);
// ? GET REQUEST
router.get("/reset/:token", resetContreoller.getNewPassword);
// ? POST REQUESR
router.post("/new-password", resetContreoller.postNewPassword);

module.exports = router;
