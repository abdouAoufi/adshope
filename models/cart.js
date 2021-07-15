const sequilize = require("../util/database");
const { Sequilize, DataTypes } = require("sequelize");

const Cart = sequilize.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Cart;
