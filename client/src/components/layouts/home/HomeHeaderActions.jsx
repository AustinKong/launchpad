import { useEffect } from "react";

import { useHomeHeader } from "@/components/layouts/home/HomeHeaderContext";

export default function HomeHeaderActions({ children }) {
  const { setActions } = useHomeHeader();

  useEffect(() => {
    setActions(children);
    return () => setActions([]);
  }, [children, setActions]);

  return null;
}
