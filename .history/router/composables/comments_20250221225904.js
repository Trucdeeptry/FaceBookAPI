/**
 * Hàm đệ quy để thêm trường author_info vào comment/reply dựa vào user_id.
 * Nếu comment đã có author_info (từ aggregate pipeline) thì không cần fetch lại.
 */
const postsModel = require("../../../model/postsModel");
const mongoose = require("mongoose");

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
        comment.replies.map(reply => populateAuthorInfo(reply))
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
      postComments.map(comment => populateAuthorInfo(comment))
    );
  }
  async function getPostComments(postId) {
    const comments = await commentsModel.aggregate([
      {
        $match: { post_id: new mongoose.Types.ObjectId(postId) }
      },
      // Nếu comment được lưu theo dạng nested (có trường replies) thì có thể không cần lookup cho reply
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "author_info"
        }
      },
      {
        $unwind: {
          path: "$author_info",
          preserveNullAndEmptyArrays: true
        }
      }
      // Có thể sắp xếp hoặc xử lý thêm nếu cần
    ]).toArray();
  
    // Lưu ý: Pipeline này chỉ join thông tin cho comment gốc.
    return comments;
  }
  const userPosts = await postsModel.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "postComments",
      },
    },
    {
      $unwind: {
        path: "$postComments",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup thông tin user cho comment gốc
    {
      $lookup: {
        from: "users",
        localField: "postComments.user_id",
        foreignField: "_id",
        let: { commentUserId: "$postComments.user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$commentUserId"] },
            },
          },
          {
            $project: {
              _id: 0,
              avatar: 1,
              info: 1,
            },
          },
        ],
        as: "postComments.author_info",
      },
    },
    {
      $unwind: {
        path: "$postComments.author_info",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Gom nhóm lại các comment vào mảng
    {
      $group: {
        _id: "$_id",
        postData: { $first: "$$ROOT" },
        postComments: { $push: "$postComments" },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$postData", { postComments: "$postComments" }],
        },
      },
    },
    {
      $addFields: {
        postComments: {
          $filter: {
            input: "$postComments",
            as: "comment",
            cond: { $gt: [{ $size: { $objectToArray: "$$comment" } }, 0] },
          },
        },
      },
    },
  ]).toArray();
// Với mỗi post, xử lý đệ quy các comment
for (const post of userPosts) {
    if (post.postComments && post.postComments.length) {
      post.postComments = await getCommentsWithReplies(post.postComments);
    }
}

export
        