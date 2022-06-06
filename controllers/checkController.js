const Check = require("../models/Check");
const Report = require("../models/Report");
const {
  createCheckValidationSchema,
  updateCheckValidationSchema,
} = require("../schemas/checkSchemas");
const { cronService } = require("../services/cronService");

// Create a check
const createCheck = async (req, res) => {
  try {
    // Data Validation
    const { error } = createCheckValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if check exists
    const isCheckExists = await Check.findOne({
      name: req.body.name,
      url: req.body.url,
    });

    if (isCheckExists) {
      return res.status(400).send("Check already exists");
    }

    // Get the check owner
    const { userID } = req.userInfo;

    // Create a new check
    const check = new Check({
      ownedBy: userID,
      name: req.body.name,
      url: req.body.url,
      protocol: req.body.protocol,
      path: req.body.path,
      port: req.body.port,
      timeout: req.body.timeout,
      interval: req.body.interval,
      threshold: req.body.threshold,
      authentication: req.body.authentication,
      httpHeaders: req.body.httpHeaders,
      tags: req.body.tags,
    });

    await check.save();

    // Create report
    const report = new Report({
      checkId: check._id,
      status: 200,
      availability: 0,
    });

    await report.save();

    // adding task to the cron service
    cronService.addTask(check);

    res.status(200).json({ check, report });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all checks
const getAllChecks = async (req, res) => {
  try {
    // Get the checks owner
    const { userID } = req.userInfo;

    const checks = await Check.find({ ownedBy: userID });

    if (checks.length == 0) {
      return res.status(200).send("No URLs to check");
    }

    res.status(200).json(checks);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get check
const getCheck = async (req, res) => {
  try {
    // Get the check owner
    const { userID } = req.userInfo;

    const check = await Check.findOne({
      ownedBy: userID,
      _id: req.params.id,
    });

    if (!check) {
      return res.status(400).send("Check not found");
    }

    res.status(200).json(check);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update check
const updateCheck = async (req, res) => {
  try {
    // Data Validation
    const { error } = updateCheckValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Get the check owner
    const { userID } = req.userInfo;

    const check = await Check.findByIdAndUpdate(
      { ownedBy: userID, _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!check) {
      return res.status(400).send("Check not found");
    }

    res.status(200).send("Check updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete check
const deleteCheck = async (req, res) => {
  try {
    // Get the owner of the check
    const { userID } = req.userInfo;

    // Delete the check and its corresponding report
    const check = await Check.findOneAndDelete({
      ownedBy: userID,
      _id: req.params.id,
    });

    if (!check) {
      return res.status(400).send("Check not found");
    }

    await Report.findOneAndDelete({ checkId: req.params.id });

    // Remove check from crone tasks
    await cronService.removeTask(req.params.id);

    res.status(200).send("Check and its report have been successfully deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createCheck,
  getAllChecks,
  getCheck,
  updateCheck,
  deleteCheck,
};
