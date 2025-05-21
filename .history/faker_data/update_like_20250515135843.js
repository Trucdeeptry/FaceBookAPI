const fs = require("fs");
const csv = require("csv-parser");
const fetch = require("node-fetch");

// Hàm tạo user ảo bằng Admin API
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cmRuYW1jdmp5dG5hc2h5aWx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTczMzYyMywiZXhwIjoyMDYxMzA5NjIzfQ.9EmpW994jmzj9bGFUWaF2pgpe4Gn3GWzqAYAvb2PWgs"; // Lấy từ Supabase Dashboard > Settings > API
const SUPABASE_URL = "https://xwrdnamcvjytnashyilv.supabase.co";

async function createVirtualUser(email, password) {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi khi tạo user");
    }

    console.log("User ảo đã được tạo:", data.id);
    return data.id;
  } catch (error) {
    console.error("Lỗi:", error.message);
    return null;
  }
}
async function insertProfile(profile) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
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

function randomReact() {
  const reactions = ["like", "love", "wow", "sad", "angry"];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

async function updateLikes(userId, hashtags) {
  const query = encodeURIComponent(
    `{"hashtags":{"overlaps":${JSON.stringify(hashtags)}}}`
  );
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?select=id,likes&or=${query}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  const posts = await response.json();
  for (const post of posts) {
    const newLikes = post.likes || [];
    if (!newLikes.includes(userId)) {
      const react = {
        react: randomReact(),
        user_id: userId,
      };
      newLikes.push(react);

      await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      });
    }
  }
}
function normalizeColumnNames(data) {
  return data.map((item) => {
    const normalized = {};
    for (const key in item) {
      // Loại bỏ dấu nháy đơn và chuẩn hóa tên cột
      const cleanKey = key.replace(/['"]/g, ""); // Xóa dấu nháy đơn hoặc kép
      normalized[cleanKey] = item[key];
    }
    return normalized;
  });
}


fs.createReadStream("users.csv")
  .pipe(csv())
  .on("data", async (row) => {
    try {
      
      
        console.log();
        
      const user_id = await createVirtualUser(
        row['firstname'].toLowerCase() + "@gmail.com",
        "9942994Ngoc"
      );
      const hashtags = JSON.parse(row.SuggestedHashtags.replace(/'/g, '"'));
      const profile = {
        firstname: row['firstname'],
        surname: row.surname,
        gender: parseInt(row.gender),
        birthday: row.birthday,
        country: row.Country,
        email: row['firstname'].toLowerCase() + "@gmail.com",
        user_id: user_id,
      };

      const inserted = await insertProfile(profile);
      if (inserted) {
        console.log("✅ Inserted user:", inserted.firstname);
        await updateLikes(inserted.id, hashtags);
      }
    } catch (err) {
      console.error("❌ Lỗi khi xử lý dòng CSV:", err.message);
    }
  })
  .on("end", () => {
    console.log("✅ Xử lý xong CSV");
  });
