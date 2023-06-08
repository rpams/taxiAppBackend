const router = require("express").Router();

const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../services/verifyToken");

const {
  addToCart,
  getOneCartById,
  removeFromCart,
  getCartItems
} = require("../controller/cart");


// Get All Carts
router.get("/", getCartItems);

// Add to Cart
router.post("/:foodId", addToCart);

// Get One Cart By Id
router.get("/find/:id", getOneCartById);

// Remove from Cart
router.delete("/:foodId", removeFromCart);

module.exports = router;
