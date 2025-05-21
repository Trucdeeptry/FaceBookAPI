const express = require("express");
const mongoose = require("mongoose");
const viewedpostsModel = require("../../../model/viewedpostsModel");
const postsModel = require("../../../model/postsModel");
const userModel = require("../../../model/usersModel");
const router = express.Router();
const {
  getPostsWithInfomation,
  getAdPost,
  insertAdsIntoPosts
} = require("../../composables/posts");
// Get posts haven't viewed by 1 user
router.post("/get-posts", async (req, res) => {
  try {
    const { limit = 10, user_id } = req.body;

    if (!user_id) {
      return res.status(400).send("user_id is required");
    }
    const viewedPosts = await viewedpostsModel.find({
      user_id: new mongoose.Types.ObjectId(user_id),
    });

    const viewedPostIds = viewedPosts.map((post) => post.post_id);
    // get following
    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const followingIds = user.following.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const postsFromFollowing = await postsModel
      .find({
        user_id: { $in: followingIds },
        _id: { $nin: viewedPostIds }, // Đảm bảo không lấy lại bài đã xem
      })
      .limit(parseInt(limit));
    // Khúc này là lấy post advertisement
    const advertisementPosts = await getAdPost(user_id);
    const postsNotViewed = await getPostsWithInfomation(postsFromFollowing);
    const postsWithComments = insertAdsIntoPosts(post)
    return res.status(200).json({ status: "success", postsWithComments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});
router.post("/test", async (req, res) => {
  try {
    const { user_id } = req.body;
    const advertisementPosts = await getAdPost(user_id);
    return res.status(200).json({ status: "success", advertisementPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});
module.exports = router;
