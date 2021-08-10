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

// ? GET RESET CONTROLLER

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
              console.log("Sent email succesfully ..!");
            })
            .catch((err) => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(error);
            });
        });
      })

      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};
// ? DISPLAY PASSWORD CHANGE PAGE
exports.getNewPassword = (req, res, next) => {
  let message = req.flash("error"); // retrive message if it's aviable
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        return res.render("auth/password.ejs", {
          path: "/new-password",
          pageTitle: "Update password",
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token,
        });
      } else {
        return res.redirect("/");
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
