const mongoose = require("mongoose");

const postViewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    isViewed: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});

const PostView = new mongoose.model("viewedposts", postViewSchema);

module.exports = PostView;
