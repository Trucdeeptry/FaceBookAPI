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

async function getRandomImg(topic) {
  const length = 50;
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
}
