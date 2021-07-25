const express = require("express"); // express framework
const path = require("path"); // file system module
const errorController = require("./controllers/error"); // controller
const adminRouter = require("./routes/admin"); // route
const shopRoutes = require("./routes/shop"); // route
const bodyParser = require("body-parser"); // tool to decode incoming requests ...
const app = express(); // start the app ....
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");
const { log } = require("console");

// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

/* 
app.get("/add-user", (req, res) => {
  const user = new User("Abduo", "Abdou@gmail.com");
  user
    .save()
    .then((result) => {
      res.redirect("/");
      console.log("Created success");
    })
    .catch((err) => console.log(err));
}); 
*/



// parse incoming requests ..
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
  User.findById("60fd61e7fdad1a3c304efd01")
    .then((user) => {
      req.user = user;
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

mongoConnect(() => {
  app.listen(3000);
});
