const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;


function randomIntFromInterval(min, max) { // min and max included
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

async function seedPosts() {
    const uri = "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const db = client.db("FaceBookDB");
        const usersCollection = db.collection("users");
        const postsCollection = db.collection("posts");

        let postsData = [];

        for (let i = 0; i < 20; i++) { // Tạo 20 bài viết
            
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
