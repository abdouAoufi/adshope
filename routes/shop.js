const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item" , shopController.postCartDeleteProduct);

router.get("/products", shopController.getProducts);

router.get("/checkout" , shopController.getCheckout);

router.get("/orders" , shopController.getOrders)

// this is dynamic link ......
router.get("/products/:productId" , shopController.getProduct);


module.exports = router;
