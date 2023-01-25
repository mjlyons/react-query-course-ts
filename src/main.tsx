import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { worker } from "@uidotdev/react-query-api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryFetchingIndicator } from "./components/QueryFetchingIndicator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 /* 1 min */,
    },
  },
});

new Promise((res) => setTimeout(res, 100))
  .then(() =>
    worker.start({
      quiet: true,
      onUnhandledRequest: "bypass",
    })
  )
  .then(() => {
    const containerEl = document.getElementById("root");
    if (!containerEl) {
      throw new Error("Cannot find root container");
    }

    const root = ReactDOM.createRoot(containerEl);
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <BrowserRouter>
            <div className="container">
              <QueryFetchingIndicator />
              <App />
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>
    );
  });
