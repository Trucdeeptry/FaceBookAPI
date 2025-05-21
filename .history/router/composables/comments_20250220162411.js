const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
/**
 * Hàm đệ quy để thêm trường author_info vào comment/reply dựa vào user_id.
 * Nếu comment đã có author_info (từ aggregate pipeline) thì không cần fetch lại.
 */
async function populateAuthorInfo(comment) {
  // Nếu chưa có author_info, fetch từ usersCollection
  if (!comment.author_info) {
    comment.author_info = await usersCollection.findOne(
      { _id: comment.user_id },
      { projection: { avatar: 1, info: 1 } }
    );
  }

  // Nếu comment có replies (và mảng này có độ dài > 0), xử lý đệ quy từng reply
  if (comment.replies && comment.replies.length > 0) {
    comment.replies = await Promise.all(
      comment.replies.map((reply) => populateAuthorInfo(reply))
    );
  }
  return comment;
}

/**
 * Hàm này nhận vào mảng comment (các comment gốc của post)
 * và xử lý đệ quy để thêm author_info cho từng comment và reply.
 */
async function getCommentsWithReplies(postComments) {
  return await Promise.all(
    postComments.map((comment) => populateAuthorInfo(comment))
  );
}
async function getPostComments(postId) {
  const comments = await commentsModel
    .aggregate([
      {
        $match: { post_id: new mongoose.Types.ObjectId(postId) },
      },
      // Nếu comment được lưu theo dạng nested (có trường replies) thì có thể không cần lookup cho reply
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "author_info",
        },
      },
      {
        $unwind: {
          path: "$author_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Có thể sắp xếp hoặc xử lý thêm nếu cần
    ])
    .toArray();

  // Lưu ý: Pipeline này chỉ join thông tin cho comment gốc.
  return comments;
}

export default {
    
}