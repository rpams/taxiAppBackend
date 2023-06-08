const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    foodId: { type: String },
    username: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);