const mysql = require("mysql2");

const pool = mysql.createPool(
   {
      host : "localhost",
      database : "node_schema",
      user:"root",
      password:"abdou1331",
   }
);

module.exports = pool.promise();