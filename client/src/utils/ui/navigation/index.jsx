import { useEffect } from "react";
import { useNavigate } from "react-router";

import NavigationController from "./NavigationController";

import { createSingleton } from "@/utils/createSingleton";

/**
 * Singleton navigation controller.
 * Use `navigation.goto(...)` or `navigation.replace(...)` to navigate programmatically.
 * @type {NavigationController}
 */
export const navigation = createSingleton("navigation", () => new NavigationController());

export function NavigationProvider({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigation.register(navigate);
  }, [navigate]);

  return children;
}
