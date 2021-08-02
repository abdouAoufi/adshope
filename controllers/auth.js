exports.getLogin = (req, res, next) => {
  const isLogged = req.get("Cookie").split(";")[3].split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLogged,
  });
};

exports.postLogin = (req, res) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
