const Post = require("../../models/Post");
const User = require("../../models/User");
const Comment = require("../../models/Comment");

module.exports = {
  Mutation: {
    createComment: async (
      parent,
      { input: { comment, author, postId } },
      context,
      info
    ) => {
      const newComment = await new Comment({
        comment,
        author,
        post: postId,
      }).save();

      // Push comment to post collection
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: newComment.id } }
      );
      // Push comment to user collection
      await User.findOneAndUpdate(
        { _id: author },
        { $push: { comments: newComment.id } }
      );

      return newComment;
    },
    deleteComment: async (parent, { input: { id } }, contex, info) => {
      const comment = await Comment.findByIdAndRemove(id);

      // Delete comment from users collection
      await User.findOneAndUpdate(
        { _id: comment.author },
        { $pull: { comments: comment.id } }
      );
      // Delete comment from posts collection
      await Post.findOneAndUpdate(
        { _id: comment.post },
        { $pull: { comments: comment.id } }
      );

      return comment;
    },
  },
};
