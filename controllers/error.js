exports.notFound = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isAuthenticated: req.iseLoggedIn,
    });
};

// ! this will be fired every error occurd 
exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render("500", {
      pageTitle: "No response from server",
      path: "/500",
      isAuthenticated: req.iseLoggedIn,
    });
};

