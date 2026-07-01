const { supabase } = require("../config/supabase");

// GET all applications (con join a jobs)
exports.getApplications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        jobs (
          title,
          company,
          location,
          url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

// APPROVE job (crea evento, no sobrescribe)
exports.approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { error } = await supabase.from("applications").insert([
      {
        job_id: jobId,
        status: "approved",
        applied_at: null,
      },
    ]);

    if (error) return res.status(500).json(error);

    res.json({ message: "Job approved" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// REJECT job (crea evento, no sobrescribe)
exports.rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { error } = await supabase.from("applications").insert([
      {
        job_id: jobId,
        status: "rejected",
        applied_at: null,
      },
    ]);

    if (error) return res.status(500).json(error);

    res.json({ message: "Job rejected" });
  } catch (err) {
    res.status(500).json(err);
  }
};