const { model, Schema } = require("mongoose");

const messageSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: Schema.Types.ObjectId,
    like: {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
    follow: {
      type: Schema.Types.ObjectId,
      ref: "Follow",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Message", messageSchema);
