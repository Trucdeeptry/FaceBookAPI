const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../model/usersModel");
const postsModel = require("../../../model/postsModel");

const router = express.Router();

// get user profile by id
router.post("/profile", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    
    const user = await userModel.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const { avatar, info, bio, followers, following, friends } = user;
    const countFollowers = followers.length;
    const countFollwing = following.length;
    const userPosts = postsModel.find({
      user_id: new mongoose.Types.ObjectId(id),
    });
    res.status(200).json({
      status: "success",
      data: {
        avatar,
        info,
        bio,
        friends,
        countFollwing,
        countFollowers,
        userPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
