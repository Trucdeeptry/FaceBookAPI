const supabase = require("../router/composables/supabase.js");

const topics = [
  "travel",
  "food",
  "nature",
  "adventure",
  "culture",
  "fashion",
  "architecture",
  "wildlife",
  "technology",
  "art",
  "music",
  "sports",
  "history",
  "space",
  "ocean",
  "mountains",
  "cities",
  "festivals",
  "wellness",
  "photography",
  "science",
  "fantasy",
  "vintage",
  "modern",
  "minimalism",
  "luxury",
  "street",
  "gardening",
  "animals",
  "vehicles",
  "weather",
  "holidays",
  "education",
  "business",
  "fitness",
  "astronomy",
  "crafts",
  "dance",
  "literature",
  "movies",
  "gaming",
  "spirituality",
  "rural",
  "urban",
  "mythology",
  "exploration",
  "fashion",
  "health",
  "family",
  "romance",
];
function getRandomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}
async function getRandomImg(topic) {
  const length = 5;
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${topic}&per_page=${length}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "tzmVzX3VKCkvo6BNji6X9Nh8FRBKJtwu2nI3KFwfkmzmYVJVdo0GibUU",
      },
    }
  );
  const data = await response.json();
  console.log(data);

  const img = data.photos[randomIntFromInterval(1, length - 1)].src.original;
  return img;
}
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function updatePostImages() {
  try {
    const { data: posts, error: fetchError } = await supabase
      .from("posts")
      .select("id");

    if (fetchError) {
      console.error("Error fetching posts:", fetchError);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log("No posts found.");
      return;
    }

    // Cập nhật từng bài post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const randomTopic = getRandomTopic();
      const imageUrl = await getRandomImg(randomTopic);

      const { error: updateError } = await supabase
        .from("posts")
        .update({ image: imageUrl })
        .eq("id", post.id);

      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError);
      } else {
        console.log(`Updated post ${post.id} with image: ${imageUrl}`);
      }

      // Nghỉ 3 giây sau mỗi 10 bài viết
      if ((i + 1) % 10 === 0 && i < posts.length - 1) {
        console.log("Pausing for 3 seconds...");
        await delay(3000); // Nghỉ 3 giây (3000ms)
      }
    }

    console.log("All posts updated successfully.");

    console.log("All posts updated successfully.");
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Chạy hàm
updatePostImages();
