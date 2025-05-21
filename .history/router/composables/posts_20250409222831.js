const postsModel = require("../../model/postsModel");
const mongoose = require("mongoose");
const { getCommentforPost } = require("./comments.js");
const { getAllHashtags, getHashtagSuggestions } = require("./FPGrowth/FPGrowth.js");

// thêm author_info vào từng post
const lookupAndUnwindStage = [
  {
    $lookup: {
      from: "users",
      let: { userId: { $toObjectId: "$user_id" } },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
        { $project: { _id: 0, info: 1, avatar: 1 } },
      ],
      as: "author_info",
    },
  },
  {
    $unwind: { path: "$author_info", preserveNullAndEmptyArrays: true },
  },
];
async function getPostsWithInfomation(posts) {
  const postIds = posts.map((post) => post._id);

  const userPosts = await postsModel.aggregate([
    { $match: { _id: { $in: postIds } } },
    ...lookupAndUnwindStage,
  ]);
  const postsWithComments = await Promise.all(
    userPosts.map(async (post) => ({
      ...post,
      comments: await getCommentforPost(post),
    }))
  );
  return postsWithComments;
}
async function getAdPost(user_id) {
  if (!user_id) {
    return res.status(400).send("user_id is required");
  }
  const user_posts = await postsModel.find({
    user_id: new mongoose.Types.ObjectId(user_id),
  });
}
module.exports = {
  getPostsWithInfomation,
};
