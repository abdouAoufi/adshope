const express = require("express"); // express framework
const path = require("path"); // file system module
const errorController = require("./controllers/error"); // controller
const adminRouter = require("./routes/adminRoute"); // route
const shopRoutes = require("./routes/shopRoute"); // route
const bodyParser = require("body-parser"); // tool to decode incoming requests ...
const User = require("./models/user"); // user model
const mongoose = require("mongoose"); // user model

const app = express(); // start the app ....

const url = "mongodb://localhost:27017/";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    User.findOne() // give the first user
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Abdou",
            email: "Abdou@gmail.com",
            cart: { items: [] },
          });
          user.save();
        }
      })
      .catch((err) => console.log(err));
    console.log("The server running on 127.0.0.1:3000");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// ! set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// ! use static files ....
app.use(express.static(path.join(__dirname, "public")));

// ! parse incoming requests ..
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("6102b1d12e4a912f9bc1e026")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// using middleware routers ...
app.use(shopRoutes);
app.use("/admin", adminRouter);
app.use(errorController.notFound);

