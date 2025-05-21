const { faker } = require("@faker-js/faker");
import supabase from '../router/composables/supabase.js'
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  const likeCount = randomInt(0, 5);
  while (likedBy.length < likeCount) {
    const user = userIdList[randomInt(0, userIdList.length - 1)];
    if (!likedBy.includes(user)) likedBy.push(user);
  }

  // Insert comment
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: postId,
        user_id: userIdList[randomInt(0, userIdList.length - 1)],
        comment: faker.lorem.sentence(),
        liked_by: likedBy,
        created_at: createdAt.toISOString(),
        parent_id: parentId,
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
  if (depth < 2) {
    const replyCount = randomInt(0, 3);
    for (let i = 0; i < replyCount; i++) {
      await generateComment(
        postId,
        userIdList,
        newCreatedAt,
        depth + 1,
        commentId
      );
    }
  }
}

async function seedComments() {
  // Lấy danh sách bài viết và người dùng
  const { data: posts } = await supabase.from("posts").select("id").limit(10);
  const { data: users } = await supabase.from("users").select("id");

  const userIds = users.map((u) => u.id);

  for (const post of posts) {
    await generateComment(post.id, userIds);
  }

  console.log("Done seeding comments!");
}

seedComments();
