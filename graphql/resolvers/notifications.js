const { withFilter } = require("apollo-server");

const pubSub = require("../../utils/pubSub");
const {
  NOTIFICATION_CREATED_OR_DELETED,
} = require("../../constants/Subscriptions");
const Notification = require("../../models/Notification");
const User = require("../../models/User");

module.exports = {
  Query: {
    getUserNotifications: async (
      parent,
      { userId, skip, limit },
      context,
      info
    ) => {
      const query = { user: userId };
      const count = await Notification.where(query).countDocuments();
      const notifications = await Notification.where(query)
        .populate("author")
        .populate("user")
        .populate("follow")
        .populate({ path: "comment", populate: { path: "post" } })
        .populate({ path: "like", populate: { path: "post" } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: "desc" });

      return { notifications, count };
    },
  },

  Mutation: {
    createNotification: async (
      parent,
      {
        input: {
          userId,
          authorId,
          postId,
          notificationType,
          notificationTypeId,
        },
      },
      context,
      info
    ) => {
      let newNotification = await new Notification({
        author: authorId,
        user: userId,
        post: postId,
        [notificationType.toLowerCase()]: notificationTypeId,
      }).save();

      // Push notification to user collection
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { notifications: newNotification.id } }
      );

      // Publish notification created event
      newNotification = await newNotification
        .populate("author")
        .populate("follow")
        .populate({ path: "comment", populate: { path: "post" } })
        .populate({ path: "like", populate: { path: "post" } })
        .execPopulate();
      pubSub.publish(NOTIFICATION_CREATED_OR_DELETED, {
        notificationCreatedOrDeleted: {
          operation: "CREATE",
          notification: newNotification,
        },
      });

      return newNotification;
    },
    deleteNotification: async (parent, { input: { id } }, context, info) => {
      let notification = await Notification.findByIdAndRemove(id);

      // Delete notification from users collection
      await User.findOneAndUpdate(
        { _id: notification.user },
        { $pull: { notifications: notification.id } }
      );

      // Publish notification deleted event
      notification = await notification
        .populate("author")
        .populate("follow")
        .populate({ path: "comment", populate: { path: "post" } })
        .populate({ path: "like", populate: { path: "post" } })
        .execPopulate();
      pubSub.publish(NOTIFICATION_CREATED_OR_DELETED, {
        notificationCreatedOrDeleted: {
          operation: "DELETE",
          notification,
        },
      });

      return notification;
    },
    updateNotificationSeen: async (
      parent,
      { input: { userId } },
      context,
      info
    ) => {
      try {
        await Notification.updateMany(
          { user: userId, seen: false },
          { seen: true },
          { multi: true }
        );

        return true;
      } catch (e) {
        return false;
      }
    },
  },

  Subscription: {
    notificationCreatedOrDeleted: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(NOTIFICATION_CREATED_OR_DELETED),
        (payload, variables, { authUser }) => {
          const userId = payload.notificationCreatedOrDeleted.notification.user.toString();

          return authUser && authUser.id === userId;
        }
      ),
    },
  },
};
