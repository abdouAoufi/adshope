const express = require("express"); // express framework
const path = require("path"); // file system module
const errorController = require("./controllers/error"); // controller
const adminRouter = require("./routes/adminRoute"); // route
const shopRoutes = require("./routes/shopRoute"); // route
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser"); // tool to decode incoming requests ...
const User = require("./models/user"); // user model
const mongoose = require("mongoose"); // user model
const session = require("express-session"); // session
const MongoDbStore = require("connect-mongodb-session")(session); // store sessions ....
const csrf = require("csurf"); // protecting against CSRF
const flash = require("connect-flash"); // for sending data to the client on the session
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const MONGODBURL = "mongodb://localhost:27017/"; // URL where we store database ...

const app = express(); // start the app ....
const store = new MongoDbStore({ uri: MONGODBURL, collection: "sessions" });

const csrfProtection = csrf(); // for sucurity

mongoose
  .connect(MONGODBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("The server running on 127.0.0.1:3000");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// ? set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// ? use static files ....
app.use(express.static(path.join(__dirname, "public")));
app.use("/images" ,express.static(path.join(__dirname, "images")));

// ? parse incoming requests ..
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use(bodyParser.urlencoded({ extended: false }));

// ? register session  ...
app.use(
  session({
    secret: "my secrec",
    resave: false,
    saveUninitialized: false,
    store: store, // store sessions in mongoDB
  }) // ! set up session
);

// ? used for send message to UI
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user; // ! IT'S MONGOOSE OBJECT BUT IT WAS FILLED BY SESSION DATA
      next();
    })
    .catch((err) => {
      next(new Error("Dummy"));
    });
});

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(shopRoutes);
app.use("/admin", adminRouter);
app.use(authRouter);
app.use("/500", errorController.get500);
app.use(errorController.notFound);

app.use((err, req, res, next) => {
  // console.log(err);
  res.status(500).render("500", {
    pageTitle: "No response from server",
    path: "/500",
    err : err,
    isAuthenticated: req.iseLoggedIn,
  });
});
