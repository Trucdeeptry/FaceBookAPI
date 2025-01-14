const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    liked_by: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Post = new mongoose.model("posts", postSchema);

module.exports = Post;
