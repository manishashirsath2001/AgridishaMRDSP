import React from "react";
import { BrowserRouter } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import { base_path } from "./environment.jsx";
import "../src/style/css/feather.css";
import "../src/style/css/line-awesome.min.css";
import "../src/style/icons/tabler-icons/webfont/tabler-icons.css";
import "../src/style/scss/main.scss";
import "../src/style/common.css";
import "../src/style/icons/fontawesome/css/fontawesome.min.css";
import "../src/style/icons/fontawesome/css/all.min.css";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./core/redux/store.jsx";
import AllRoutes from "./Router/router.jsx";
import AutoLogout from "./InitialPage/Sidebar/AutoLogoout.jsx";
// import BackButtonBlocker from "./Context/BackButtonBlocker.jsx";

// ✅ Import the NetworkStatus component
import NetworkStatus from "./InitialPage/Sidebar/NetworkStatus1.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter basename={base_path}>
          <NetworkStatus />
          <AutoLogout>
            <AllRoutes />
          </AutoLogout>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found.");
}
