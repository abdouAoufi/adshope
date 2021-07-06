const express = require("express");
const adminData = require("./routes/admin");
const shoupRouter = require("./routes/shop");
const orderData = require("./routes/order");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.set("view engine", "pug");
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
app.use((req, res, next) => {
  res.status(404).render("404" , {pageTitle : "not found"});
});

app.listen(3000);
