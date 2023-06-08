const router = require("express").Router();

const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../services/verifyToken");

const {
  createFood,
  getAllFoods,
  getOneFoodById,
  updateFood,
  deleteFood,
} = require("../controller/food");

// Get All Foods
router.get("/", getAllFoods);

// Create Food
router.post("/create", createFood);

// Get One Food By Id
router.get("/:id", getOneFoodById);

// Upadte Food
router.put("/:id", updateFood);

// Delete Food
router.delete("/:id", deleteFood);

module.exports = router;
