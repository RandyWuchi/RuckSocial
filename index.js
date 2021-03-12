const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const { createServer } = require("http");
const app = express();

const { MONGODB } = require("./config");
const checkAuthorization = require("./utils/auth");
const { IS_USER_ONLINE } = require("./constants/Subscriptions");
const User = require("./models/User");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const pubSub = require("./utils/pubsub");

app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => ({ req }),
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      // Check if user is authenticated
      if (connectionParams.authorization) {
        const user = await checkAuthorization(connectionParams.authorization);

        // Publish user isOnline true
        pubSub.publish(IS_USER_ONLINE, {
          isUserOnline: {
            userId: user.id,
            isOnline: true,
          },
        });

        // Add authUser to socket's context, so we have access to it, in onDisconnect method
        return {
          authUser: user,
        };
      }
    },
    onDisconnect: async (webSocket, context) => {
      // Get socket's context
      const c = await context.initPromise;
      if (c && c.authUser) {
        // Publish user isOnline false
        pubSub.publish(IS_USER_ONLINE, {
          isUserOnline: {
            userId: c.authUser.id,
            isOnline: false,
          },
        });

        // Update user isOnline to false in DB
        await User.findOneAndUpdate(
          { email: c.authUser.email },
          {
            isOnline: false,
          }
        );
      }
    },
  },
});
server.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
