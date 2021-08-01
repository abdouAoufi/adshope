const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    _id: { type: Schema.Types.ObjectId },
    name: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);
