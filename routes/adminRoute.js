const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct); // ? the request goes from the left to right

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

//  /admin/products
router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.deleteProduct);
module.exports = router;
