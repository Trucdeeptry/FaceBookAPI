// Đoạn code này dùng để đệ quy lấy dữ liệu người dùng vào từng comment
// BẮT ĐẦU
const userModel = require("../../model/usersModel.js");

async function populateAuthorInfo(comment) {
  // Nếu chưa có author_info, fetch từ usersCollection
  if (!comment.author_info) {
    comment.author_info = await userModel.findOne(
      { _id: comment.user_id },
      { avatar: 1, info: 1 }
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
async function getCommentforPost(post_id) {
    try {
        const { post_id } = req.body;
        if (!post_id) {
          return res.status(400).send("post_id is required");
        }
        const commentPost = await commentModel.find({
          post_id,
        });
        const commentReplies = await getCommentsWithReplies(commentPost);
        res.status(200).json({
          commentReplies,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error get comment");
      }
}
// KẾT THÚC


module.exports = getCommentsWithReplies;
