const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { getWhoSendRequest } = require("./authentication");

/* ------------------------------ Update User ------------------------------ */
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/* ------------------------------ Delete User ------------------------------ */
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (error) {
    next(error);
  }
};

/* -------------------------------- Find User ------------------------------- */
const findUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    /**
     * Return user data
     *? password excluded
     */
    const { password, isAdmin, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    // res.status(500).json(error);
    next(error);
  }
};


/* -------------------------------- Get User ------------------------------- */
const getUser = async (req, res, next) => {
  let token =
      req.headers.token ||
      req.cookies.access_token
    
  let username = ""

  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
    }
    username = jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        return ({err: err});
      } else {
        return user.username;
      }
    });}
      
  console.log(username)


  try {
    const user = await User.findOne({username});
    /**
     * Return user data
     *? password excluded
     */
    const { password, isAdmin, ...others } = user._doc;
    res.status(200).json({...others, token});
  } catch (error) {
    // res.status(500).json(error);
    next(error);
  }
};

/* ------------------------------ Get All User ----------------------------- */
const getAllUser = async (req, res, next) => {
  // Get user param ?new=
  const query = req.query.new;
  try {
    const users = query
      ? await User.find()
          .sort({ _id: -1 })
          .limit(5)
          .select("-password, -isAdmin")
      : await User.find().select("-password -isAdmin -createdAt -updatedAt");

    /**
     * Return user data
     *? password excluded
     */
    const { password, isAdmin, ...others } = users;
    res.status(200).json({ ...others });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
  findUser
};
