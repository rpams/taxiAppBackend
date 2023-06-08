const Food = require("../models/Food");
const createError = require("../services/error");

function existID(obj, next) {
  if (obj === null) {
    return next(createError(404, "Id not found"));
  }
}

/* ------------------------------- Create Food ------------------------------ */
const createFood = async (req, res, next) => {
  if (!req?.body.restaurantId) {
    return next(createError(400, "Fill up all the fields"));
  }

  // const newFood = new Food(req.body);
  const newFood = new Food.insertMany(req.body);

  try {
    const savedFood = await newFood.save();
    res.status(200).json(savedFood);
  } catch (error) {
    next(error);
  }
};

/* ------------------------------ Get All Food ------------------------------ */
const getAllFoods = async (req, res, next) => {
  try {
    const foods = await Food.find(req.query);
    res.status(200).json(foods);
  } catch (error) {
    next(error);
  }
};

/* --------------------------- Get One Food By Id --------------------------- */
const getOneFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    existID(food, next);
    res.status(200).json(food);
  } catch (error) {
    next(error);
  }
};

/* ------------------------------- Update Food ------------------------------ */
const updateFood = async (req, res, next) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    existID(updatedFood, next);
    res.status(200).json(updatedFood);
  } catch (error) {
    next(error);
  }
};

/* ------------------------------- Delete Food ------------------------------ */
const deleteFood = async (req, res, next) => {
  try {
    const deleted = await Food.findByIdAndDelete(req.params.id);
    existID(deleted, next);
    res.status(200).json({ success: true, message: "Food has been deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFood,
  getAllFoods,
  getOneFoodById,
  updateFood,
  deleteFood,
};
