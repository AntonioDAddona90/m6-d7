const mongoose = require("mongoose");

const CommentModelSchema = new mongoose.Schema(
  {
    userName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);
module.exports = mongoose.model("Comment", CommentModelSchema, "comments");