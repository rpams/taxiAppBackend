const router = require("express").Router();
const {
  createRestaurant,
  getAllRestaurants,
  getOneRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require("../controller/restaurant");

const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../services/verifyToken");

// Get All Restaurants
router.get("/", getAllRestaurants);

// Create Restaurant
router.post("/create", createRestaurant);

// Get One Restaurant By Id
router.get("/:id", getOneRestaurantById);

// Upadte Restaurant
router.put("/:id", updateRestaurant);

// Delete Restaurant
router.delete("/:id", deleteRestaurant);

module.exports = router;
