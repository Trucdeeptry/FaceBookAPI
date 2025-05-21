import { createReadStream } from "fs";
import csv from "csv-parser";
import { log } from "console";
import fs from "fs/promises";
import { response } from "express";
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
async function getAllPosts() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=id,likes,hashtags`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      }
    );
    if (!response.ok) throw new Error(response.statusText);

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("❌ Lỗi khi lấy posts:", error.message);
    return [];
  }
}

// Hàm 2: Xử lý likes nếu hashtag trùng và user chưa tương tác
// async function updateLikesForUser(userId, userHashtags, allPosts) {
//   const matchedPosts = allPosts.filter((post) =>
//     post.hashtags?.some((tag) => userHashtags.includes(tag.toLowerCase()))
//   );

//   if (matchedPosts.length === 0) return;

//   matchedPosts.forEach((post) => {
//     if (post.hashtags.includes("Victory")) {
//       console.log(post.hashtags);
//     }
//   });
//   for (const post of matchedPosts) {
//     const newLikes = post.likes || [];
//     const alreadyReacted = newLikes.some((like) => like.user_id === userId);
//     if (alreadyReacted) {
//       console.log(user_id);
//     }
//     if (!alreadyReacted) {
//       const react = {
//         react: randomReact(), // like, love, haha, etc.
//         user_id: userId,
//       };
//       newLikes.push(react);

//       try {
//         const response = await fetch(
//           `${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`,
//           {
//             method: "PATCH",
//             headers: {
//               apikey: SERVICE_ROLE_KEY,
//               Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ likes: newLikes }),
//           }
//         );

//         if (response.status === 204) {
//           console.log(`✅ [${post.id}] Like updated (204 No Content)`);
//         } else {
//           const data = await response.json();
//           console.log(`✅ [${post.id}] Like updated:`, data);
//         }
//       } catch (error) {
//         console.error(`❌ [${post.id}] Lỗi khi cập nhật likes:`, error.message);

//       }
//     }
//   }
// }
async function updateLikesForUser(userId, userHashtags, allPosts) {
  const matchedPosts = allPosts.filter((post) => {
    if (!post.hashtags || !Array.isArray(post.hashtags)) {
      console.warn(`⚠️ [${post.id}] Hashtags không hợp lệ:`, post.hashtags);
      return false;
    }

    if (post.likes.length > 0) {
      return false;
    }
    const isMatch = post.hashtags.some((tag) =>
      userHashtags.includes(tag.toLowerCase())
    );

    return isMatch;
  });

  // console.log(`📊 Số bài viết khớp và chưa có likes: ${matchedPosts.length}`);

  const batchSize = 10;
  for (let i = 0; i < matchedPosts.length; i += batchSize) {
    const batch = matchedPosts.slice(i, i + batchSize);
    console.log(`📦 Xử lý batch: ${i} đến ${i + batchSize}`);
    await Promise.all(
      batch.map(async (post) => {
        const newLikes = post.likes || [];
        const alreadyReacted = newLikes.some(
          (like) => like && like.user_id === userId
        );
        console.log(
          `[${post.id}] Đã tương tác: ${alreadyReacted}, Likes hiện tại:`,
          newLikes
        );

        if (!alreadyReacted) {
          const react = {
            react: randomReact(),
            user_id: userId,
          };
          newLikes.push(react);
          console.log(`➕ [${post.id}] Thêm like:`, react);

          try {
            const response = await fetch(
              `${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`,
              {
                method: "PATCH",
                headers: {
                  apikey: SERVICE_ROLE_KEY,
                  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ likes: newLikes }),
              }
            );

            if (response.status === 204) {
              console.log(`✅ [${post.id}] Like updated (204 No Content)`);
            } else if (response.status === 429) {
              console.warn(`⚠️ [${post.id}] Rate limit exceeded, retrying...`);
              await new Promise((resolve) => setTimeout(resolve, 1000));
              // Thử lại yêu cầu
              const retryResponse = await fetch(
                `${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`,
                {
                  method: "PATCH",
                  headers: {
                    apikey: SERVICE_ROLE_KEY,
                    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ likes: newLikes }),
                }
              );
              if (retryResponse.status === 204) {
                console.log(
                  `✅ [${post.id}] Retry successful (204 No Content)`
                );
              } else {
                const data = await retryResponse.json();
                console.log(`✅ [${post.id}] Retry updated:`, data);
              }
            } else {
              const data = await response.json();
              console.log(`✅ [${post.id}] Like updated:`, data);
            }
          } catch (error) {
            console.error(
              `❌ [${post.id}] Lỗi khi cập nhật likes:`,
              error.message
            );
          }
        }
      })
    );
    console.log(`⏳ Chờ 100ms trước batch tiếp theo`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
// Hàm lấy user_id từ email trong bảng auth.users
async function getUserIdByEmail() {
  try {
    let page = 1;
    const perPage = 2500;
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
const posts = await getAllPosts();

createReadStream("users.csv")
  .pipe(csv())
  .on("data", async (row) => {
    try {
      const cleanedRow = {};
      for (const rawKey in row) {
        const cleanKey = rawKey.trim().replace(/^['"]+|['"]+$/g, "");
        cleanedRow[cleanKey] = row[rawKey];
      }

      const email =
        cleanedRow.firstname.toLowerCase() +
        cleanedRow.surname.toLowerCase() +
        "@gmail.com";
      //   const user = users.find((user) => user.email === email);
      //   if (!user) {
      //     // console.log("❌ Không tìm thấy user với email:", email);
      //   }
      //   const existingProfile = profiles.find(
      //     (profile) => profile.user_id === user.id
      //   );
      //   if (existingProfile) {
      //     // console.log("❌ Email đã tồn tại trong profiles:", email);
      //   }
      //   const user = usersNotInProfiles.find((u) => u.email === email);

      //   if (!user) {
      //     console.log("❌ Không tìm thấy user chưa có profile với email:", email);
      //     return;
      //   }
      //   const profile = {
      //     firstname: cleanedRow.firstname,
      //     surname: cleanedRow.surname,
      //     gender: parseInt(cleanedRow.gender),
      //     birthday: convertToISODate(cleanedRow.birthday),
      //     country: cleanedRow.country,
      //     email,
      //     user_id: user.id,
      //   };

      //   const inserted = await insertProfile(profile);
      const user = users.find((user) => user.email === email);
      if (!user) {
        return;
      }

      let jsonStr;
      let arr = [];
      try {
        jsonStr = cleanedRow.SuggestedHashtags.replace(/'/g, '"');
        arr = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Lỗi parse JSON: ", e);
      }

      await updateLikesForUser(user.id, arr, posts);
    } catch (err) {
      console.error("❌ Lỗi khi xử lý dòng CSV:", err.message);
    }
  })
  .on("end", () => {
    console.log("✅ Xử lý xong CSV");
  });
