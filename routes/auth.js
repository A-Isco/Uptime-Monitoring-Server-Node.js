const express = require("express");
const router = express.Router();

const {
  signUp,
  verifyAccount,
  login,
} = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/verify", verifyAccount);
router.post("/login", login);

module.exports = router;
