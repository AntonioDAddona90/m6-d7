import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

import Lottie from "lottie-web";
import animationData from "../../data/animation_lka8u3r2.json";

const Home = (props) => {
  useEffect(() => {
    const animationContainer = document.getElementById("animation-container");
    Lottie.loadAnimation({
      container: animationContainer,
      animationData: animationData,
      loop: true,
      autoplay: true,
    });
  }, []);

  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
      <div
        id="animation-container"
        style={{ height: "30rem", overflow: "hidden" }}
        className="mx-auto"
      />
      <BlogList />
    </Container>
  );
};

export default Home;