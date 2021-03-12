const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    password: {
      type: String,
      required: true,
    },
    image: String,
    imagePublicId: String,
    coverImage: String,
    coverImagePublicId: String,
    isOnline: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

module.exports = model("User", userSchema);
