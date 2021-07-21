const sequilize = require("../util/database");
const { DataTypes } = require("sequelize");

const OrderItem = sequilize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = OrderItem;
