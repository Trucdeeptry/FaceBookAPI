const express = require("express");
const mongoose = require("mongoose");
const postsModel = require("../../../model/postsModel");
const router = express.Router();

// Like post
router.patch("/like", async (req, res) => {
    try {
        const { user_id, post_id } = req.body;
        if (!user_id || !post_id) {
            return res.status(400).send("user_id and post_id are required");
        }
        const post = await postsModel.findById(post_id)
        // Kiểm tra post
        if (!post) {
            return res.status(404).send("Post not found");
        }
        // Kiểm tra like chưa
        if (post.liked_by.includes(user_id)) {
            return res.status(400).send("User has already liked this post");
        }

        post.liked_by.push(new mongoose.Types.ObjectId(user_id))
        res.send({ message: "Post liked successfully" });
        await post.save();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error post like users");
    }
});

module.exports = router