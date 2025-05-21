const { faker } = require("@faker-js/faker");
const { MongoClient, ObjectId } = require("mongodb");

// Helper function to generate a random integer within a range
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Generate random notification type
function getNotificationType() {
    const types = ["like post", "like comment", "comment post", "reply comment", "follow"];
    return types[randomIntFromInterval(0, types.length - 1)];
}

// Get relevant users based on the notification type
async function getRelevantUserByType(type, postsCollection, commentsCollection, users) {
    let relevantUsers = [];
    console.log(type);
    
    if (type === "like post" || type === "comment post") {
        console.log('post');
        // console.log(postsCollection);
        
        relevantUsers = users.filter(user => postsCollection.some(post => post.user_id.equals(user._id) ));
        
    } else if (type === "like comment" || type === "reply comment") {   
        console.log('comment');
        // console.log(commentsCollection);
        console.log(users.filter(user => user._id.equals(new ObjectId('67697c05c021c8b6acaa91df'))))
        relevantUsers = users.filter(user => commentsCollection.some(comment => comment.user_id.equals(user._id) ));
    }else{
        return users
    }
    

    return relevantUsers;
}

// Main function to seed notifications
async function seedNotifications() {
    const uri = "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("FaceBookDB");
        const usersCollection = db.collection("users");
        const notificationsCollection = db.collection("notifications");
        const postsCollection = db.collection("posts");
        const commentsCollection = db.collection("comments");

        const notificationsData = [];
        const users = await usersCollection.aggregate([{ $sample: { size: 9 } }]).toArray();
        const post = await postsCollection.aggregate([{ $sample: { size: 10 } }]).toArray();
        const comment = await commentsCollection.aggregate([{ $sample: { size: 10 } }]).toArray();
        
        for (let i = 0; i < 50; i++) {
            const type = getNotificationType();
            const relevantUsers = await getRelevantUserByType(type, post, comment, users);
            const user = relevantUsers[randomIntFromInterval(0, relevantUsers.length - 1)];
            
            // console.log(relevantUsers);
            log
            const userCreatedAt = new Date(user.created_at);
            
            const now = new Date();
            const notificationCreatedAt = faker.date.between({
                from: userCreatedAt,    
                to: now,
            });
            console.log(notificationCreatedAt);

            let notification = {
                user_id: user._id,
                user_sent: users[randomIntFromInterval(0, users.length - 1)]._id,
                type,
                message: faker.lorem.sentence(),
                is_read: randomIntFromInterval(0, 1) === 0,
                created_at: notificationCreatedAt,
            };

            if (type === "like post" || type === "comment post") {
                const userPosts = await postsCollection.find({ user_id: user._id }).toArray();
                if (userPosts.length > 0) {
                    const randomPost = userPosts[randomIntFromInterval(0, userPosts.length - 1)];
                    notification["post_id"] = randomPost._id;
                }
            } else if (type === "like comment" || type === "reply comment") {
                const userComments = await commentsCollection.find({ user_id: user._id }).toArray();
                if (userComments.length > 0) {
                    const randomComment = userComments[randomIntFromInterval(0, userComments.length - 1)];
                    notification["comment_id"] = randomComment._id;
                }
            }

            notificationsData.push(notification);
        }

        await notificationsCollection.insertMany(notificationsData);
        // console.log(notificationsData);

        console.log("Database seeded with synthetic notification data!");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await client.close();
    }
}

// Run the seeding function
seedNotifications().catch(console.error);
