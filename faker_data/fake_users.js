const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}



async function seedDB() {
    const uri = "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const collection = client.db("FaceBookDB").collection("posts");
        let usersData = [];

        for (let i = 0; i < 100; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const fullName = `${firstName} ${lastName}`;

            let user = {
                username: faker.internet.userName({ firstName, lastName }),
                email: faker.internet.email({ firstName, lastName }),
                password: faker.internet.password(), // Mật khẩu giả
                avatar: faker.image.avatar(), // URL ảnh đại diện giả
                bio: faker.lorem.sentence(), // Tiểu sử giả
                followers: [], // 10-100 người theo dõi
                following: [], // 5-50 người đang theo dõi
                created_at: faker.date.past(), // Thời gian tạo tài khoản
            };

            usersData.push(user);
        }
        await collection.insertMany(usersData);
        console.log("Database seeded with synthetic user data! :)");
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

seedDB();
