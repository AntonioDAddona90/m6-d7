const mongoose = require("mongoose");

const PostModelSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    readTime: {
      value: {
        type: Number,
        required: false,
      },
      unit: {
        type: String,
        required: false,
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);
//MONGODB creerà il file con un ID univoco, 'createdAt' e 'updatedAt' / lo strict servirà per non permettere il passaggio di proprietà diverse da quelle indicate in questo file.

//ora dobbiamo esportare l'intero modulo
module.exports = mongoose.model("Post", PostModelSchema, "posts");