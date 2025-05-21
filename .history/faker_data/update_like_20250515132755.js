const supabase = require("../router/composables/supabase.js");

// Hàm tạo user ảo bằng Admin API
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cmRuYW1jdmp5dG5hc2h5aWx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTczMzYyMywiZXhwIjoyMDYxMzA5NjIzfQ.9EmpW994jmzj9bGFUWaF2pgpe4Gn3GWzqAYAvb2PWgs"; // Lấy từ Supabase Dashboard > Settings > API
const SUPABASE_URL = "https://xwrdnamcvjytnashyilv.supabase.co";

async function insertProfile(profile) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(profile),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("❌ Lỗi khi insert:", data);
    return null;
  }

  return data[0]; // trả về user vừa insert
}

const profile = {
  firstname: 'test',
  surname: 'test 2',
  gender: 1,
  birthday: '1990-01-01 00:00:00',
  country: 'vietnam',
};

insertProfile(profile)