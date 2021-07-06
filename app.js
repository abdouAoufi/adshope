const express = require("express");
const adminData = require("./routes/admin");
const shoupRouter = require("./routes/shop");
const orderData = require("./routes/order");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.routes);
app.use(orderData.router);
app.use(shoupRouter);
app.get("/some", (req, res, next) => {
  res.send("<h1> costume page ! </h1>");
});
app.use( (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('404' , {pageTitle : "Page not found"});
  });

app.listen(3000);
