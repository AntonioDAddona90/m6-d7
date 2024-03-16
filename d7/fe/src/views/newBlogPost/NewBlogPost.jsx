import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Container, Form, Alert } from "react-bootstrap";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { nanoid } from "nanoid";

import "./NewBlogPost.css";

import { ThemeContext } from "../../context/themeContext";
import { AuthorsContext } from "../../context/AuthorsContenx";
import { useSession } from "../../middlewares/ProtectedRoutes";

const NewBlogPost = () => {
  const { theme } = useContext(ThemeContext);
  const { authors } = useContext(AuthorsContext);
  const navigate = useNavigate();
  const session = useSession();
  const myAuthor = authors.find((author) => author._id === session.id);
  const selectedAuthor = myAuthor ? `${myAuthor.firstName} ${myAuthor.lastName}` : "";

  const [blogPostCreated, setBlogPostCreated] = useState(false);

  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    author: myAuthor,
    title: "",
    category: "",
    content: "",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const fileData = new FormData();
    fileData.append("cover", file);

    try {
      const response = await axios.post("http://localhost:5050/posts/cloudUploadImg", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.log("File upload error occurs: ", error);
    }
  };

  const handleNewBlogPost = async (e) => {
    e.preventDefault();

    try {
      if (file) {
        try {
          const uploadedFile = await uploadFile(file);
          if (uploadedFile) {
            const postFormData = {
              ...formData,
              cover: uploadedFile.cover,
            };

            const response = await axios.post("http://localhost:5050/posts/create", postFormData);

            setBlogPostCreated(true);

            setTimeout(() => {
              navigate("/homepage");
            }, 5000);

            return response.data;
          } else {
            console.error("file upload failed. Please try again.");
          }
        } catch (error) {
          console.log("error uploading file: ", error);
        }
      } else {
        console.error("Please select at least one file to upload to form!");
      }
    } catch (error) {
      console.log("Error adding a new blogPost: ", error);
    }
  };

  return (
    <Container className="new-blog-container">
      <Form
        className={`mt-5 ${theme === "light" ? "" : "text-light"}`}
        onSubmit={handleNewBlogPost}
        encType="multipart/form-data"
      >
        <Form.Group controlId="blog-author" className="mt-3">
          <Form.Label>Author</Form.Label>
          <Form.Control size="lg" name="author" value={selectedAuthor} disabled />
        </Form.Group>

        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Post Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            name="title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            name="category"
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="" disabled>
              Select One
            </option>
            <option>Web Development</option>
            <option>Learn To Develop</option>
            <option>How To...</option>
            <option>Testimonials</option>
            <option>Day In My Life</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Post Content</Form.Label>
          <ReactQuill
            value={formData.content}
            name="content"
            onChange={(e) => setFormData({ ...formData, content: e })}
            className={`new-blog-content ${theme === "light" ? "" : "bg-light text-dark"}`}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-post-cover" className="mt-3">
          <Form.Label>BlogPost Cover</Form.Label>
          <Form.Control type="file" size="lg" name="cover" onChange={handleFileChange} required />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button
            type="reset"
            size="lg"
            variant={theme === "light" ? "outline-dark" : "outline-light"}
          >
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant={theme === "light" ? "dark" : "light"}
            style={{
              marginLeft: "1em",
            }}
          >
            Send
          </Button>
        </Form.Group>
      </Form>

      {blogPostCreated && (
        <Alert key={nanoid()} variant="success" className="text-center mt-5">
          Congratulations on successfully creating a new blog post! You will be automatically
          redirected to the homepage in 5 seconds.
        </Alert>
      )}
    </Container>
  );
};

export default NewBlogPost;