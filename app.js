const express = require("express"); // express framework
const path = require("path"); // file system module
const errorController = require("./controllers/error"); // controller
const adminRouter = require("./routes/admin"); // route
const shopRoutes = require("./routes/shop"); // route
const bodyParser = require("body-parser"); // tool to decode incoming requests ...
const sequelize = require("./util/database"); // data base
const app = express(); // start the app ....

// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

sequelize
  .sync()
  .then((result) => {
    // ! the most important one start a web server .
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
