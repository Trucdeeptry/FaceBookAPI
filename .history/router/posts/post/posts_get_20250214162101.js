const express = require("express");
const mongoose = require("mongoose");
const viewedpostsModel = require("../../../model/viewedpostsModel");
const postsModel = require("../../../model/postsModel");

const router = express.Router();
// Get posts haven't viewed by 1 user
router.get("/", async (req, res) => {
    try {
        const { limit = 10, user_id } = req.query;

        if (!user_id) {
            return res.status(400).send("user_id is required");
        }
        const viewedPosts = await viewedpostsModel.find({
            user_id: new mongoose.Types.ObjectId(user_id),
        });

        const viewedPostIds = viewedPosts.map((post) => post.post_id);

        const postsNotViewed = await postsModel
            .find({
                _id: { $nin: viewedPostIds },
            })
            .limit(parseInt(limit));

        res.json(postsNotViewed);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts");
    }
});

module.exports = router