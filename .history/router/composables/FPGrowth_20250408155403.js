const FPGrowth = require('node-fpgrowth').FPGrowth;

// Bài viết của người dùng (duy nhất)
const userPosts = [
  ["#fitness", "#gym", "#health", "#workout", "#motivation", "#strength", "#exercise"],
  ["#food", "#cooking", "#recipes", "#healthy", "#vegetarian", "#mealprep", "#organic"]
];

// Dữ liệu bài viết tổng hợp (posts)
const posts = [
  ["#fitness", "#gym", "#health", "#workout", "#motivation", "#strength", "#exercise", "#cardio", "#wellness", "#training"],
  ["#travel", "#nature", "#adventure", "#vacation", "#holiday", "#explore", "#wanderlust", "#backpacking", "#beach", "#mountain"],
  ["#tech", "#ai", "#innovation", "#machinelearning", "#datascience", "#computing", "#robotics", "#future", "#automation", "#digital"],
  ["#fitness", "#yoga", "#health", "#wellness", "#stretching", "#flexibility", "#mindfulness", "#strength", "#workout", "#exercise"],
  ["#food", "#cooking", "#recipes", "#delicious", "#healthy", "#vegetarian", "#mealprep", "#organic", "#tasty", "#chef"],
  ["#tech", "#robotics", "#ai", "#innovation", "#gadgets", "#electronics", "#smartdevices", "#machinelearning", "#futuristic", "#digital"],
  ["#travel", "#beach", "#sunset", "#vacation", "#holiday", "#explore", "#ocean", "#paradise", "#sunshine", "#relaxation"],
  ["#food", "#dessert", "#recipe", "#chocolate", "#cake", "#baking", "#delicious", "#sweet", "#treats", "#yummy"],
  ["#fitness", "#cardio", "#gym", "#workout", "#motivation", "#endurance", "#strength", "#healthy", "#fitnessjourney", "#weightloss"],
];

// FP-Growth
const fpgrowth = new FPGrowth(0.1); // minSupport

// Hàm tạo luật kết hợp từ bài viết
function generateRules(posts) {
  return fpgrowth.exec(posts)
    .then(frequentItemsets => {
      const rules = [];
      frequentItemsets.forEach(itemset => {
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
    if (rule.antecedent.every(tag => inputSet.has(tag))) {
      rule.consequent.forEach(tag => {
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
  generateRules(posts).then(rules => {
    const allSuggestions = new Set();

    userPosts.forEach(post => {
      const suggestedTags = suggestFromHashtags(post, rules, 4);
      suggestedTags.forEach(tag => allSuggestions.add(tag));
    });

    console.log("\n🎯 Tổng hợp hashtag gợi ý từ tất cả bài viết:");
    console.log([...allSuggestions]);
  });
}



// Gọi hàm
getHashtagSuggestions();
