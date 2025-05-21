const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../model/usersModel");
const postsModel = require("../../../model/postsModel");
const commentsModel = require("../../../model/commentsModel");
const { pipeline } = require("nodemailer/lib/xoauth2");
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
    [
      {
        "_id": "post123",
        "user_id": "user456",
        "content": "Hello World!",
        "postComments": [
          {
            "_id": "comment789",
            "post_id": "post123",
            "user_id": "user567",
            "comment": "Nice post!",
            "userInfo": {
              "_id": "user567",
              "name": "John Doe",
              "avatar": "profile.jpg"
            }
          }
        ]
      }
    ]
    
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
