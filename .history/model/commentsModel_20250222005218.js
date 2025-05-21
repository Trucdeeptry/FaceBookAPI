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
    type: [Object],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  //   Khi gọi comment sẽ dựa vào user_id để lấy author_info
  author_info: {
    type: Object,
  },
});

const Comment = new mongoose.model("comments", commentSchema);

module.exports = Comment;
