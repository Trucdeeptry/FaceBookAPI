const users = { 
  user1:
   ["#fitness", "#gym", "#health", "#workout", "#motivation", "#gym", "#gym", "#gym", "#food", "#food", "#food", "#food", "#food", "#food", "#food", "#food", "#food", "#travel", "#travel", "#technology", "#technology", "#technology", "#coding", "#coding"],
  user2: ["#food", "#cooking", "#recipes", "#healthy", "#vegetarian"],
  user3: ["#travel", "#nature", "#vacation", "#explore", "#wanderlust"],
  user4: ["#ai", "#tech", "#robotics", "#machinelearning", "#innovation"],
  user5: ["#gym", "#exercise", "#workout", "#fitness", "#strength"],
  user6: ["#dessert", "#baking", "#sweet", "#cake", "#treats","#ai","#travel", "#nature", "#vacation", "#explore", "#wanderlust"],
  user7: ["#technology", "#gadgets", "#programming", "#computing", "#innovation"],
  user8: ["#vacation", "#beach", "#adventure", "#relax", "#travel"],
  user9: ["#cooking", "#delicious", "#mealprep", "#chef", "#yummy"],
  user10: ["#machinelearning", "#datascience", "#ai", "#neuralnetworks", "#coding"],
  user11: ["#gym", "#coding", "#food", "#ai", "#travel"],
  user12: ["#cooking", "#delicious", "#mealprep","#ai", "#tech", "#robotics","#fitness", "#gym", "#health"],
  user13: ["#ai","#cooking","#travel"],
  user14: ["#gym", "#food", "#technology", "#ai", "#travel", "#coding", "#cooking", "#explore", "#vacation", "#workout", "#dessert", "#gadgets"],
  user15: ["#gym", "#coding", "#travel", "#food", "#ai", "#vacation", "#baking", "#technology", "#cake", "#workout"],
  user16: ["#gym","#workout","#training","#vacation","#explore","#nature","#food","#yum","#food","#tasty","#ai","#tech", "#innovation","#art","#dance", "#theater", "#music"]
};

const clusters = {
  "Sport": ["#fitness", "#gym", "#health", "#workout", "#exercise", "#strength", "#game",
    "#athlete",
    "#workout",
    "#sportslife",
    "#training",
    "#competition",
    "#sport",
    "#exercise",
    "#fit",
    "#motivation",
    "#active",
    "#health",
    "#running",
    "#soccer",
    "#basketball",
    "#football",
    "#win",],
  "Food ": ["#food", "#cooking", "#recipes", "#healthy", "#vegetarian", "#dessert", "#baking", "#sweet", "#cake", "#chef",
    "#foodie",
    "#yum",
    "#cooking",
    "#recipe",
    "#foodphotography",
    "#tasty",
    "#gourmet",
    "#instafood",
    "#homemade",
    "#dinner",
    "#lunch",
    "#breakfast",
    "#foodlover",
    "#healthyfood",
    "#foodstagram",
    "#eatwell",],
  "Technology": ["#ai", "#tech", "#robotics", "#machinelearning", "#innovation", "#programming", "#computing", "#gadgets", "#technology", "#coding"],
  "Travel": ["#travel",
    "#explore",
    "#adventure",
    "#vacation",
    "#trip",
    "#journey",
    "#wanderlust",
    "#travelgram",
    "#discover",
    "#tour",
    "#travelphotography",
    "#travelblog",
    "#destination",
    "#roadtrip",
    "#nature",
    "#landscape",
    "#instatravel",
    "#traveling",
    "#holiday",],
  "Entertaiment": [ "#art", "#movie", "#dance", "#theater", "#music",
    "#comedy",
    "#party",
    "#celebrities",
    "#tvshow",
    "#amusement",
    "#funny",
    "#event",
    "#theater",
    "#festival",
    "#leisure",
    "#popculture",
    "#gaming",
    "#hobby",
    "#joy",],
  "Leadership":[
    "#strategy",
    "#innovation",
    "#growth",
    "#investment",
    "#management",
    "#sales",
    "#hustle",
    "#motivation",
    "#smallbusiness",
    "#businessowner",
    "#enterprise",
    "#finance",
    "#biz"
  ],
  "Music": [
    "#amnhac",
    "#music",
    "#song",
    "#melody",
    "#musician",
    "#instamusic",
    "#concert",
    "#live",
    "#singing",
    "#band",
    "#musiclover",
    "#pop",
    "#rock",
    "#hiphop",
    "#jazz",
    "#classical",
    "#sound",
    "#musiclife",
    "#playlist",
    "#lyrics",
  ],
  "Business": [
    "#kinhdoanh",
    "#business",
    "#entrepreneur",
    "#startup",
    "#success",
    "#marketing",
  ],

};

function getHashtagFrequency(userHashtags) {
  const frequency = {};
  for (let tag of userHashtags) {
    frequency[tag] = (frequency[tag] || 0) + 1;
  }
  return frequency;
}

function classifyUser(userHashtags) {
  const frequency = getHashtagFrequency(userHashtags);
  const groupScores = {};

  for (let group in clusters) {
    let score = 0;
    for (let tag of userHashtags) {
      if (clusters[group].includes(tag)) {
        score += frequency[tag];
      }
    }
    groupScores[group] = score;
  }

  const sorted = Object.entries(groupScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  return sorted;
}

function classifyTopInterests(userHashtags) {
  const sortedGroups = classifyUser(userHashtags);

  if (sortedGroups.length === 0) {
    return ["Chưa xác định"];
  }

  // Trả về tối đa 3 nhóm đầu tiên
  return sortedGroups.slice(0, 3).map(([group]) => group);
}


// Hiển thị kết quả
for (let user in users) {
  const result = classifyTopInterests(users[user]);
  console.log(`👤 ${user} thuộc nhóm sở thích: ${result.join(", ")}`);
}
