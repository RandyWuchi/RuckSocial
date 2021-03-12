const { gql } = require("apollo-server");

module.exports = gql`
  # ---------------------------------------------------------
  # User Model Objects
  # ---------------------------------------------------------
  type User {
    id: ID!
    fullName: String!
    email: String!
    username: String!
    password: String!
    resetToken: String
    resetTokenExpiry: String
    image: File
    imagePublicId: String
    coverImage: File
    coverImagePublicId: String
    isOnline: Boolean
    posts: [PostPayload]
    likes: [Like]
    comments: [Comment]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    createdAt: String
    updatedAt: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Token {
    token: String!
  }

  type SuccessMessage {
    message: String!
  }

  input SignInInput {
    emailOrUsername: String!
    password: String
  }

  input SignUpInput {
    email: String!
    username: String!
    fullName: String!
    password: String!
  }

  input RequestPasswordResetInput {
    email: String!
  }

  input ResetPasswordInput {
    email: String!
    token: String!
    password: String!
  }

  input UploadUserPhotoInput {
    id: ID!
    image: Upload!
    imagePublicId: String
    isCover: Boolean
  }

  type UserPayload {
    id: ID!
    fullName: String
    email: String
    username: String
    password: String
    image: String
    imagePublicId: String
    coverImage: String
    coverImagePublicId: String
    isOnline: Boolean
    posts: [PostPayload]
    likes: [Like]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    newNotifications: [NotificationPayload]
    newConversations: [ConversationsPayload]
    unseenMessage: Boolean
    createdAt: String
    updatedAt: String
  }
  type UsersPayload {
    users: [UserPayload]!
    count: String!
  }
  type IsUserOnlinePayload {
    userId: ID!
    isOnline: Boolean
  }

  # ---------------------------------------------------------
  # Post Model Objects
  # ---------------------------------------------------------

  type Post {
    id: ID!
    title: String
    image: File
    imagePublicId: String
    author: User!
    likes: [Like]
    comments: [Comment]
    createdAt: String
    updatedAt: String
  }

  input CreatePostInput {
    title: String
    image: Upload
    imagePublicId: String
    authorId: ID!
  }
  input DeletePostInput {
    id: ID!
    imagePublicId: String
  }

  type UserPostsPayload {
    posts: [PostPayload]!
    count: String!
  }
  type PostPayload {
    id: ID!
    title: String
    image: String
    imagePublicId: String
    author: UserPayload!
    likes: [Like]
    comments: [CommentPayload]
    createdAt: String
    updatedAt: String
  }
  type PostsPayload {
    posts: [PostPayload]!
    count: String!
  }

  # ---------------------------------------------------------
  # Notification Model Objects
  # ---------------------------------------------------------

  enum NotificationType {
    LIKE
    FOLLOW
    COMMENT
  }
  type Notification {
    id: ID!
    user: User
    author: User
    post: ID!
    like: Like
    follow: Follow
    comment: Comment
    type: NotificationType
    seen: Boolean
    createdAt: String
  }

  input CreateNotificationInput {
    userId: ID!
    authorId: ID!
    postId: ID
    notificationType: NotificationType!
    notificationTypeId: ID
  }
  input DeleteNotificationInput {
    id: ID!
  }
  input UpdateNotificationSeenInput {
    userId: ID!
  }

  type NotificationPayload {
    id: ID
    user: UserPayload
    author: UserPayload
    like: LikePayload
    follow: Follow
    comment: CommentPayload
    createdAt: String
  }
  type NotificationsPayload {
    count: String!
    notifications: [NotificationPayload]!
  }
  enum NotificationOperationType {
    CREATE
    DELETE
  }
  type NotificationCreatedOrDeletedPayload {
    operation: NotificationOperationType!
    notification: NotificationPayload
  }

  # ---------------------------------------------------------
  # Message Model Objects
  # ---------------------------------------------------------
  type Message {
    id: ID!
    sender: User!
    receiver: User!
    message: String!
    createdAt: String
    updateAt: String
  }

  input CreateMessageInput {
    sender: ID!
    receiver: ID!
    message: String!
  }
  input UpdateMessageSeenInput {
    sender: ID
    receiver: ID!
  }

  type MessagePayload {
    id: ID!
    receiver: UserPayload
    sender: UserPayload
    message: String
    seen: Boolean
    createdAt: String
    isFirstMessage: Boolean
  }
  type ConversationsPayload {
    id: ID!
    username: String
    fullName: String
    image: String
    isOnline: Boolean
    seen: Boolean
    lastMessage: String
    lastMessageSender: Boolean
    lastMessageCreatedAt: String
  }

  # ---------------------------------------------------------
  # Like Model Objects
  # ---------------------------------------------------------
  type Like {
    id: ID!
    post: ID
    user: ID
  }

  input CreateLikeInput {
    userId: ID!
    postId: ID!
  }
  input DeleteLikeInput {
    id: ID!
  }

  type LikePayload {
    id: ID!
    post: PostPayload
    user: UserPayload
  }

  # ---------------------------------------------------------
  # Follow Model Objects
  # ---------------------------------------------------------
  type Follow {
    id: ID!
    user: ID
    follower: ID
  }

  input CreateFollowInput {
    userId: ID!
    followerId: ID!
  }
  input DeleteFollowInput {
    id: ID!
  }

  # ---------------------------------------------------------
  # Comment Model Objects
  # ---------------------------------------------------------
  type Comment {
    id: ID!
    comment: String!
    author: ID
    post: ID
    createdAt: String
  }

  input CreateCommentInput {
    comment: String!
    author: ID!
    postId: ID!
  }
  input DeleteCommentInput {
    id: ID!
  }

  type CommentPayload {
    id: ID
    comment: String
    author: UserPayload
    post: PostPayload
    createdAt: String
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------

  type Query {
    # ---------------------------------------------------------
    # User Model Queries
    # ---------------------------------------------------------
    # Verifies reset password token
    verifyResetPasswordToken(email: String, token: String!): SuccessMessage
    # Gets the currently logged in user
    getAuthUser: UserPayload
    # Gets user by username or by id
    getUser(username: String, id: ID): UserPayload
    # Gets all users
    getUsers(userId: String!, skip: Int, limit: Int): UsersPayload
    # Searches users by username or fullName
    searchUsers(searchQuery: String!): [UserPayload]
    # Gets Suggested people for user
    suggestPeople(userId: String!): [UserPayload]

    # ---------------------------------------------------------
    # Post Model Queries
    # ---------------------------------------------------------
    # Gets user posts by username
    getUserPosts(username: String!, skip: Int, limit: Int): UserPostsPayload
    # Gets posts from followed users
    getFollowedPosts(userId: String!, skip: Int, limit: Int): PostsPayload
    # Gets all posts
    getPosts(authUserId: ID!, skip: Int, limit: Int): PostsPayload
    # Gets post by id
    getPost(id: ID!): PostPayload

    # ---------------------------------------------------------
    # Notification Model Queries
    # ---------------------------------------------------------
    # Gets notifications for specific user
    getUserNotifications(
      userId: ID!
      skip: Int
      limit: Int
    ): NotificationsPayload

    # ---------------------------------------------------------
    # Message Model Queries
    # ---------------------------------------------------------
    # Gets user's messages
    getMessages(authUserId: ID!, userId: ID!): [MessagePayload]
    # Gets user's conversations
    getConversations(authUserId: ID!): [ConversationsPayload]
  }

  # ---------------------------------------------------------
  #  Mutations
  # ---------------------------------------------------------

  type Mutation {
    # ---------------------------------------------------------
    # User Model Mutation
    # ---------------------------------------------------------
    # Signs in user
    signin(input: SignInInput!): Token
    # Signs up user
    signup(input: SignUpInput!): Token
    # Requests reset password
    requestPasswordReset(input: RequestPasswordResetInput!): SuccessMessage
    # Resets user password
    resetPassword(input: ResetPasswordInput!): Token
    # Uploads user Profile or Cover photo
    uploadUserPhoto(input: UploadUserPhotoInput!): UserPayload

    # ---------------------------------------------------------
    # Post Model Mutation
    # ---------------------------------------------------------
    # Creates a new post
    createPost(input: CreatePostInput!): PostPayload
    # Deletes a user post
    deletePost(input: DeletePostInput!): PostPayload

    # ---------------------------------------------------------
    # Notification Model Mutation
    # ---------------------------------------------------------
    # Creates a new notification for user
    createNotification(input: CreateNotificationInput!): Notification
    # Deletes a notification
    deleteNotification(input: DeleteNotificationInput!): Notification
    # Updates notification seen values for user
    updateNotificationSeen(input: UpdateNotificationSeenInput!): Boolean

    # ---------------------------------------------------------
    # Message Model Mutation
    # ---------------------------------------------------------
    # Creates a message
    createMessage(input: CreateMessageInput!): MessagePayload
    # Updates message seen values for user
    updateMessageSeen(input: UpdateMessageSeenInput!): Boolean

    # ---------------------------------------------------------
    # Like Model Mutation
    # ---------------------------------------------------------
    # Creates a like for post
    createLike(input: CreateLikeInput!): Like
    # Deletes a post like
    deleteLike(input: DeleteLikeInput!): Like

    # ---------------------------------------------------------
    # Follow Model Mutation
    # ---------------------------------------------------------
    # Creates a following/follower relationship between users
    createFollow(input: CreateFollowInput!): Follow
    # Deletes a following/follower relationship between users
    deleteFollow(input: DeleteFollowInput!): Follow

    # ---------------------------------------------------------
    # Comment Model Mutation
    # ---------------------------------------------------------
    # Creates a post comment
    createComment(input: CreateCommentInput!): Comment
    # Deletes a post comment
    deleteComment(input: DeleteCommentInput!): Comment
  }

  # ---------------------------------------------------------
  #  Subscriptions
  # ---------------------------------------------------------

  type Subscription {
    # ---------------------------------------------------------
    # User Model Subscriptions
    # ---------------------------------------------------------
    # Subscribes to is user online event
    isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload

    # ---------------------------------------------------------
    # Notification Model Subscriptions
    # ---------------------------------------------------------
    # Subscribes to notification created or deleted event
    notificationCreatedOrDeleted: NotificationCreatedOrDeletedPayload

    # ---------------------------------------------------------
    # Message Model Subscriptions
    # ---------------------------------------------------------
    # Subscribes to message created event
    messageCreated(authUserId: ID!, userId: ID!): MessagePayload
    # Subscribes to new conversation event
    newConversation: ConversationsPayload
  }
`;
