const postsModel = require("../../model/postsModel");
const mongoose = require("mongoose");
const { getCommentforPost } = require("./comments.js");
const {
  getAllHashtags,
  getHashtagSuggestions,
} = require("./FPGrowth/FPGrowth.js");

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
async function getSuggestTags(user_id) {
  const isRefreshHashtag = false;
  if (isRefreshHashtag) getAllHashtags();
  const postHashtags = await postsModel
    .find({ user_id: new mongoose.Types.ObjectId(user_id) })
    .select("hashtags -_id")
    .lean();
  if (postHashtags.length == 0) {
    console.log("No hashtags found for the user. 1");
    return [];
  }

  const hashtags = postHashtags.map((post) => post.hashtags);
  // console.log("input Hashtags:", hashtags);
  const suggestedTags = await getHashtagSuggestions(hashtags);
  // console.log("Suggested Tags:", suggestedTags);
  
  return suggestedTags;
}
async function getAdPost(user_id) {
  const hashtags = await getSuggestTags(user_id);

  console.log("Hashtags:", hashtags);
  if (hashtags.length == 0) {
    console.log("No hashtags found for the user. 2");
    return [];
  }
  const adPosts = await postsModel.aggregate([
    {
      $match: { hashtags: { $in: hashtags }, is_ad: true },
    },
  ]);
  const adPostsWithComment = await getPostsWithInfomation(adPosts);
  return adPostsWithComment;
}
function insertAdsIntoPosts(posts, ads, interval = 3) {
  const result = [];
  let adIndex = 0;

  for (let i = 0; i < posts.length; i++) {
    result.push(posts[i]);

    if ((i + 1) % interval === 0 && adIndex < ads.length) {
      result.push(ads[adIndex]);
      adIndex++;
    }
  }

  while (adIndex < ads.length) {
    result.push(ads[adIndex]);
    adIndex++;
  }

  return result;
}

module.exports = {
  getPostsWithInfomation,
  getAdPost,
  insertAdsIntoPosts,
};
