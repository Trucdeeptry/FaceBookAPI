const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../model/usersModel");
const postsModel = require("../../../model/postsModel");
const { getPostsWithInfomation } = require("../../composables/posts");
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
    const { avatar, _id, info, bio, followers, following, friends } = user;
    const userPost = await postsModel.find({
      user_id: new mongoose.Types.ObjectId(id),
    });
    const postsWithComments = await getPostsWithInfomation(userPost);
    res.status(200).json({
      status: "success",
      userInfo: {
        _id,
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
router.get("/search", async (req, res) => {
  const nameQuery = req.query.name;

  if (!nameQuery) {
    return res.status(400).json({ message: "Missing name query" });
  }

  try {
    const regex = new RegExp(nameQuery, "i"); // i = ignore case

    const users = await userModel
      .find({
        $or: [
          { "info.firstName": { $regex: regex } },
          { "info.surName": { $regex: regex } },
        ],
      })
      .select("info avatar");
    res.status(200).json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
