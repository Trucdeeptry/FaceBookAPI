// Hàm đệ quy thêm author_info cho comment & reply
async function populateAuthorInfo(comment) {
    if (!comment.author_info) {
      comment.author_info = await usersCollection.findOne(
        { _id: comment.user_id },
        { projection: { avatar: 1, info: 1 } }
      );
    }
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = await Promise.all(
        comment.replies.map(reply => populateAuthorInfo(reply))
      );
    }
    return comment;
  }
  
  async function getCommentsWithReplies(postComments) {
    return await Promise.all(
      postComments.map(comment => populateAuthorInfo(comment))
    );
  }
  
  // Phần aggregate lấy post đã có postComments (chỉ join cho comment gốc)
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
  
  // Xử lý đệ quy để thêm author_info cho tất cả comment & replies
  for (const post of userPosts) {
    if (post.postComments && post.postComments.length) {
      post.postComments = await getCommentsWithReplies(post.postComments);
    }
  }
  
  res.status(200).json({
    status: "success",
    data: {
      avatar,
      info,
      bio,
      friends,
      countFollwing,
      countFollowers,
      userPosts,
    },
  });
  