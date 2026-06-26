const router = require("express").Router();
const applicationsController = require("../controllers/aplications");

router.get("/", applicationsController.getApplications);
router.post("/:jobId/approve", applicationsController.approveJob);
router.post("/:jobId/reject", applicationsController.rejectJob);

module.exports = router;