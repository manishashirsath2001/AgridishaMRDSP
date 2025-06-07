import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import AllRoutes from "./Router/router.jsx";
import AutoLogoout from "./InitialPage/Sidebar/AutoLogoout.jsx";
import NetworkStatus from "./InitialPage/Sidebar/NetworkStatus1.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <NetworkStatus />
          <AutoLogoout>
            <AllRoutes />
          </AutoLogoout>
        </BrowserRouter>

      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found.");
}
