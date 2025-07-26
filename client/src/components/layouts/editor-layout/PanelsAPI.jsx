import { Children, isValidElement, useEffect, useMemo } from "react";

import { useLeftPanel, useRightPanel } from "./PanelsContext";

function useRegisterPanel(children, setPanel) {
  const tabs = useMemo(() => {
    return Children.toArray(children)
      .filter(isValidElement)
      .map((child) => ({
        label: child.props.label,
        content: child.props.children,
      }));
  }, [children]);

  useEffect(() => {
    setPanel(tabs);
    return () => setPanel([]);
  }, [tabs, setPanel]);
}

// Factory to create LeftPanel and RightPanel components
function createPanelComponent(usePanelHook, displayName) {
  function PanelComponent({ children }) {
    const { setPanel } = usePanelHook();
    useRegisterPanel(children, setPanel);
    return null;
  }

  PanelComponent.displayName = displayName;
  PanelComponent.Tab = ({ children }) => children;
  return PanelComponent;
}

export const LeftPanel = createPanelComponent(() => {
  const { setLeftPanel } = useLeftPanel();
  return { setPanel: setLeftPanel };
}, "LeftPanel");

export const RightPanel = createPanelComponent(() => {
  const { setRightPanel } = useRightPanel();
  return { setPanel: setRightPanel };
}, "RightPanel");
