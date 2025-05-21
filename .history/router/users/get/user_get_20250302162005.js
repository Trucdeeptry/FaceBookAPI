const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../model/usersModel");
const postsModel = require("../../../model/postsModel");
const {getPostsWithInfomation} = require("../../composables/posts");
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
    //   { $match: { user_id: new mongoose.Types.ObjectId(id) } },
    //   {
    //     $lookup: {
    //       from: "users", // Tên collection users
    //       let: { userId: { $toObjectId: "$user_id" } },
    //       pipeline: [
    //         { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
    //         { $project: { _id: 0, info: 1, avatar: 1 } }, // Lấy chỉ name và avartar
    //       ],
    //       as: "author_info",
    //     },
    //   },
    //   // Nếu bạn muốn author_info không là mảng (với 1 phần tử) thì có thể unwind:
    //   { $unwind: { path: "$author_info", preserveNullAndEmptyArrays: true } },
    // ]);
    // const postsWithComments = await Promise.all(
    //   userPosts.map(async (post) => ({
    //     ...post,
    //     comments: await getCommentforPost(post),
    //   }))
    // );

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
