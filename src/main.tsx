import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import CartProvider from "./state/CartProvider";
import DataProvider from "./state/DataProvider";
import SessionProvider from "./state/SessionProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataProvider>
      <SessionProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </SessionProvider>
    </DataProvider>
  </StrictMode>,
);
