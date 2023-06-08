const Cart = require("../models/Cart");
const createError = require("../services/error");
const { getWhoSendRequest } = require("./authentication");

function existID(obj, next) {
  if (obj === null) {
    return next(createError(404, "Id not found"));
  }
}

/* ------------------------------- Create Cart ------------------------------ */
const addToCart = async (req, res, next) => {
  // const {foodId, username} = req.params;
  const foodId = req?.params?.foodId;
  const username = getWhoSendRequest(req).username;

  try {
    let updatedCart = await Cart.updateOne(
      { foodId, username },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      const cart = await Cart.findOne({ foodId, username });
      // res.status(200).json(cart);
      await getCartItemss(username, req, res, next);
    } else {
      next(createError(403, "Add Failed"));
    }
  } catch (error) {
    next(error);
  }
};

/* ---------------------------- Remove from Cart ---------------------------- */
const removeFromCart = async (req, res, next) => {
  const foodId = req?.params?.foodId;
  const username = getWhoSendRequest(req).username;

  try {
    let cart = await Cart.findOne({ foodId, username, count: 1 });
    if (cart) {
      await Cart.deleteOne({ foodId, username });
      let cart = await Cart.findOne({ username });
      await getCartItemss(username, req, res, next);
      // res.status(200).json(cart);
    } else {
      let updatedCart = await Cart.updateOne(
        { foodId, username },
        { $inc: { count: -1 } },
        { upsert: true }
      );
      if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
        await getCartItemss(username, req, res, next);
        // res.status(200).json(cart);
      } else {
        next(createError(403, "Remove Failed"));
      }
    }
  } catch (error) {
    next(error);
  }
};

/* ----------------------------- Get cart items ----------------------------- */
const getCartItems = async (req, res, next) => {
  const username = getWhoSendRequest(req).username;

  try {
    let cartItems = await Cart.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          let: { foodObjId: { $toObjectId: "$foodId" } },
          from: "foods",
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$foodObjId"] } } }],
          as: "food",
        },
      },
      { $unwind: "$food" },
    ]);
    if (cartItems?.length > 0) {
      let itemsTotal = cartItems
        ?.map((cartItem) => cartItem?.food?.price * cartItem?.count)
        ?.reduce((a, b) => parseFloat(a) + parseFloat(b));
      let discount = 0;
      res.status(200).json({
        cartItems,
        metaData: {
          itemsTotal,
          discount,
          grandTotal: itemsTotal - discount,
        },
      });
    } else {
      res.status(200).json({ cart: null });
    }
  } catch (error) {
    next(error);
  }
};

const getCartItemss = async (username, req, res, next) => {
  try {
    let cartItems = await Cart.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          let: { foodObjId: { $toObjectId: "$foodId" } },
          from: "foods",
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$foodObjId"] } } }],
          as: "food",
        },
      },
      { $unwind: "$food" },
    ]);
    if (cartItems?.length > 0) {
      let itemsTotal = cartItems
        ?.map((cartItem) => cartItem?.food?.price * cartItem?.count)
        ?.reduce((a, b) => parseFloat(a) + parseFloat(b));
      let discount = 0;
      res.status(200).json({
        cartItems,
        metaData: {
          itemsTotal,
          discount,
          grandTotal: itemsTotal - discount,
        },
      });
    } else {
      res.status(200).json({ cart: null });
    }
  } catch (error) {
    next(error);
  }
};

/* ------------------------------ Get All Cart ------------------------------ */
const getAllCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find(req.query);
    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
};

/* --------------------------- Get One Cart By Id --------------------------- */
const getOneCartById = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);
    existID(cart, next);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

/* ------------------------------- Update Cart ------------------------------ */
const updateCart = async (req, res, next) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    existID(updatedCart, next);
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

/* ------------------------------- Delete Cart ------------------------------ */
const deleteCart = async (req, res, next) => {
  try {
    const deleted = await Cart.findByIdAndDelete(req.params.id);
    existID(deleted, next);
    res.status(200).json({ success: true, message: "Cart has been deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getAllCarts,
  getOneCartById,
  updateCart,
  deleteCart,
  removeFromCart,
  getCartItems,
};
