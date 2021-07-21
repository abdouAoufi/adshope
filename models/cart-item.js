const sequilize = require("../util/database");
const { Sequilize, DataTypes } = require("sequelize");

const CartItem = sequilize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity : DataTypes.INTEGER
});

module.exports = CartItem;
