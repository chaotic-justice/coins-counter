import { createRouter, RouterProvider } from "@tanstack/react-router";
import { GTProvider } from "gt-react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import gtConfig from "../gt.config.json";
import "./index.css";

// Import the generated route tree
import dictionary from "./dictionary";
import loadTranslations from "./lib/loadTranslations";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <GTProvider
        {...gtConfig}
        projectId={import.meta.env.VITE_GT_PROJECT_ID}
        devApiKey={import.meta.env.VITE_GT_API_KEY}
        loadTranslations={loadTranslations}
        dictionary={dictionary}
      >
        <RouterProvider router={router} />
      </GTProvider>
    </StrictMode>,
  );
}
