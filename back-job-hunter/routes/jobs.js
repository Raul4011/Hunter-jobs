const router = require("express").Router();
const jobsController = require("../controllers/jobs");

router.get("/", jobsController.getJobs);
router.post("/", jobsController.createJob);

router.get("/:id", jobsController.getJobById);

module.exports = router;