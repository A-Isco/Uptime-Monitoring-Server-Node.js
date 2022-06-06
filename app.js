const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

// auth middleware
const authMiddleware = require("./middleware/authentication");

// Routers
const authRouter = require("./routes/auth");
const checksRouter = require("./routes/checks");
const reportsRouter = require("./routes/reports");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/checks", authMiddleware, checksRouter);
app.use("/api/reports", authMiddleware, reportsRouter);

module.exports = app;
