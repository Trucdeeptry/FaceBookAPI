const { faker } = require("@faker-js/faker");
const supabase = require("../router/composables/supabase.js");
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