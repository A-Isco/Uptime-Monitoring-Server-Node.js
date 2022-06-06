const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  //checking the header for authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Access Denied!");
  }

  // grabbing the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // adding user info to the req before going to the next middleware
    req.userInfo = { userID: payload.userID, email: payload.email };
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = auth;
