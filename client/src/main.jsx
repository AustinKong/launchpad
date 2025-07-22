import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "@/index.css";
import App from "@/App.jsx";
import { Provider as ChakraProvider } from "@/components/chakra/provider";
import { toaster } from "@/utils/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60, // 1 minute
      onError: (error) => {
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
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);
