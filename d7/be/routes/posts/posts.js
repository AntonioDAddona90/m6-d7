const express = require("express");
const mongoose = require("mongoose");

const PostModel = require("../../models/postModel");
const AuthorModel = require("../../models/authorModel");
const CommentModel = require("../../models/commentsModel");

//! MiddleWare IMPORT
const uploads = require("../../middlewares/internalUpload");
const cloudUpload = require("../../middlewares/cloudUpload");
const verifiedToken = require("../../middlewares/verifiedToken");

// abilitiamo il sistema di Routing
const post = express.Router();

//!------------------------> POST of image in upload folder (b.e. directory)
post.post("/posts/internalUpload", uploads.single("cover"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  try {
    const imgUrl = req.file.filename;
    res.status(200).json({ cover: `${url}/uploads/${imgUrl}` });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: `file upload error: `,
    });
  }
});

//!------------------------> POST of image in Cloudinary
post.post("/posts/cloudUploadImg", cloudUpload.single("cover"), async (req, res) => {
  try {
    res.status(200).json({ cover: req.file.path });
    console.log(req.file.path);
  } catch (error) {
    console.error("File upload failed:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

//!------------------------> GET all posts
post.get("/posts", verifiedToken, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const totalPosts = await PostModel.countDocuments();

    const posts = await PostModel.find()
      .limit(Number(pageSize))
      .skip((Number(page) - 1) * Number(pageSize))
      .populate("author");

    res.status(200).send({
      statusCode: 200,
      totalPosts: totalPosts,
      currentPage: +page,
      pageSize: +pageSize,
      posts: posts,
    });
  } catch (error) {
    console.log("error: ", error);

    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//!------------------------> GET post by Title
post.get("/posts/search", async (req, res) => {
  const { title } = req.query;

  try {
    const postsByTitle = await PostModel.find({
      title: { $regex: new RegExp(title, "i") },
    });

    res.status(200).send({
      statusCode: 200,
      postsByTitle,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//!------------------------> GET post by Id
post.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const postById = await PostModel.findById(postId);

    res.status(200).send({
      statusCode: 200,
      postById,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      messange: "Internal server error",
      error,
    });
  }
});

//!------------------------> POST a new blogPost in DB
post.post("/posts/create", async (req, res) => {
  const user = await AuthorModel.findOne({
    _id: req.body.author,
  });

  const newPost = new PostModel({
    category: req.body.category,
    title: req.body.title,
    cover: req.body.cover,
    readTime: req.body.readTime,
    author: user._id,
    content: req.body.content,
  });

  try {
    const post = await newPost.save();

    await AuthorModel.updateOne({ _id: user._id }, { $push: { blogPosts: post } });

    res.status(201).send({
      statusCode: 201,
      message: "Post saved successfully",
      payload: post,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//!------------------------> PATCH an existing post in DB
post.patch("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const postExist = await PostModel.findById(id);

  if (!postExist) {
    return res.status(404).send({
      statusCode: 404,
      message: `Post widh id ${id} not found!`,
    });
  }
  try {
    const postId = id;
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await PostModel.findByIdAndUpdate(postId, dataToUpdate, options);

    res.status(200).send({
      statusCode: 200,
      message: `Post with id ${id} modified successfully!`,
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      messange: "Internal server error",
      error,
    });
  }
});

//!------------------------> DELETE an existing post in DB
post.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const postExist = await PostModel.findById(id);

  if (!postExist) {
    return res.status(404).send({
      statusCode: 404,
      message: `Post widh id ${id} not found!`,
    });
  }
  try {
    const postToDelete = await PostModel.findByIdAndDelete(id);

    res.status(200).send({
      statusCode: 200,
      message: `Post with id ${id} deleted successfully!`,
      postToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      messange: "Internal server error",
      error,
    });
  }
});

//?------------------------------------------------> COMMENTS ROUTES BASED ON SPECIFIC POST
//!------------------------> GET ALL comments of specific post
post.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  const blogPost = await PostModel.findById(postId).populate({
    path: "comments",
    populate: {
      path: "userName",
      select: "email avatar",
    },
  });

  const comments = blogPost.comments;

  if (!comments) {
    return res.status(404).send({
      statuscode: 404,
      message: `post with id ${postId} does not have any comments yet!`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      ReferencePostTitle: blogPost.title,
      ReferencePostId: blogPost._id,
      ReferencePostAuthor: blogPost.author,
      TotalComments: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//!------------------------> POST new comment on specific post
post.post("/posts/:postId/newComment", async (req, res) => {
  const { postId } = req.params;
  const blogPost = await PostModel.findById(postId);

  const user = await AuthorModel.findOne({
    _id: req.body.userName,
  });

  const newComment = new CommentModel({
    userName: user._id,
    title: req.body.title,
    content: req.body.content,
    rating: req.body.rating,
  });

  try {
    const comment = await newComment.save();

    await PostModel.findByIdAndUpdate(postId, { $push: { comments: comment } });

    res.status(200).send({
      statusCode: 200,
      message: "New Comment Successfully Created!",
      payload: comment,
      new: true,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//!------------------------> GET a specific comment in specific post
post.get("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;

  const blogPost = await PostModel.findById(postId);

  const comment = await CommentModel.findById(commentId).populate("userName", "email");

  if (!comment) {
    return res.status(404).send({
      statuscode: 404,
      message: `comment with id ${commentId} not found`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      message: "Here's the comment you were looking for!",
      comment,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//!------------------------> PATCH a comment in a specific post
post.patch("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;

  const blogPost = await PostModel.findById(postId);
  const commentExists = await CommentModel.findById(commentId);

  if (!commentExists) {
    return res.status(404).send({
      statuscode: 404,
      message: `comment with id ${commentId} not found!`,
    });
  }
  try {
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await CommentModel.findByIdAndUpdate(commentId, dataToUpdate, options);

    res.status(200).send({
      statuscode: 200,
      message: `comment with id ${commentId} successfully edited!`,
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//!------------------------> DELETE a comment in a specific post
post.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;

  const blogPost = await PostModel.findById(postId);
  const commentExists = await CommentModel.findById(commentId);

  if (!commentExists) {
    return res.status(404).send({
      statuscode: 404,
      message: `comment with id ${commentId} not found!`,
    });
  }

  try {
    const commentToDelete = await CommentModel.findByIdAndDelete(commentId);

    res.status(200).send({
      statusCode: 200,
      message: `comment with id ${commentId} successfully removed!`,
      commentToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

module.exports = post;