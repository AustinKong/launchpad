import { createContext, useContext, useState } from "react";

const HeaderContext = createContext(null);

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHomeHeader must be used within a HomeHeaderProvider");
  }
  return context;
}

export function HeaderProvider({ children }) {
  const [actions, setActions] = useState([]);

  return (
    <HeaderContext.Provider value={{ actions, setActions }}>{children}</HeaderContext.Provider>
  );
}
