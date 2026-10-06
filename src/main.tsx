import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import DataProvider from "./state/DataProvider";
import SessionProvider from "./state/SessionProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataProvider>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </DataProvider>
  </StrictMode>,
);
