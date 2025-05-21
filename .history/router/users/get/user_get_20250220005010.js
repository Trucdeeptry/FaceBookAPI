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
          localField: "_id",
          foreignField: "post_id",
          as: "postComments",
        },
      },
      {
        $unwind: {
          path: "$postComments",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Join thông tin user cho mỗi comment
      {
        $lookup: {
          from: "users",
          localField: "postComments.user_id",
          foreignField: "_id",
          let: { commentUserId: "$postComments.user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$commentUserId"] },
              },
            },
            {
              $project: {
                _id: 0,      
                avatar: 1,
                info: 1,
              },
            },
          ],
          as: "postComments.author_info",
        },
      },
      // 
      {
        $unwind: {
          path: "$postComments.author_info",
          preserveNullAndEmptyArrays: true,
        },
      }
      // Đưa postComment từ object về mảng vì có nhiều comments
      {
        $group: {
          _id: "$_id",
          // Giữ các trường khác của post (ví dụ, title, content, v.v.)
          postData: { $first: "$$ROOT" },
          postComments: { $push: "$postComments" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$postData", { postComments: "$postComments" }],
          },
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
