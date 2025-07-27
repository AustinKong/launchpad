import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "@/index.css";

import App from "@/App.jsx";
import { Provider as ChakraProvider } from "@/components/chakra/provider";
import { navigation, NavigationProvider } from "@/utils/ui/navigation";
import { toaster } from "@/utils/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60,
      onError: (error) => {
        if (error.response?.status === 401) {
          // TODO: Add proper 401 page
          navigation.replace("/auth/login");
        }

        toaster.create({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          type: "error",
        });
      },
    },
    mutations: {
      onError: (error) => {
        toaster.create({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          type: "error",
        });
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <NavigationProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </NavigationProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);
