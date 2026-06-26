const cron = require("node-cron");
const db = require("../config/database");

// 1. simulador de jobs (luego lo reemplazas por scraping real)
function fetchJobsMock() {
  return [
    {
      title: "Frontend Developer React",
      company: "Tech Corp",
      location: "Remote",
      description: "React, JavaScript, APIs",
      url: "https://job1.com",
      source: "mock",
    },
  ];
}

// 2. guardar en DB
function saveJob(job) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO jobs (title, company, location, description, url, source)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        job.title,
        job.company,
        job.location,
        job.description,
        job.url,
        job.source,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
}

// 3. IA fake score (después lo conectamos a OpenAI)
function scoreJob(job) {
  const skills = ["react", "node", "javascript"];
  let score = 0;

  const text = (job.title + job.description).toLowerCase();

  skills.forEach((skill) => {
    if (text.includes(skill)) score += 30;
  });

  return Math.min(score, 100);
}

// 4. guardar score
function saveScore(jobId, score) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO job_scores (job_id, score, reason)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [jobId, score, "auto score"], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// 5. pipeline completo
async function processJobs() {
  console.log("Running job worker...");

  const jobs = fetchJobsMock();

  for (const job of jobs) {
    const jobId = await saveJob(job);

    const score = scoreJob(job);

    await saveScore(jobId, score);

    console.log(`Job ${job.title} scored: ${score}`);
  }
}

// 6. CRON cada 30 min
cron.schedule("*/30 * * * *", () => {
  processJobs();
});