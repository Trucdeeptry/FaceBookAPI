const { faker } = require("@faker-js/faker");
const supabase = require("../router/composables/supabase.js");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomReact() {
  const reactions = ["like", "love", "wow", "sad", "angry"];
  return reactions[Math.floor(Math.random() * reactions.length)];
}
async function generateComment(
  postId,
  userIdList,
  parentCreatedAt = null,
  depth = 0,
  parentId = null
) {
  let createdAt = faker.date.recent();
  if (parentCreatedAt && createdAt < parentCreatedAt) {
    createdAt = new Date(parentCreatedAt.getTime() + 1000);
  }

  const likedBy = [];
  const likeCount = randomInt(0, 20);
  while (likedBy.length < likeCount) {    
    const user = userIdList[randomInt(0, userIdList.length - 1)];
    console.log(user);
    
    if (!likedBy.includes(user)) likedBy.push(user);
  }


  // Insert comment
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: postId,
        user_id: userIdList[randomInt(0, userIdList.length - 1)],
        text: faker.lorem.sentence(),
        likes: likedBy,
        created_at: createdAt.toISOString(),
      },
    ])
    .select("id, created_at");

  if (error) {
    console.error("Insert comment error:", error.message);
    return null;
  }

  const commentId = data[0].id;
  const newCreatedAt = new Date(data[0].created_at);

  // Tạo replies nếu depth < max
  // if (depth < 2) {
  //   const replyCount = randomInt(0, 3);
  //   for (let i = 0; i < replyCount; i++) {
  //     await generateComment(
  //       postId,
  //       userIdList,
  //       newCreatedAt,
  //       depth + 1,
  //       commentId
  //     );
  //   }
  // }
}

async function seedComments() {
  // Lấy danh sách bài viết và người dùng
  const { data: posts } = await supabase.from("posts").select("id");
  const { data: users } = await supabase.from("profiles").select("user_id");

  const userIds = users.map((u) => u.user_id);
    
  for (const post of posts) {
    for (let i = 0; i < randomInt(1, 5); i++) {
      await generateComment(post.id, userIds);
    }
  }

  console.log("Done seeding comments!");
}

seedComments();
