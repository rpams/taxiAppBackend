const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    tags: {type: [String], required: true},
    location: { type: String, required: true },
    distance: { type: Number, required: true },
    time: { type: Number, required: true, unique: true },
    images: {
      "logo": String,
      "poster": String,
      "cover": String
    },
    categories: {type: [String], required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);