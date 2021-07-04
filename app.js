const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use("/add-product", (req, res, next) => {
  res.send(
    `<form action='/product' method="POST">
      <input type='text' name='title'/>
      <input type='number' name='quantity'/>
      <button type='submit'>Add product </button>
    </form>`
  );
});

// we add another middleware to handle another request
app.use("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  res.send("<h1>hello from express </h1>");
});

app.listen(3000);
