const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// /admin/products
router.get("/products" , adminController.getProducts);


router.get("/edit-product/:productId" , adminController.getEditProduct);

router.post("/edit-product" , adminController.postEditProduct);

// router.post("/delete-product" , adminController.deleteProduct)
module.exports = router;
