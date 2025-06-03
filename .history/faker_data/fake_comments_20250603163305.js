const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

// Hàm lấy ngẫu nhiên một ObjectId từ một collection
async function getRandomObjectId(collectionName) {
  const client = new MongoClient(
    "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  const collection = client.db("FaceBookDB").collection(collectionName);
  const randomDocument = await collection
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();
  return randomDocument[0]?._id;
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

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedComments() {
  console.log("comment");

  const uri =
    "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const postsCollection = client.db("FaceBookDB").collection("posts");
    const usersCollection = client.db("FaceBookDB").collection("users");
    const commentsCollection = client.db("FaceBookDB").collection("comments");

    const commentsData = [];
    const repliesData = [];
    // Lấy 10 post_id và 10 user_id ngẫu nhiên
    const postIds = await postsCollection
      .aggregate([{ $sample: { size: 56 } }])
      .toArray();
    const userIds = await usersCollection
      .aggregate([{ $sample: { size: 90 } }])
      .toArray();

   
    // Giả sử bạn đã import các thư viện cần thiết, ví dụ: faker, ObjectId, randomIntFromInterval, generateLikes, ...
    const MAX_DEPTH = 2; // Giới hạn độ sâu, bạn có thể thay đổi tùy ý

    /**
     * Hàm tạo 1 comment (hoặc reply) với thời gian tạo đảm bảo >= parentCreatedAt.
     * Nếu depth = 0 thì là comment gốc, nếu depth > 0 thì là reply của comment cha.
     */
    async function generateComment(post, parentCreatedAt, depth = 0) {
      // Tạo created_at cho comment sao cho luôn >= created_at của parent (post hoặc comment cha)
      let commentCreatedAt = faker.date.past();
      while (commentCreatedAt < parentCreatedAt) {
        commentCreatedAt = faker.date.past();
      }

      // Lấy user ngẫu nhiên cho comment
      const randomUser = userIds[randomIntFromInterval(0, userIds.length - 1)];

      // Tạo đối tượng comment
      const comment = {
        _id: new ObjectId(),
        post_id: post._id, // Gắn luôn post_id của bài viết gốc
        user_id: randomUser._id,
        comment: faker.lorem.sentence(),
        liked_by: await generateLikes(
          randomIntFromInterval(0, 8),
          usersCollection
        ),
        created_at: commentCreatedAt,
        replies: [],
      };

      // Nếu chưa đạt độ sâu tối đa, tạo các reply cho comment này
      if (depth < MAX_DEPTH) {
        const numReplies = randomIntFromInterval(0, 5); // Số lượng reply ngẫu nhiên
        for (let j = 0; j < numReplies; j++) {
          // Gọi đệ quy: mỗi reply có thời gian tạo >= created_at của comment cha
          const reply = await generateComment(
            post,
            commentCreatedAt,
            depth + 1
          );
          // Nếu muốn lưu parent_id cho reply, bạn có thể bổ sung như:
          // reply.parent_id = comment._id;
          comment.replies.push(reply);
        }
      }

      return comment;
    }

    // Giả sử bạn muốn tạo 10 comment gốc cho 10 bài post khác nhau
    for (let i = 0; i < 100; i++) {
      const post = postIds[i]; // Lấy bài post (đã có post_created_at)
      // Tạo 1 comment gốc với created_at >= post.created_at
      const comment = await generateComment(post, post.created_at, 0);
      commentsData.push(comment);
    }

    // Chèn các comment vào collection "comments"
    await commentsCollection.insertMany(commentsData);
    console.log("Database seeded with synthetic comment data!");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

seedComments();
