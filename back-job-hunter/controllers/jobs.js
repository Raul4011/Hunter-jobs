const db = require("../config/database");

// GET all jobs
exports.getJobs = (req, res) => {
  db.query("SELECT * FROM jobs ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET job by id
exports.getJobById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// CREATE job (scraping manual o automático)
exports.createJob = (req, res) => {
  const { title, company, location, description, url, source } = req.body;

  const sql = `
    INSERT INTO jobs (title, company, location, description, url, source)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, company, location, description, url, source],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
};