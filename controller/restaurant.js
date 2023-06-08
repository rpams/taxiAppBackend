const Restaurant = require("../models/Restaurant");
const createError = require("../services/error");
const mongoose = require("mongoose")

function existID(obj, next) {
  if (obj.length <= 0) {
    return next(createError(404, "No restaurant"));
  }
}

/* ---------------------------- Create Restaurant --------------------------- */
const createRestaurant = async (req, res, next) => {
  if (!req?.body.name) {
    return next(createError(400, "Fill up all the fields"));
  }

  const newRestaurant = new Restaurant(req.body);

  try {
    const savedRestaurant = await newRestaurant.save();
    res.status(200).json(savedRestaurant);
  } catch (error) {
    next(error);
  }
};

/* --------------------------- Get All Restaurants -------------------------- */
const getAllRestaurants = async (req, res, next) => {
  try {
    const Restaurants = await Restaurant.find();
    res.status(200).json(Restaurants);
  } catch (error) {
    next(error);
  }
};

/* ------------------------ Get One Restaurant By Id ------------------------ */
const getOneRestaurantById = async (req, res, next) => {
  try {
    // const restaurant = await Restaurant.findById(req.params.id);
    const restaurant  = await Restaurant.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "foods",
          localField: "id",
          foreignField: "foods.restaurantId",
          as: "foods",
        },
      },
      // { "$unwind": "$foods" }
    ])
    existID(restaurant, next);
    res.status(200).json(restaurant[0]);
  } catch (error) {
    next(error);
  }
};

/* ---------------------------- Update Restaurant --------------------------- */
const updateRestaurant = async (req, res, next) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    existID(updatedRestaurant, next);
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    next(error);
  }
};

/* ------------------------------ Delete Restaurant ------------------------------ */
const deleteRestaurant = async (req, res, next) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    existID(deleted, next);
    res
      .status(200)
      .json({ success: true, message: "Restaurant has been deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getOneRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
