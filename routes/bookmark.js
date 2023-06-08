const router = require("express").Router();

const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../services/verifyToken");

const {
  addBookmark,
  getBookmarks,
  getOneBookmarkById,
  removeBookmark,
} = require("../controller/bookmark");

// Get Bookmarks
router.get("/", getBookmarks);

// Add Bookmarks
router.post("/:restaurantId", addBookmark);

// Remove Bookmark
router.delete("/:restaurantId", removeBookmark);

// Get One Bookmark By Id
router.get("/find/:id", getOneBookmarkById);

module.exports = router;
