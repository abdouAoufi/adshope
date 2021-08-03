const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message, // pull the message by the key ...
  });
};

// ! THE SESSION IS GET CREATED HERE
exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password."); // ! we include flash message on the request ...
        return res.redirect("/login"); // fail to find the user
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true; // session creation
            req.session.user = user; // session creation
            req.session.save(() => {
              return res.redirect("/");
            });
          } else {
            req.flash("error", "Invalid email or password.");  
            res.redirect("/login");
          }
        })
        .catch((err) => res.redirect("/login"));
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message, // pull the message by the key ...
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists !!"); // ! we include flash message on the request ...
        return res.redirect("/signup");
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: { items: [] },
        });
        user.save().then(() => {
          res.redirect("/login");
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  console.log(req.body);
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
