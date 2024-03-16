import React, { createContext, useState } from "react";

const CanvassContext = createContext();

const CanvassProvider = ({ children }) => {
  const [showCanvass, setShowCanvass] = useState(false);

  return (
    <CanvassContext.Provider value={{ showCanvass, setShowCanvass }}>
      {children}
    </CanvassContext.Provider>
  );
};

export { CanvassContext, CanvassProvider };