import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

// Create a root element
const rootElement = document.getElementById("root");

// Ensure the DOM is ready
if (rootElement) {
  const root = createRoot(rootElement);
  
  // Render the application with proper provider hierarchy
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </QueryClientProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found. Unable to mount React application.");
}
