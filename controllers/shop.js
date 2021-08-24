const Product = require("../models/product");
const Order = require("../models/order");
const order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const ITEMS_PAGE = 2;
// ? GET HOME PAGE
exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      if (products.length === 0) {
        return res.redirect("/products");
      }
      return res.render("shop/index", {
        prods: products,
        pageTitle: "All products",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// ? GET PRODUCTS
exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// ? DISPLAY THE PRODUTS OF THE CART
exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId") // extracat also the products
    .execPopulate()
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your cart",
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

// ? ADD PRODUCT TO CART
exports.postCart = (req, res) => {
  const prodId = req.body.productId; // get product id from post request
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/");
    });
};

// ? DELETE PRODUCT FROM CART
exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productID;
  req.user.deleteCart(prodId).then((result) => {
    res.redirect("/cart");
  });
};

// ? DISPLAY SINGLE PRODUCT
exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// ? ADD ORDERS
exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }, // get the produtcts with its data
        };
      });
      const order = new Order({
        user: { email: req.user.email, userId: req.user },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

// ? GET ORDERS
exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteOrder = (req, res, next) => {
  Order.deleteMany({ "user.userId": req.user._id })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res) => {
  res.render("/shop/checkout", { pageTitle: "Checkout page" });
};

// ! HANDLE INVOICES
// serve file only to users who are auth
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("ERROR NO ORDER FOUND"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("ERROR NO ORDER MATCH"));
      }
      const invoiceName = "simple-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // save the file
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Incoice :", { underline: true });
      pdfDoc.text("-----------------------------------");

      let total = 0;
      order.products.forEach((prod) => {
        total = total + prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(16)
          .text(
            prod.product.title +
              " * " +
              prod.quantity +
              "      price :  " +
              "$" +
              prod.product.price
          );
      });

      pdfDoc.text("Total : " + total.toString());

      pdfDoc.end();

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `attachment; filename=${invoiceName}`
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   `inline; filename=${invoiceName}`
      // );
      // file.pipe(res);
    })
    .catch((err) => {
      return next(err);
    });
};
