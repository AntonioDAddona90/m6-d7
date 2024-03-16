import React, { useState, useContext } from "react";
import axios from "axios";

import { Button, Modal, Form } from "react-bootstrap";

//!----------> CONTEXT IMPORT
import { NewCommentContext } from "../../context/NewCommentContext";
import { AuthorsContext } from "../../context/AuthorsContenx";

//!----------> MIDDLEWARES IMPORT
import { useSession } from "../../middlewares/ProtectedRoutes";

const NewCommentModal = (postId, fetchComments) => {
  const { authors } = useContext(AuthorsContext);
  const { showNewCommentModal, setShowNewCommentModal } = useContext(NewCommentContext);
  const session = useSession();
  const myAuthor = authors.find((author) => author._id === session.id);
  const selectedAuthor = myAuthor ? `${myAuthor.firstName} ${myAuthor.lastName}` : "";

  const handleCloseNewCommentModal = () => {
    setShowNewCommentModal(false);
  };

  const [newCommentData, setNewCommentData] = useState({
    userName: myAuthor,
    title: "",
    content: "",
    rating: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommentData({
      ...newCommentData,
      [name]: value,
    });
  };

  const handlePostNewComment = async (e) => {
    e.preventDefault();

    try {
      const id = postId.blogPost._id;
      await axios.post(`http://localhost:5050/posts/${id}/newComment`, newCommentData);

      setNewCommentData({
        userName: "",
        title: "",
        content: "",
        rating: "",
      });
      handleCloseNewCommentModal();
      fetchComments();
    } catch (error) {
      console.log("Error sending New Review: ", error);
    }
  };

  return (
    <>
      <Modal size="lg" centered show={showNewCommentModal} onHide={handleCloseNewCommentModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add a new Review for Article with title: "{postId.blogPost.title}"
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handlePostNewComment}>
          <Modal.Body>
            <Form.Group controlId="blog-author" className="mt-3">
              <Form.Label>Author</Form.Label>
              <Form.Control size="lg" name="author" value={selectedAuthor} disabled />
            </Form.Group>

            <Form.Group controlId="newCommentTitleInput" className="mt-3">
              <Form.Label>Review Title:</Form.Label>
              <Form.Control
                name="title"
                value={newCommentData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="newCommentContentInput" className="mt-3">
              <Form.Label>Review Content:</Form.Label>
              <Form.Control
                name="content"
                value={newCommentData.content}
                onChange={handleInputChange}
                required
                as="textArea"
                rows="10"
              />
            </Form.Group>

            <Form.Group controlId="newCommentRatingInput" className="mt-3">
              <Form.Label>Rate:</Form.Label>
              <Form.Control
                required
                as="select"
                name="rating"
                value={newCommentData.rating}
                onChange={handleInputChange}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseNewCommentModal}>
              Close
            </Button>
            <Button variant="outline-primary" type="submit">
              Send New Review
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default NewCommentModal;