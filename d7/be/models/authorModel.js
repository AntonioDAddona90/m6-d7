const mongoose = require("mongoose");

const AuthorModelSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: "https://miro.medium.com/v2/resize:fit:720/1*W35QUSvGpcLuxPo3SRTH4w.png",
    },
    blogPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Author", AuthorModelSchema, "authors");