const express = require("express");
const mongoose = require("mongoose");
const viewedpostsModel = require("../../../model/viewedpostsModel");
const postsModel = require("../../../model/postsModel");
const userModel = require("../../../model/usersModel");
const router = express.Router();
const {
  getPostsWithInfomation,
  getAdPost,
  insertAdsIntoPosts,
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
    const postsWithComments = insertAdsIntoPosts(
      postsNotViewed,
      advertisementPosts
    );
    return res.status(200).json({ status: "success", postsWithComments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});
router.post("/add-post", async (req, res) => {
  try {
    const { user_id, content, image, hashtags } = req.body;
    const newPost = new postsModel({
      user_id,
      content,
      image,
      hashtags,
    });
    const savedPost = await newPost.save();
    res.status(201).json({
      status: "success",
      savedPost,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = req.body;

    const updatedPost = await postsModel.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({
      status: "success",
      updatedPost,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await postsModel.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ status: "success", message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// like/react post
router.post("/like/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { user_id, type } = req.body; // type: "wow", "like", etc.
    if (!user_id || !type) {
      res.status(404).json({ error: "user_id or type not found" });
    }
    const post = await postsModel.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    console.log(Array.isArray(post.liked_by));
    
    const index = post.liked_by.findIndex(
      (like) => like.user_id.toString() === user_id
    );

    if (index === -1) {
      //  Nếu chưa like, thêm vào mảng
      post.liked_by.push({ user_id, type: type || "like" });
    } else {
      const existingType = post.liked_by[index].type;
      if (existingType === type) {
        //  Nếu like cùng loại => bỏ like (unlike)
        post.liked_by.splice(index, 1);
      } else {
        //  Nếu đã like nhưng khác loại => cập nhật type
        post.liked_by[index].type = type;
      }
    }

    await post.save();

    res.status().json({
      status: "success",
      message: "Post like status updated",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
