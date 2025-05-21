import { createReadStream } from "fs";
import csv from "csv-parser";

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

    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Không nhận được JSON: ${text}`);
    }

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
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
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
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      });
    }
  }
}

// Hàm lấy user_id từ email trong bảng auth.users
async function getUserIdByEmail() {
  try {
    let page = 1;
    const perPage = 3000;
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          apikey: SERVICE_ROLE_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Lỗi khi lấy danh sách user: ${response.statusText}`);
    }

    const users = await response.json();

    return users.users;
  } catch (error) {
    console.error("Lỗi:", error.message);
    return null;
  }
}
function convertToISODate(dateString) {
  // dateString: "18/12/1974 00:00"
  const [day, month, yearAndTime] = dateString.split("/");
  const [year, time] = yearAndTime.split(" ");
  return `${year}-${month}-${day} ${time || "00:00:00"}`;
}

async function getProfiles() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "GET",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi khi lấy dữ liệu profile");
    }

    // console.log("Danh sách profile:", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy profile:", error.message);
    return null;
  }
}
const users = await getUserIdByEmail();
const profiles = await getProfiles();
// Chuyển danh sách email trong profile thành Set để so sánh nhanh
const profileEmails = new Set(profiles.map((p) => p.email));

// Lọc ra user chưa có trong profiles
const usersNotInProfiles = users.filter(
  (user) => !profileEmails.has(user.email)
);
console.log("not in:", usersNotInProfiles);
?