
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import API_URL from "./config/api";

const originalFetch = window.fetch.bind(window);

window.fetch = (input, init) => {
  const localApi =
    "http://localhost:5000";

  if (
    typeof input === "string" &&
    input.startsWith(localApi)
  ) {
    input =
      API_URL +
      input.substring(localApi.length);
  }

  return originalFetch(input, init);
};
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);