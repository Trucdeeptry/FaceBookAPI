const express = require("express");
const mongoose = require("mongoose");
const commentModel = require("../../../model/commentsModel");
const router = express.Router();
const getCommentsWithReplies = require("../../composables/comments.js");

// comment post
router.post("/send", async (req, res) => {
  try {
    const { user_id, post_id, comment, parent_commentId } = req.body;
    if (!user_id || !post_id) {
      return res.status(400).send("user_id and post_id are required");
    }
    const newComment = new commentModel({
      post_id: new mongoose.Types.ObjectId(post_id),
      user_id: new mongoose.Types.ObjectId(user_id),
      comment,
    });
    const savedComment = await newComment.save();
    if (parent_commentId) {
      const parentComment = await commentModel.findById(parent_commentId);
      if (!parentComment) {
        return res.status(404).send("Parent comment not found");
      }
      parentComment.replies.push(new mongoose.Types.ObjectId(savedComment._id));
      await parentComment.save();
    }
    res.send({ message: "Post comment successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error post comment");
  }
});
router.post("/get", async (req, res) => {
  try {
    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).send("post_id is required");
    }
    const commentPost = await commentModel.find({
      post_id,
    });

    // const commentReplies = await getCommentsWithReplies(commentPost);
    res.status(200).json({
        commentReplies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error get comment");
  }
});
module.exports = router;
