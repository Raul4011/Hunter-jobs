const cron = require("node-cron");
const db = require("../config/database");
const { analyzeJob } = require("../services/ai.service");

// 1. obtener jobs nuevos (NO mock en producción)
function fetchJobs() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM jobs WHERE id NOT IN (SELECT job_id FROM job_scores)",
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

// 2. guardar score real
function saveScore(jobId, result) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO job_scores (job_id, score, decision, reason)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [jobId, result.score, result.decision, result.reason],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
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