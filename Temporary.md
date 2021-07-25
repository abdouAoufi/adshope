INSERT INTO `node_schema`.`products` (`title`, `price`, `description`) VALUES ('Iphone xs', '899', 'Iphone xs new ');


module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.descreption = description;
    this.price = price;
  }
  // get all products form database ..
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
  save() {
    return db.execute(
      "INSERT INTO products (title , price , imageUrl , description) VALUES (? , ? , ? , ?)",
      [this.title, this.price, this.imageUrl, this.descreption]
    );
  }
  static deleteProduct(id) {}

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }
};


const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      console.log(updatedCart);
      const product = updatedCart.products.find((p) => p.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }
  static getCart(cb) {
    fs.readFile(p, (err, content) => {
      const cart = JSON.parse(content);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};



const express = require("express"); // express framework
const path = require("path"); // file system module
const errorController = require("./controllers/error"); // controller
const adminRouter = require("./routes/admin"); // route
const shopRoutes = require("./routes/shop"); // route
const bodyParser = require("body-parser"); // tool to decode incoming requests ...
const sequelize = require("./util/database"); // data base
const app = express(); // start the app ....
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// connect models to each other ......
Product.belongsTo(User, { onDelete: "CASCADE", constrain: true });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; // ! interesting object
      next();
    })
    .catch((err) => console.log(err));
});
// .sync()

sequelize
.sync({force : true})
  .then(() => {
    return User.findByPk(1); // gives us promise !
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Abdou", email: "Abdouou7@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// parse incoming requests ..
app.use(bodyParser.urlencoded({ extended: false }));

// use static files ....
app.use(express.static(path.join(__dirname, "public")));

// using middleware routers ...
app.use(shopRoutes);
app.use("/admin", adminRouter);
app.use(errorController.notFound);


const sequilize = require("../util/database");
const { Sequilize, DataTypes } = require("sequelize");

const CartItem = sequilize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity : DataTypes.INTEGER
});

module.exports = CartItem;


const sequilize = require("../util/database");
const { Sequilize, DataTypes } = require("sequelize");

const Order = sequilize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;


const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;



const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = Product ;

const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};
exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log(37, req.user.dataValues.id);
  req.user
    .createProduct({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
    })
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
  res.redirect("/admin/add-product");
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const idProduct = req.params.productId;

  if (!editMode) {
    res.redirect("/");
  } else {
    req.user
      .getProducts({ where: { id: idProduct } })
      .then((products) => {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          product: products[0],
          path: "/admin/edit-product",
          editing: editMode,
        });
      })
      .catch((err) => console.log(err));
  }
};

// get porducts for admin page
exports.getProducts = (req, res) => {
  req.user.getProducts().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin products",
      path: "/admin/products",
    });
  });
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesreption = req.body.description;
  Product.findByPk(prodId)
    .then((prod) => {
      prod.title = updatedTitle;
      prod.price = updatedPrice;
      prod.imageUrl = updatedImageUrl;
      prod.description = updatedDesreption;
      return prod.save();
    })
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};


const Product = require("../models/product");

// ? middleware to display more products

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

// ? middleware to display carts

// exports.getCart = (req, res) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart
//         .getProducts()
//         .then((products) => {
//           res.render("shop/cart", {
//             path: "/cart",
//             pageTitle: "Your cart",
//             products: products,
//           });
//         })
//         .catch((err) => console.log(err));
//     })
//     .catch((err) => console.log(err));
// };

// exports.postCartDeleteProduct = (req, res) => {
//   const prodId = req.body.productID;
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       product.cartItem.destroy(); // access the cart item table and delete it
//     })
//     .then((result) => {
//       res.redirect("/cart");
//       console.log("DELETED ITEM ");
//     })
//     .catch((err) => console.log(err));
  // CartItems.findAll({ where: { productId: prodId } })
  //   .then((product) => {
  //     return product[0].destroy();
  //   })
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch((err) => console.log(err));
// };

exports.postCart = (req, res) => {
  const prodId = req.body.productId; // get product id from post request
  let fetchcedCart;
  let newQuantity = 1;
  req.user
    .getCart() // it belongs to products
    .then((cart) => {
      fetchcedCart = cart;
      return cart.getProducts({ where: { id: prodId } }); // ! get products with condition not from single table
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId); // register new promise .
    })
    .then((product) => {
      return fetchcedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

// ? middleware for home page
exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "All products",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
exports.getCheckout = (req, res) => {
  res.render("/shop/checkout", { pageTitle: "Checkout page" });
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        return order.addProducts(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
