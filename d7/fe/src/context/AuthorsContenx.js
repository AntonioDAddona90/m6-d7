import React, { createContext, useState } from "react";

const AuthorsContext = createContext();

const AuthorsProvider = ({ children }) => {
  const [authors, setAuthors] = useState([]);

  return <AuthorsContext.Provider value={{ authors, setAuthors }}>{children}</AuthorsContext.Provider>;
};

export { AuthorsContext, AuthorsProvider };