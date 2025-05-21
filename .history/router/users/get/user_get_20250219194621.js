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
    // const userPosts = await postsModel.aggregate([
    //   {
    //     $match: {
    //       user_id: new mongoose.Types.ObjectId(id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "comments",
    //       localField: "_id",
    //       foreignField: "post_id",
    //       as: "postComments",
    //     },
       
    //   },
    // ]);
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
      // Unwind postComments để xử lý từng comment riêng lẻ
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
          as: "postComments.userInfo",
        },
      },
      // Nếu lookup trả về mảng, lấy phần tử đầu tiên
      {
        $addFields: {
          "postComments.userInfo": { $arrayElemAt: ["$postComments.userInfo", 0] },
        },
      },
      // Gom nhóm lại các comment vào mảng postComments cho mỗi bài post
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          content: { $first: "$content" },
          image: { $first: "$image" },
          liked_by: { $first: "$liked_by" },
          created_at: { $first: "$created_at" },
          postComments: { $push: "$postComments" },
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
