const Product = require("../models/product");

// ? middleware to display more products

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      displayProducts(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

function displayProducts(products) {
  products.forEach((product) => console.log(product._id.toString()));
}

// ? middleware for home page
exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "All products",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// ? middleware to display carts

exports.getCart = (req, res) => {
  req.user.getCart().then((products) => {
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your cart",
      products: products,
    });
  });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productID;
  const user = req.user;
  user.deleteById(prodId).then((result) => {
    res.redirect("/cart");
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId; // get product id from post request
  Product.findById(prodId)
    .then((product) => {
      console.log("Product found is => ", product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/");
    });
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

// exports.getOrders = (req, res) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then((orders) => {
//       res.render("shop/orders", {
//         pageTitle: "Orders",
//         path: "/orders",
//         orders: orders,
//       });
//     })
//     .catch((err) => console.log(err));
// };
// exports.getCheckout = (req, res) => {
//   res.render("/shop/checkout", { pageTitle: "Checkout page" });
// };

// exports.postOrder = (req, res) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user.createOrder().then((order) => {
//         return order.addProducts(
//           products.map((product) => {
//             product.orderItem = { quantity: product.cartItem.quantity };
//             return product;
//           })
//         );
//       });
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect("/orders");
//     })
//     .catch((err) => console.log(err));
// };
