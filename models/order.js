const sequilize = require("../util/database");
const { Sequilize, DataTypes } = require("sequelize");

const Order = sequilize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
