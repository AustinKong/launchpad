import { useEffect } from "react";

import { useHeader } from "./HeaderContext";

export default function HeaderActions({ children }) {
  const { setActions } = useHeader();

  useEffect(() => {
    setActions(children);
    return () => setActions([]);
  }, [children, setActions]);

  return null;
}
