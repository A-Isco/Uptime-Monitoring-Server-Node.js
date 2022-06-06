const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  signupValidationSchema,
  loginValidationSchema,
  verifyValidationSchema,
} = require("../schemas/authSchemas");

const { sendVerificationMail } = require("../services/verificationMailer");

const { genSalt, hash, compare } = bcrypt;
const { sign } = jwt;

// Sign up
const signUp = async (req, res) => {
  try {
    // Data validation
    const { error } = signupValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const isUserExists = await User.findOne({ email: req.body.email });
    if (isUserExists) return res.status(400).send("User already exists");

    // Hashing password
    const salt = await genSalt(14);
    const encryptedPassword = await hash(req.body.password, salt);

    // Generate verification code
    const code = Math.floor(Math.random() * (10000 - 1000 + 1)) + 100000;

    // Create a new user
    const user = new User({
      email: req.body.email,
      password: encryptedPassword,
      verificationCode: code,
    });

    await user.save();

    // Send verification mail with the verification code
    sendVerificationMail(user);

    res.status(200).json({
      message: `User: ${user._id} signed up, please verify then login, code ${code}`,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const verifyAccount = async (req, res) => {
  try {
    // Data validation
    const { error } = verifyValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    // Check if user verified
    if (user.isVerified == true) {
      return res.status(400).send("User is already verified, please login");
    }

    // Check if verification code is not valid
    if (user.verificationCode != req.body.verificationCode) {
      return res.status(400).send("Invalid code");
    }

    // Verify user
    await User.findOneAndUpdate({ _id: user._id }, { isVerified: true });
    res.status(200).send("User is verified, login");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Login
const login = async (req, res) => {
  try {
    // Data validation
    const { error } = loginValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    // Check if user's account not verified
    if (user.isVerified == false)
      return res
        .status(400)
        .send("User is not verified, please verify and login");

    // Check correct password
    const validPassword = await compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).send("Invalid password");

    // Generate token
    const token = sign(
      { userID: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(200).json({ user: { email: user.email }, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { signUp, verifyAccount, login };
