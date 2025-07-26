import { createContext, useContext, useState } from "react";

// Split the two contexts so updates to one panel do not affect the other
const LeftPanelContext = createContext();
const RightPanelContext = createContext();

export function useLeftPanel() {
  const context = useContext(LeftPanelContext);
  if (!context) {
    throw new Error("useLeftPanel must be used within a PanelProvider");
  }
  return context;
}

export function useRightPanel() {
  const context = useContext(RightPanelContext);
  if (!context) {
    throw new Error("useRightPanel must be used within a PanelProvider");
  }
  return context;
}

export function PanelProvider({ children }) {
  const [leftPanel, setLeftPanel] = useState([]);
  const [rightPanel, setRightPanel] = useState([]);

  return (
    <LeftPanelContext.Provider value={{ leftPanel, setLeftPanel }}>
      <RightPanelContext.Provider value={{ rightPanel, setRightPanel }}>
        {children}
      </RightPanelContext.Provider>
    </LeftPanelContext.Provider>
  );
}
