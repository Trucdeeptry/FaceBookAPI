const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const commentModel = require("../../../model/commentsModel.js");
const { getCommentforPost } = require("../../composables/comments.js");

// comment post
router.post("/get", async (req, res) => {
  try {
    const { post_id } = req.body;
    if (!post_id) {
      res.status(404).json({ error: "post_id is required" });
    }
    const commentsPost = await getCommentforPost(post_id);
    res.status(200).json({
      commentsPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
});
router.post("/send", async (req, res) => {
  try {
    const { user_id, post_id, comment, parent_commentId } = req.body;
    if (!user_id || !post_id) {
      return res.status(400).json({
        message: "user_id and post_id are required",
      });
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
        return res.status(404).json({
          message: "Parent comment not found",
        });
      }
      parentComment.replies.push(new mongoose.Types.ObjectId(savedComment._id));
      await parentComment.save();
    }
    res
      .status(200)
      .json({ status: "success", message: "Post comment successfully" });
  } catch (error) {
    res.status(500).json({
      message: `Error post comment:${error}`,
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    const updateData = req.body;

    const updatedComment = await commentModel.findByIdAndUpdate(
      commentId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "modify comment successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedComment = await commentModel.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
