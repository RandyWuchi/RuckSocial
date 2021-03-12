const Like = require("../../models/Like");
const User = require("../../models/User");
const Post = require("../../models/Post");

module.exports = {
  Mutation: {
    createLike: async (root, { input: { userId, postId } }, contex, info) => {
      const like = await new Like({ user: userId, post: postId }).save();

      // Push like to post collection
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: like.id } }
      );
      // Push like to user collection
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { likes: like.id } }
      );

      return like;
    },
    deleteLike: async (root, { input: { id } }, contex, info) => {
      const like = await Like.findByIdAndRemove(id);

      // Delete like from users collection
      await User.findOneAndUpdate(
        { _id: like.user },
        { $pull: { likes: like.id } }
      );
      // Delete like from posts collection
      await Post.findOneAndUpdate(
        { _id: like.post },
        { $pull: { likes: like.id } }
      );

      return like;
    },
  },
};
