import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { LikesProvider } from "./contexts/LikesContext";

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <LikesProvider>
      <App />
    </LikesProvider>
  </CartProvider>
);
