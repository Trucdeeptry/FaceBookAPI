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
    const userPosts = await postsModel.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$post_id", "$$postId"] },
              },
            },
            {
              $lookup: {
                from: "users", // Collection chứa thông tin người dùng
                localField: "user_id",
                foreignField: "_id",
                as: "userInfo",
              },
            },
            // Nếu bạn muốn có userInfo dạng object chứ không phải mảng, có thể unwind:
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
          ],
          as: "postComments",
        },
      },
    ]);
    
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
