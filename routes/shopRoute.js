const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

// router.get("/checkout" , shopController.getCheckout);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/delete-order", isAuth, shopController.deleteOrder);

// this is dynamic link ......
router.get("/products/:productId",  shopController.getProduct);

module.exports = router;
