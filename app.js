const express = require("express"); // express framework
const path = require("path"); // file system module
const errorController = require("./controllers/error"); // controller
const adminRouter = require("./routes/admin"); // route
const shopRoutes = require("./routes/shop"); // route
const bodyParser = require("body-parser"); // tool to decode incoming requests ...
const app = express(); // start the app ....
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");




// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// parse incoming requests ..
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {

  User.findById("61027d23f33b5343c02b0314")
    .then((user) => {
      req.user = new User(user.name , user.email , user.cart , user._id) ;
      next();
    })
    .catch((err) => console.log(err));
});

// use static files ....
app.use(express.static(path.join(__dirname, "public")));

// using middleware routers ...
app.use(shopRoutes);
app.use("/admin", adminRouter);
app.use(errorController.notFound);




// app.listen(3000)