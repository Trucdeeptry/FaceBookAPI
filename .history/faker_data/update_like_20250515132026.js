const supabase = require("../router/composables/supabase.js");
const fs = require("fs");
const csv = require("csv-parser");

fs.createReadStream("your-file.csv")
  .pipe(csv())
  .on("data", async (row) => {
    try {
      const hashtags = JSON.parse(row.SuggestedHashtags.replace(/'/g, '"'));

      // 2. Insert vào bảng profiles
      const { data: profileData, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            firstname: row.firstname,
            surname: row.surname,
            gender: parseInt(row.Gender),
            birthday: row.birthday.split(" ")[0], // "1958-10-15 00:00:00" → "1958-10-15"
            country: row.Country,
          },
        ])
        .select("id")
        .single();

      if (insertError) throw insertError;

      const userId = profileData.id;

      // 3. Tìm các bài post có hashtag trùng
      const { data: matchingPosts, error: postError } = await supabase
        .from("posts")
        .select("id, likes, hashtags")
        .overlaps("hashtags", hashtags);

      if (postError) throw postError;

      // 4. Cập nhật mỗi bài viết
      for (const post of matchingPosts) {
        const currentLikes = post.likes || [];
        if (!currentLikes.includes(userId)) {
          const updatedLikes = [...currentLikes, userId];

          const { error: updateError } = await supabase
            .from("posts")
            .update({ likes: updatedLikes })
            .eq("id", post.id);

          if (updateError) console.error("Lỗi khi update bài viết:", updateError.message);
        }
      }

      console.log(`Đã xử lý user ${row.firstname} ${row.surname}`);
    } catch (err) {
      console.error("Lỗi:", err.message);
    }
  })
  .on("end", () => {
    console.log("✅ Hoàn tất việc import và cập nhật likes.");
  });
📝 Ghi chú:
