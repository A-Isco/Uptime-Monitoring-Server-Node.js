const express = require("express");
const router = express.Router();

const {
  getReport,
  getAllReports,
  getReportsByTags,
} = require("../controllers/reportController");

router.route("/").get(getAllReports);
router.route("/:checkId").get(getReport);
router.route("/tags").post(getReportsByTags);

module.exports = router;
