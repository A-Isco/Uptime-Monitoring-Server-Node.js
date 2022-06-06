const express = require("express");
const router = express.Router();

const {
  createCheck,
  getAllChecks,
  getCheck,
  updateCheck,
  deleteCheck,
} = require("../controllers/checkController");

router.route("/").post(createCheck).get(getAllChecks);
router.route("/:id").get(getCheck).patch(updateCheck).delete(deleteCheck);

module.exports = router;
