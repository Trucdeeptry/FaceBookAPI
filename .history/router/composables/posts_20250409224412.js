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
// Get advertisement posts
async function getSuggestTags(user_id){
  const isRefreshHashtag = true;
  if(isRefreshHashtag) getAllHashtags();
  const postHashtags = await postsModel
  .find({ user_id: new mongoose.Types.ObjectId(user_id) })
  .select("hashtags -_id")
  .lean();
  if(postHashtags.length == 0) return [];
  const hashtags = postHashtags.flatMap((post) => post.hashtags);
  const suggestedTags = await getHashtagSuggestions(hashtags);
  return suggestedTags
}
async function getAdPost(user_id) {
  const hashtags = await getSuggestTags(user_id);
  
}
module.exports = {
  getPostsWithInfomation,
  getAdPost
};
