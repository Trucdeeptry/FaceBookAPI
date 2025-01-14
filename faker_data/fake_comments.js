const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;

// Hàm lấy ngẫu nhiên một ObjectId từ một collection
async function getRandomObjectId(collectionName) {
    const client = new MongoClient(
        "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    const collection = client.db("FaceBookDB").collection(collectionName);
    const randomDocument = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
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
    console.log('comment');
    
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
        const postIds = await postsCollection.aggregate([{ $sample: { size: 70 } }]).toArray();
        const userIds = await usersCollection.aggregate([{ $sample: { size: 90 } }]).toArray();

        for (let i = 0; i < 60; i++) {
            const post_id = postIds[i]._id;
            const user_id = userIds[i]._id;

            // Lấy created_at của bài viết
            const post = postIds[i];
            const postCreatedAt = post.created_at;

            // Tạo created_at cho comment sao cho luôn >= created_at của post
            let commentCreatedAt = faker.date.past();
            // Kiểm tra và điều chỉnh nếu cần
            while (commentCreatedAt < postCreatedAt) {
                commentCreatedAt = faker.date.past();
            }

            const comment = {
                post_id: post_id,
                user_id: user_id, 
                comment: faker.lorem.sentence(),
                liked_by: await generateLikes(randomIntFromInterval(0, 85), usersCollection), // Lượt thích
                replies: [],
                created_at: commentCreatedAt,  // Đảm bảo comment_created_at >= post_created_at
            };
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
