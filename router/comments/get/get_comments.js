const express = require("express");
const mongoose = require("mongoose");
const commentsModel = require("../../../model/commentsModel");
const router = express.Router();
// get comments by 1 post_id
router.get("/", async (req, res) => {
    try {
        const { post_id } = req.query;
        if (!post_id) {
            return res.status(400).send("post_id is required");
        }
        let posts = await commentsModel.find({
            post_id: new mongoose.Types.ObjectId(post_id),
        });
        if (!posts) {
            return res.status(404).send("Post not found");
        }
        res.send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts");
    }
});

module.exports = router