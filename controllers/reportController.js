const Check = require("../models/Check");
const Report = require("../models/Report");

// Get report
const getReport = async (req, res) => {
  try {
    // Get the check owner
    const { userID } = req.userInfo;

    const check = await Check.findOne({
      ownedBy: userID,
      _id: req.params.checkId,
    });

    if (!check) {
      return res
        .status(400)
        .send("Report not found , There's no check with that id");
    }

    const report = await Report.findOne({ checkId: check._id });

    if (!report) {
      return res.send("Report not found");
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get All Reports
const getAllReports = async (req, res) => {
  try {
    // Get the reports owner
    const { userID } = req.userInfo;

    const checks = await Check.find({ ownedBy: userID });

    if (checks.length == 0) {
      return res.status(400).send("No reports found");
    }

    let checkIds = [];

    checks.forEach((check) => {
      checkIds.push(check._id);
    });

    const reports = await Report.find({ checkId: { $in: checkIds } });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get reports by Tags
const getReportsByTags = async (req, res) => {
  try {
    // Get the check owner
    const { userID } = req.userInfo;

    const checks = await Check.find({
      ownedBy: userID,
      tags: { $in: req.body.tags },
    });

    if (!checks) return res.send("Report not found");

    let checkIds = [];

    checks.forEach((check) => {
      checkIds.push(check._id);
    });

    if (checkIds.length == 0) {
      return res.status(400).send("No reports for these tag(s)");
    }

    const reports = await Report.find({ checkId: { $in: checkIds } });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getReport, getAllReports, getReportsByTags };
