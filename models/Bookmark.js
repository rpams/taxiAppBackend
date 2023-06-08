const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookmark", BookmarkSchema);
