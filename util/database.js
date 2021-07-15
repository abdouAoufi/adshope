const mysql = require("mysql2");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_schema", "root", "abdou1331", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize ;
