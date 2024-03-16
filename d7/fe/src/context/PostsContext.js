import React, { createContext, useState } from "react";

const PostsContext = createContext();

const PostsProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);

  return (
    <PostsContext.Provider value={{ blogPosts, setBlogPosts }}>{children}</PostsContext.Provider>
  );
};

export { PostsContext, PostsProvider };