const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const followsResolvers = require("./follows");
const likesResolvers = require("./likes");
const messagesResolvers = require("./messages");
const notificationsResolvers = require("./notifications");

module.exports = {
  //   Post: {
  //     likesCount: (parent) => parent.likes.length,
  //     commentsCount: (parent) => parent.comments.length,
  //   },
  Query: {
    ...usersResolvers.Query,
    ...postsResolvers.Query,
    ...messagesResolvers.Query,
    ...notificationsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...followsResolvers.Mutation,
    ...likesResolvers.Mutation,
    ...messagesResolvers.Mutation,
    ...notificationsResolvers.Mutation,
  },
  Subscription: {
    ...usersResolvers.Subscription,
    ...messagesResolvers.Subscription,
    ...notificationsResolvers.Subscription,
  },
};
