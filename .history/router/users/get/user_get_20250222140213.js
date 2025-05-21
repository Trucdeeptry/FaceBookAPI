const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../model/usersModel");
const postsModel = require("../../../model/postsModel");
const { getCommentforPost } = require("../../composables/comments.js");

const router = express.Router();
// get user profile by id
router.get("/profile", async (req, res) => {
  try {
    const { id } = req.query;

    const user = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const { avatar, info, bio, followers, following, friends } = user;
    const countFollowers = followers.length;
    const countFollwing = following.length;
    const userPosts = const userPosts = await postsModel.find({ user_id: id })

    console.log(userPosts);
    
    const postsWithComments = await Promise.all(
      userPosts.map(async (post) => ({
        ...post.toObject(),
        comments: await getCommentforPost(post),
      }))
    );
    console.log(await postsWithComments);
    res.status(200).json({
      status: "success",
      data: {
        avatar,
        info,
        bio,
        friends,
        countFollwing,
        countFollowers,
        postsWithComments,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
