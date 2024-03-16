import React, { createContext, useState } from "react";

const NewCommentContext = createContext();

const NewCommentProvider = ({ children }) => {
  const [showNewCommentModal, setShowNewCommentModal] = useState(false);

  return (
    <NewCommentContext.Provider
      value={{ showNewCommentModal, setShowNewCommentModal }}
    >
      {children}
    </NewCommentContext.Provider>
  );
};

export { NewCommentContext, NewCommentProvider };