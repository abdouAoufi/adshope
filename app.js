const express = require("express");
const productRouter = require("./routes/admin");
const shoupRouter = require("./routes/shop");
const orderRouter = require("./routes/order");
const bodyParser = require("body-parser");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(productRouter);
app.use(orderRouter);
app.use(shoupRouter);

app.listen(3000);
