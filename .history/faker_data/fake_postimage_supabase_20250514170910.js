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
  try {
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

    const img = data.photos[randomIntFromInterval(1, length - 1)].src.original;
    return img;
  } catch (error) {
    console.log(error);
    return false;
  }
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
      console.log(post.image);
      if (post.image) {
        console.log("bỏ qua");
        continue;
      }
      const randomTopic = getRandomTopic();
      const imageUrl = await getRandomImg(randomTopic);
      if (!imageUrl) {
        console.error(`Error fetching image for post ${post.id}`);
        break;
      }
      const { error: updateError } = await supabase
        .from("posts")
        .update({ image: imageUrl })
        .eq("id", post.id);

      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError);
      } else {
        console.log(`Updated post ${post.id} with image: ${imageUrl}`);
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
