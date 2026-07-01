const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./worker/jobWorker");
const supabase = require("./config/supabase");

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


async function test() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .limit(1);

  console.log(data, error);
}

test();


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});