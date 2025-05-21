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
async function getAdPost(userId) {
  const
}
module.exports = {
  getPostsWithInfomation,
};
