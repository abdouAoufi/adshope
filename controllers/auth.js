const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const transport = nodeMailer.createTransport({
  service: "hotmail",
  auth: {
    user: "aoufitarek@outlook.fr",
    pass: "Tarek2002",
  },
});

// ? GET LOGIN CONTROLLER
exports.getLogin = (req, res, next) => {
  let message = req.flash("error"); // retrive message if it's aviable
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message, // pull the message by the key ...
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

// ? POST LOGIN CONTROLLER
exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg, // pull the message by the key ...
      oldInput: { email: email, password: password },
      validationErrors: errors.array(),
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true; // ! session creation
            req.session.user = user; // ! session creation
            req.session.save(() => {
              return res.redirect("/");
            });
          } else {
            req.flash("error", "You entered wrong password!");
            res.redirect("/login");
          }
        })
        .catch((err) => res.redirect("/login"));
    })
    .catch((err) => {
      return res.redirect("/login");
    });
};

// ? GET SIGN UP CONTROLLER
exports.getSignup = (req, res, next) => {
  let message = req.flash("error"); // retrive message if it's aviable
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
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

// ? POST SIGN UP CONTROLLER
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg, // pull the message by the key ...
      oldInput: { email: email, password: password },
      validationErrors: errors.array(),
    });
  }

  bcrypt.hash(password, 12).then((hashedPassword) => {
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    user.save().then(() => {
      res.redirect("/login");
      // transport
      //   .sendMail({
      //     from: "aoufitarek@outlook.fr",
      //     to: email,
      //     subject: "confirmation",
      //     html: "<h1>Welcome ...>!</h1>",
      //   })
      //   .then((result) => {
      //     console.log("Sent succesfully ..!");
      //   })
      //   .catch((err) => console.log(err));
    });
  });
};

// ? POST LOGOUT CONTROLLER
exports.postLogout = (req, res) => {
  console.log(req.body);
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res) => {
  let message = req.flash("error"); // retrive message if it's aviable
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password ",
    errorMessage: message, // pull the message by the key ...
  });
};

// ? POST RESET CONTROLLER

exports.postReset = (req, res) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account bound with that email!");
          return res.redirect("/reset");
        }
        user.resetToken = token; // save token in db to include in into link
        user.resetTokenExpiration = Date.now() + 36000000;
        user.save().then((result) => {
          res.redirect("/");
          transport
            .sendMail({
              from: "aoufitarek@outlook.fr",
              to: email,
              subject: "Password reset",
              html: `
                <p> 
                You requested a password reset click this this 
                <a href="http://localhost:3000/reset/${token}">link</a> 
                to reset your password 
                </p>
                `,
            })
            .then((result) => {
              console.log("Sent succesfully ..!");
            })
            .catch((err) => console.log(err));
        });
      })

      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        return res.render("auth/password.ejs", {
          path: "/new-password",
          pageTitle: "Update password ",
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token,
        });
      } else {
        return res.redirect("/");
      }
    })
    .catch((err) => console.log(err));
  let message = req.flash("error"); // retrive message if it's aviable
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
};

exports.postNewPassword = (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => res.redirect("/login"))
    .catch((err) => console.log(err));
};
