const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;
faker.locale = 'vi';
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Tạo danh sách người đã thích bài viết
async function generateLikes(count, usersCollection) {
  const likedBy = [];
  const users = await usersCollection.find().toArray(); // Lấy tất cả người dùng từ bảng users
  const randomUsers = [];

  // Chọn ngẫu nhiên những người dùng chưa có trong likedBy
  while (likedBy.length < count) {
    const randomUser = users[randomIntFromInterval(0, users.length - 1)]._id;
    if (!likedBy.includes(randomUser)) {
      likedBy.push(randomUser);
    }
  }

  // Trả về danh sách id người thích bài viết
  return likedBy;
}
const topics = [
  {
    theme: "Du lịch",
    image: faker.image.nature(), // ảnh thiên nhiên phù hợp với chủ đề du lịch
    content: faker.lorem.paragraph(),
    hashtags: ["#dulich", "#travel", "#adventure", "#explore"],
  },
  {
    theme: "Ẩm thực",
    image: faker.image.food(), // ảnh ẩm thực
    content: faker.lorem.paragraph(),
    hashtags: ["#amthuc", "#food", "#delicious", "#chef"],
  },
  {
    theme: "Công nghệ",
    image: faker.image.technics(), // ảnh kỹ thuật, công nghệ
    content: faker.lorem.paragraph(),
    hashtags: ["#congnghe", "#tech", "#innovation", "#future"],
  },
  {
    theme: "Giáo dục",
    image: faker.image.abstract(), // ảnh trừu tượng có thể dùng cho giáo dục
    content: faker.lorem.paragraph(),
    hashtags: ["#giaoduc", "#learning", "#knowledge", "#study"],
  },
  {
    theme: "Thời trang",
    image: faker.image.fashion(), // ảnh thời trang
    content: faker.lorem.paragraph(),
    hashtags: ["#thoitrang", "#fashion", "#style", "#trend"],
  },
  {
    theme: "Thể thao",
    image: faker.image.sports(), // ảnh thể thao
    content: faker.lorem.paragraph(),
    hashtags: ["#thethao", "#sports", "#fitness", "#game"],
  },
  {
    theme: "Âm nhạc",
    image: faker.image.abstract(), // sử dụng ảnh trừu tượng làm đại diện cho âm nhạc
    content: faker.lorem.paragraph(),
    hashtags: ["#amnhac", "#music", "#song", "#melody"],
  },
  {
    theme: "Sức khỏe",
    image: faker.image.people(), // ảnh con người có thể tượng trưng cho sức khỏe
    content: faker.lorem.paragraph(),
    hashtags: ["#suckhoe", "#wellness", "#health", "#lifestyle"],
  },
  {
    theme: "Kinh doanh",
    image: faker.image.business(), // ảnh kinh doanh
    content: faker.lorem.paragraph(),
    hashtags: ["#kinhdoanh", "#business", "#entrepreneur", "#startup"],
  },
  {
    theme: "Giải trí",
    image: faker.image.abstract(), // ảnh trừu tượng cho chủ đề giải trí
    content: faker.lorem.paragraph(),
    hashtags: ["#giaitri", "#entertainment", "#fun", "#relax"],
  },
];
async function seedPosts() {
  const uri =
    "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db("FaceBookDB");
    const usersCollection = db.collection("users");
    const postsCollection = db.collection("posts");

    let postsData = [];
    for (let i = 0; i < 20; i++) {
      // Tạo 20 bài viết

      const users = await usersCollection.find().toArray(); // Lấy danh sách người dùng
      const authorId = users[randomIntFromInterval(0, users.length - 1)]._id; // Lấy ngẫu nhiên authorId từ users
      const likesCount = randomIntFromInterval(0, 8); // Số lượt thích ngẫu nhiên từ 0 đến 80
      let post = {
        user_id: authorId,
        content: faker.lorem.paragraph(), // Nội dung bài viết
        image: faker.image.url(), // Hình ảnh (có thể là null hoặc rỗng nếu không cần)
        liked_by: await generateLikes(likesCount, usersCollection), // Danh sách người đã thích
        created_at: faker.date.past(), // Thời gian tạo bài viết
      };
      postsData.push(post);
    }

    await postsCollection.insertMany(postsData);
    console.log("Database seeded with synthetic posts data! :)");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

seedPosts();
