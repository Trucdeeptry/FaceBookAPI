// seedViewedPosts.js
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;


// Hàm lấy số nguyên ngẫu nhiên trong khoảng [min, max]
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedViewedPosts() {
  try {
    const uri = "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected correctly to MongoDB");
    const db = client.db("FaceBookDB");
    const User = db.collection("users");
    const Post = db.collection("posts");
    // Lấy tất cả người dùng và bài viết
    const users = await User.find().toArray();
    const posts = await Post.find().toArray();
    

    if (!users.length || !posts.length) {
      console.log(
        "Không tìm thấy người dùng hoặc bài viết để seed viewedPosts"
      );
      return;
    }

    let viewedPostsData = [];

    // Với mỗi user, tạo record viewedPosts cho một số bài viết ngẫu nhiên
    for (const user of users) {
      // Giả sử mỗi user "xem" từ 1 đến 10 bài viết
      const numViews = randomIntFromInterval(1, Math.min(10, posts.length));

      // Trộn ngẫu nhiên mảng posts
      const shuffledPosts = posts.sort(() => 0.5 - Math.random());

      for (let i = 0; i < numViews; i++) {
        viewedPostsData.push({
          user_id: user._id,
          post_id: shuffledPosts[i]._id,
          isViewed: true,
          created_at: faker.date.past(), // Thời điểm ngẫu nhiên trong quá khứ
        });
      }
    }

    // Insert dữ liệu vào collection viewedPosts    
    const result = await PostView.insertMany(viewedPostsData);
    console.log(`Inserted ${result.length} viewedPosts records successfully!`);
  } catch (err) {
    console.error("Error seeding viewedPosts:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedViewedPosts();
