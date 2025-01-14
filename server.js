const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const port = 3000;
require("dotenv").config();
const uri = process.env.MONGODB;
mongoose.connect(uri);
app.listen(port, () => {
    console.log("listening on port ", port);
});
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Chỉ cho phép yêu cầu từ localhost:5173
}));

// router get link
const user_get = require("./router/users/get/user_get")
const posts_get = require("./router/posts/get/posts_get")
const comments_get = require("./router/comments/get/get_comments")
const notifications_get = require("./router/notifications/get/get_notifications")

// router post link
const user_post = require("./router/users/post/user_post")
const comment_post = require("./router/comments/post/comments_post")

// router patch link
const posts_post = require("./router/posts/patch/posts_patch")
// router verify email
const verify_email = require("./router/verify_email")
// users
app.use("/users", user_get)
app.use("/users", user_post)
// post
app.use("/posts", posts_get)
app.use("/posts", posts_post)
// comments
app.use("/comments", comments_get)
app.use("/comments", comment_post)
// notifications
app.use("/notifications", notifications_get)

// verify email
app.use("/email", verify_email)