const router = require("express").Router();
const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../services/verifyToken");

const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
  findUser
} = require("../controller/user");

// Check Authentication
router.get("/checkauthentication", (req, res, next) => {
  res.send("Hello user, yo are logged in");
});

router.get("/checkuser/:id", (req, res, next) => {
  res.send("Hello user, yo are logged in and you can delete your account");
});

router.get("/checkadmin/:id", (req, res, next) => {
  res.send("Hello admin, yo are logged in and you can delete all accounts");
});

// UPDATE USER
router.put("/:id", updateUser);

// DELETE USER
router.delete("/:id", deleteUser);

// FIND USER
router.get("/find/:id", findUser);

// GET ALL USERS
router.get("/allusers", getAllUser);

// GET USER WHO SEND REQUEST
router.get("/", verifyToken, getUser);

module.exports = router;
