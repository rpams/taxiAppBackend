const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    name: { type: String, required: true, },
    price: { type: String, required: true },
    image: { type: String, required: true },
    // categories: { type: [String], required: true },
    category: { type: String, required: true },
    description: { type: String },
    // ingredients: { type: [String], required: true },
    ingredients: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);