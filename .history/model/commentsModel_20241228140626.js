const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    liked_by: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Comment = new mongoose.model("comments", commentSchema);

module.exports = Comment;
