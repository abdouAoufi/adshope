const express = require("express");
const { check, body } = require("express-validator");
const adminController = require("../controllers/admin");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct); // ? the request goes from the left to right

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    check("title").isString().isLength({ min: 3 }).withMessage("Invalid title"),
    check("price").isFloat().withMessage("Invalid price"),
    check("description")
      .isLength({ min: 5, max: 200 })
      .withMessage("Invalid description"),
  ],
  isAuth,
  adminController.postAddProduct
);

//  /admin/products
router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    check("title").isString().isLength({ min: 3 }).withMessage("Invalid title"),
    check("price").isFloat().withMessage("Invalid price"),
    check("description")
      .isLength({ min: 5, max: 200 })
      .withMessage("Invalid description"),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.deleteProduct);
module.exports = router;
