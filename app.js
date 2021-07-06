const express = require("express");
const adminData = require("./routes/admin");
const shoupRouter = require("./routes/shop");
const orderData = require("./routes/order");
const bodyParser = require("body-parser");
const path = require("path");
const pug = require("pug");
const expressHbs = require("express-handlebars");

const app = express();
app.engine('hbs' , expressHbs());

app.set("view engine", "hbs");
app.set("views", "views");


app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
// app.use("/admin", adminData.routes);
// app.use(orderData.router);
// app.use(shoupRouter);
app.get("/some" , (req , res , next) => {
  res.send('<h1> costume page ! </h1>')
})
app.use((req, res, next) => {
  res.status(404).render("404" , {pageTitle : "not found"});
});


app.listen(3000);
