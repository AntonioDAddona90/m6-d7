const express = require("express");

const CommentModel = require("../../models/commentsModel");
const AuthorModel = require("../../models/authorModel");
const commentsModel = require("../../models/commentsModel");

const comment = express.Router();

//!----------> GET ALL
comment.get("/comments", async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("userName");

    if (!comments || comments.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No Comments Found",
      });
    }

    res.status(200).send({
      statusCode: 200,
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

//!----------> POST new comment
comment.post("/comments/create", async (req, res) => {
  const user = await AuthorModel.findOne({
    _id: req.body.userName,
  });

  const newComment = new commentsModel({
    userName: user._id,
    title: req.body.title,
    content: req.body.content,
    rating: req.body.rating,
  });

  try {
    const comment = await newComment.save();

    res.status(200).send({
      statusCode: 200,
      message: "New Comment Successfully Created!",
      payload: comment,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

module.exports = comment;

//!----------> PATCH comment
comment.patch("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const commentExists = await commentsModel.findById(commentId);

  if (!commentExists) {
    return res.status(404).send({
      statuscode: 404,
      message: `Comment with id ${commentId} not found!`,
    });
  }

  try {
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await CommentModel.findByIdAndUpdate(
      commentId,
      dataToUpdate,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "Updated successfully!",
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

//!----------> DELETE comment
comment.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const commentExists = await CommentModel.findById(commentId);

  if (!commentExists) {
    return res.status(404).send({
      statuscode: 404,
      message: `Comment with id ${commentId} not found`,
    });
  }

  try {
    const commentToDelete = await CommentModel.findByIdAndDelete(commentId);

    res.status(200).send({
      statusCode: 200,
      message: `Comment with id ${commentId} deleted successfully`,
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