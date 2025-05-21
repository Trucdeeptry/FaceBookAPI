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
    // tách ra để sử dụng composables
    const matchStage = { 
      $match: { 
        user_id: new mongoose.Types.ObjectId(id) 
      } 
    };
    
    // Định nghĩa biến chứa stage lookup và unwind
    const lookupAndUnwindStage = [
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$user_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            { $project: { _id: 0, info: 1, avatar: 1 } }
          ],
          as: "author_info"
        }
      },
      {
        $unwind: { path: "$author_info", preserveNullAndEmptyArrays: true }
      }
    ];
    
    // Kết hợp với match
    const pipeline = [ matchStage, ...lookupAndUnwindStage ];
    
    // Thực hiện aggregate
    const userPosts = await postsModel.aggregate(pipeline);
    const postsWithComments = await Promise.all(
      userPosts.map(async (post) => ({
        ...post,
        comments: await getCommentforPost(post),
      }))
    );
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
