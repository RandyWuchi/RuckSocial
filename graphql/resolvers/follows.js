const Follow = require("../../models/Follow");
const User = require("../../models/User");

module.exports = {
  Mutation: {
    createFollow: async (
      parent,
      { input: { userId, followerId } },
      context,
      info
    ) => {
      const follow = await new Follow({
        user: userId,
        follower: followerId,
      }).save();

      // Push follower/following to user collection
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { followers: follow.id } }
      );
      await User.findOneAndUpdate(
        { _id: followerId },
        { $push: { following: follow.id } }
      );

      return follow;
    },
    deleteFollow: async (parent, { input: { id } }, context, info) => {
      const follow = await Follow.findByIdAndRemove(id);

      // Delete follow from users collection
      await User.findOneAndUpdate(
        { _id: follow.user },
        { $pull: { followers: follow.id } }
      );
      await User.findOneAndUpdate(
        { _id: follow.follower },
        { $pull: { following: follow.id } }
      );

      return follow;
    },
  },
};
