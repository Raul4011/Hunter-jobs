const express = require("express");
const cors = require("cors");
require("./worker/jobWorker");
require("dotenv").config();

const jobsRoutes = require("./routes/jobs");
const applicationsRoutes = require("./routes/aplications");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);

// server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});