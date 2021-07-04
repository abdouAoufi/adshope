const express = require("express");
const productRouter = require("./routes/admin");
const shoupRouter = require("./routes/shop");
const orderRouter = require("./routes/order");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", productRouter);
app.use(orderRouter);
app.use(shoupRouter);
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "erro.html"));
});

app.listen(3000);
