import React, { createContext, useState } from "react";

const SelectedBlogPostContext = createContext();

const SelectedBlogPostProvider = ({ children }) => {
  const [selectedBlogPost, setSelectedBlogPost] = useState([]);

  return (
    <SelectedBlogPostContext.Provider
      value={{ selectedBlogPost, setSelectedBlogPost }}
    >
      {children}
    </SelectedBlogPostContext.Provider>
  );
};

export { SelectedBlogPostContext, SelectedBlogPostProvider };