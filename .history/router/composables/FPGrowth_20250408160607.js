const postsModel = require("../../model/postsModel");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const port = 3000;
require("dotenv").config();
const uri = 'mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/FaceBookDB';
mongoose.connect(uri);
app.listen(port, () => {
  console.log("listening on port ", port);
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Chỉ cho phép yêu cầu từ localhost:5173
  })
);


const FPGrowth = require("node-fpgrowth").FPGrowth;

// Bài viết của người dùng (duy nhất)
const userPosts = [];

// Dữ liệu bài viết tổng hợp (posts)
const posts = [];

// FP-Growth
const fpgrowth = new FPGrowth(0.1); // minSupport

// Hàm tạo luật kết hợp từ bài viết
function generateRules(posts) {
  return fpgrowth.exec(posts).then((frequentItemsets) => {
    const rules = [];
    frequentItemsets.forEach((itemset) => {
      if (itemset.items.length > 1) {
        for (let i = 0; i < itemset.items.length; i++) {
          const antecedent = [itemset.items[i]];
          const consequent = itemset.items.filter((_, idx) => idx !== i);
          rules.push({ antecedent, consequent });
        }
      }
    });
    return rules;
  });
}

function suggestFromHashtags(inputTags, rules, max = 4) {
  const inputSet = new Set(inputTags);
  const tagScores = new Map();

  for (let rule of rules) {
    if (rule.antecedent.every((tag) => inputSet.has(tag))) {
      rule.consequent.forEach((tag) => {
        const old = tagScores.get(tag) || 0;
        tagScores.set(tag, old + rule.support);
      });
    }
  }

  return [...tagScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([tag]) => tag);
}

// Hàm gợi ý cho user duy nhất
function getHashtagSuggestions(userPosts) {
  console.log("\n📄 Bài viết của người dùng:");
  generateRules(posts).then((rules) => {
    const allSuggestions = new Set();

    userPosts.forEach((post) => {
      const suggestedTags = suggestFromHashtags(post, rules, 4);
      suggestedTags.forEach((tag) => allSuggestions.add(tag));
    });

    console.log("\n🎯 Tổng hợp hashtag gợi ý từ tất cả bài viết:");
    console.log([...allSuggestions]);
  });
}

// Hàm lấy dữ liệu post từ db
async function getPostsFromDB() {
  const posts = await postsModel.find({}, { hashtag: 1, _id: 0 });
  console.log(posts);
  
}

getPostsFromDB()
