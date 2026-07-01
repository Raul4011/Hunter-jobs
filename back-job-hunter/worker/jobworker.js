const cron = require("node-cron");
const { supabase } = require("../config/supabase");
const { analyzeJob } = require("../services/ai.service");

// 1. obtener jobs nuevos
async function fetchJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .not(
      "id",
      "in",
      `(select job_id from job_scores)`
    );

  if (error) throw error;
  return data || [];
}

// 2. guardar score real
async function saveScore(jobId, result) {
  const { error } = await supabase.from("job_scores").insert([
    {
      job_id: jobId,
      score: result.score,
      decision: result.decision,
      reason: result.reason,
    },
  ]);

  if (error) throw error;
}

// 3. pipeline
async function processJobs() {
  console.log("[WORKER] Running job scoring pipeline...");

  try {
    const jobs = await fetchJobs();

    for (const job of jobs) {
      try {
        const profile = {
          experience_years: 3,
          skills: ["React", "Node", "Express"],
          strong_skills: ["React", "JavaScript"],
          weak_skills: ["DevOps"],
        };

        const result = await analyzeJob(job, profile);

        await saveScore(job.id, result);

        console.log(
          `[OK] ${job.title} → ${result.score} (${result.decision})`
        );
      } catch (jobError) {
        console.error("[JOB ERROR]", job.id, jobError.message);
      }
    }
  } catch (error) {
    console.error("[WORKER ERROR]", error.message);
  }
}

// 4. cron seguro (evita solapamiento simple)
let running = false;

cron.schedule("*/30 * * * *", async () => {
  if (running) return;

  running = true;
  try {
    await processJobs();
  } finally {
    running = false;
  }
});