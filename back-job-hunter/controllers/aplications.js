const db = require("../config/database");

// GET all applications
exports.getApplications = (req, res) => {
  const sql = `
    SELECT a.*, j.title, j.company
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// APPROVE job
exports.approveJob = (req, res) => {
  const { jobId } = req.params;

  const sql = `
    INSERT INTO applications (job_id, status)
    VALUES (?, 'approved')
    ON DUPLICATE KEY UPDATE status='approved'
  `;

  db.query(sql, [jobId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Job approved" });
  });
};

// REJECT job
exports.rejectJob = (req, res) => {
  const { jobId } = req.params;

  const sql = `
    INSERT INTO applications (job_id, status)
    VALUES (?, 'rejected')
    ON DUPLICATE KEY UPDATE status='rejected'
  `;

  db.query(sql, [jobId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Job rejected" });
  });
};