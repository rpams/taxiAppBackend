const {register, login, userExist, tokenRefresh} = require("../controller/authentication");
const router = require("express").Router();

const {
   verifyToken,
   verifyUser,
   verifyAdmin,
 } = require("../services/verifyToken");

// Register
router.post("/register", register);
router.post("/login", login);
router.get("/user-exist", userExist);
router.get("/refresh-token", tokenRefresh)

module.exports = router