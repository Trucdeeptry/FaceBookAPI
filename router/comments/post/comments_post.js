const express = require("express");
const mongoose = require("mongoose");
const commentModel = require("../../../model/commentsModel")
const router = express.Router();

// Like post
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
        if(parent_commentId){
            const parentComment = await commentModel.findById(parent_commentId)
            if (!parentComment) {
                return res.status(404).send("Parent comment not found");
            }
            parentComment.replies.push(new mongoose.Types.ObjectId(savedComment._id))
            await parentComment.save()
        }
        res.send({ message: "Post comment successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error post comment");
    }
});

module.exports = router