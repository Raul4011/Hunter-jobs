
// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.SUPABASE_URL;

// // ESTA ES LA IMPORTANTE (service_role key)
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// const supabase = createClient(supabaseUrl, supabaseServiceKey);

// module.exports = supabase;

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;