const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcryptjs");
const createError = require("../services/error");
const jwt = require("jsonwebtoken");

const userRoute = require("../routes/user");

// Registering function
const register = async (req, res, next) => {
  if (
    !req?.body.username ||
    !req?.body.password ||
    !req?.body.email ||
    !req?.body.phone
  ) {
    return next(createError(400, "Fill up all the fields"));
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) return next(createError(401, "User already existed"));

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hash,
    });

    const newCart = new Cart({ username: req.body.username });

    await newUser.save();
    await newCart.save();
    res
      .status(200)
      .json({ data: newUser, status: true, message: "User has been created" });
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------- Login --------------------------------- */
const login = async (req, res, next) => {
  if (!req?.body.username || !req?.body.password) {
    return next(createError(400, "Fill up all the fields"));
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) return next(createError(400, "Wrong password!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, username: user.username },
      process.env.JWT,
      { expiresIn: "24h" }
    );

    const { password, isAdmin, ...others } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ status: true, token: token, message: "You've been logged in" });
    // .send({ ...others });
  } catch (error) {
    next(error);
  }
};

/* -------------------------- Check if user exists -------------------------- */
const userExist = async (req, res, next) => {
  const messages = {
    email: "Email already taken",
    username: "This unsername is taken",
  };

  try {
    const queryType = Object.keys(req?.query)[0];
    const userObject = await User.findOne(req?.query);
    res
      .status(200)
      .send(
        !userObject
          ? { status: true, message: `This ${queryType} is not taken` }
          : { status: false, message: messages[queryType] }
      );
  } catch (error) {
    next(error);
  }
};

const getWhoSendRequest = (req) => {
  try {
    let token =
      req.headers.token ||
      req.cookies.access_token ||
      req?.headers["authorization"];

    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token?.length);
      }
      let username = jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
          return { err: err };
        } else {
          return user;
        }
      });

      return username;
    } else {
      return { er: "no token" };
    }
  } catch (error) {
    return { error: error };
  }
};

/* ------------------------------ Token refresh ----------------------------- */
const tokenRefresh = (req, res, next) => {
  try {
    let token =
      req.headers.token ||
      req.cookies.access_token ||
      req?.headers["authorization"];
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token?.length);
      }
      jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
          return next(createError(403, "Token is not valid!"));
        } else {
          let newToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin, username: user.username },
            process.env.JWT,
            { expiresIn: "24h" }
          );
          res
            .cookie("access_token", newToken, {
              httpOnly: true,
            })
            .status(200)
            .json({ data: newToken });
        }
      });
    } else {
      return next(createError(401, "Token is missing"));
    }
  } catch (error) {
    return next(createError(401, "Token refresh failed"));
  }
};

module.exports = {
  register,
  login,
  userExist,
  tokenRefresh,
  getWhoSendRequest,
};
