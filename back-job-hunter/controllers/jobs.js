const { supabase } = require("../config/supabase");

// GET all jobs
exports.getJobs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET job by id
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

// CREATE job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, url, source } = req.body;

    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title,
          company,
          location,
          description,
          url,
          source,
        },
      ])
      .select("id")
      .single();

    if (error) return res.status(500).json(error);

    res.json({ id: data.id });
  } catch (err) {
    res.status(500).json(err);
  }
};