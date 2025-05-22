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
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, default: "like" }, // like, wow, love,...
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  //   Khi gọi post sẽ dựa vào user_id để lấy author_info
  author_info: {
    type: Object,
  },
  hashtags: [String],
});

const Post = new mongoose.model("posts", postSchema);

module.exports = Post;
