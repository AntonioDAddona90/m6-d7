/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";

//!----------> UTILITIES IMPORT
import axios from "axios";
import { nanoid } from "nanoid";

//!----------> BOOTSTRAP IMPORT
import { Button, Container, Image, Alert } from "react-bootstrap";

//!----------> ROUTER-DOM IMPORT
import { useNavigate, useParams } from "react-router-dom";

//!----------> COMPONENT IMPORT
import BlogLike from "../../components/likes/BlogLike";
import NewCommentModal from "../../components/blogPostNewComment/NewCommentModal";

//!----------> CSS IMPORT
import "./blogPage.css";

//!----------> CONTEXT IMPORT
import { SelectedBlogPostContext } from "../../context/SelectedBlogPostContext";
import { ThemeContext } from "../../context/themeContext";
import { NewCommentContext } from "../../context/NewCommentContext";
import { PostsContext } from "../../context/PostsContext";

//!----------> ICONS IMPORT
import { FiThumbsUp } from "react-icons/fi";
import { FiThumbsDown } from "react-icons/fi";
import { BsStarFill } from "react-icons/bs";



const BlogPage = () => {
  const { theme } = useContext(ThemeContext);
  const { showNewCommentModal, setShowNewCommentModal } = useContext(NewCommentContext);
  const { selectedBlogPost } = useContext(SelectedBlogPostContext);
  const { blogPosts } = useContext(PostsContext);

  // const blogPosts = [selectedBlogPost];
  // console.log(blogPosts);
  // console.log(selectedBlogPost);

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [comments, setComments] = useState([]);
  // console.log(comments);
  const [loading, setLoading] = useState(true);
  // console.log(blog);

  // const specificBlog = blogPosts.find((post) => post._id === id);
  const specificBlog = selectedBlogPost;
  // console.log(specificBlog);

  //? function to change the state of showNewCommentModal => if true a modal appear allowing you to add a new comment to the blogPost
  const handleShowNewCommentModal = () => {
    setShowNewCommentModal(true);
  };

  //? function to get from DB all the reviews of a specific blogPost based on its ID
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/posts/${id}/comments`);
      const data = response.data.comments;
      setComments(data);
      setLoading(false);
    } catch (error) {
      console.log(`Error fetching comments from post with id: ${id}`);
    }
  };

  //? function to get from DB a single blogPost by its ID
  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/posts/${id}`);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.log(`Error fetching blogPost with id: ${id}`);
    }
  };

  //? function to visualize stars based on rate input
  const renderStarRating = (rate) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <BsStarFill
          key={i}
          style={{ color: i <= rate ? "gold" : "gray", cursor: "pointer", paddingBottom: "3px" }}
        />
      );
    }
    return stars;
  };

  //? each time newCommentModal's state will change and a specificBlog is true, run fetchComments and fetchBlog, otherwise redirect to NotFound Page
  useEffect(() => {
    if (specificBlog) {
      // localStorage.setItem("blogPostId", id);
      
      fetchComments();
      fetchBlog();
    } else {
      navigate("*");
    }
  }, [showNewCommentModal, id]);

  //! ---------------> JSX RENDER
  if (loading) {
    return (
      <div style={{ minHeight: "90vh", paddingTop: "10rem", paddingInlineStart: "4rem" }}>
        loading
      </div>
    );
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={specificBlog.cover} fluid />
          <h1 className={`blog-details-title  ${theme === "light" ? "" : "text-light"}`}>
            {specificBlog.title}
          </h1>

          <div
            dangerouslySetInnerHTML={{ __html: specificBlog.content }}
            className={` blogContent py-2 ${theme === "light" ? "" : "text-light"}`}
          />

          <div className={`blog-details-container ${theme === "light" ? "" : "text-light"}`}>
            <div className="blog-details-info mt-5">
              <div>{specificBlog.createdAt}</div>
              {/* <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div> */}

              <div style={{ marginTop: 20 }}>
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>

              <div className="showComments mt-4 w-100 d-flex flex-column ">
                <Button
                  variant={theme === "light" ? "outline-primary" : "outline-warning"}
                  style={{ width: "200px" }}
                  className="align-self-end"
                  onClick={handleShowNewCommentModal}
                >
                  Add A New Review
                </Button>
                <NewCommentModal blogPost={specificBlog} fetchComments={fetchComments} />
                <hr />
                <h3 className="mb-4">Top Reviews:</h3>
                {comments.length === 0 ? (
                  <Alert variant="danger" className="text-center mt-3">
                    No Reviews Yet! Hurry Up and Add a New One!
                  </Alert>
                ) : (
                  comments.map((comment) => (
                    <div
                      className="border rounded mb-3 p-3"
                      style={{ maxWidth: "800px" }}
                      key={nanoid()}
                    >
                      <h3 className="mb-4">{comment.title}</h3>

                      <p>{comment.content}</p>
                      <p>
                        Rate: {comment.rating} {renderStarRating(comment.rating)}
                      </p>
                      <p className="mb-5 d-flex align-items-center gap-2">
                        <em>reviewed by: </em>
                        <span>
                          <img
                            src={comment.userName.avatar}
                            alt={comment._id}
                            style={{
                              width: "25px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              background: "#fff",
                            }}
                          />
                        </span>
                        {comment.userName.email}
                      </p>
                      <div className="d-flex align-items-center justify-content-start gap-2">
                        <em style={{ fontSize: ".8rem" }}>Was this review usefull?</em>
                        <FiThumbsUp style={{ cursor: "pointer" }} />
                        <FiThumbsDown style={{ cursor: "pointer" }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
};

export default BlogPage;