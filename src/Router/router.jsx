import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../InitialPage/Sidebar/Header";
import Sidebar from "../InitialPage/Sidebar/Sidebar";
import { pagesRoute, posRoutes, publicRoutes } from "./router.link";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeSettings from "../InitialPage/themeSettings";
import { useLocation } from "react-router-dom";
const AllRoutes = () => {
  const data = useSelector((state) => state.toggle_header);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const HeaderLayout = () => {
    const location = useLocation();

    // Dashboard page वर sidebar hide करायचा
    const hideSidebarOnRoutes = ["/admin-dashboard"]; // Add more paths if needed
    const shouldHideSidebar = hideSidebarOnRoutes.includes(location.pathname);

    return (
      <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
        <Header />
        {!shouldHideSidebar && (
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        )}
        <Outlet />
        <ThemeSettings />
      </div>
    );
  };
  // const HeaderLayout = () => ( 
  //   <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
  //   {/* <Loader /> */}
  //   <Header />
  //   <Sidebar />
  //   <Outlet />
  //   <ThemeSettings />
  // </div>
  // );

  const Authpages = () => (
    <div className={data ? "header-collapse" : ""}>
      <Outlet />
      {/* <Loader /> */}
      <ThemeSettings />
    </div>
  );

  const Pospages = () => (
    <div>
      <Header />
      <Outlet />
      {/* <Loader /> */}
      <ThemeSettings />
    </div>
  );

  return (
    <div>
      <Routes>
        <Route path="/pos" element={<Pospages />}>
          {posRoutes.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
        <Route path={"/"} element={<HeaderLayout />}>
          {publicRoutes.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>

        <Route path={"/"} element={<Authpages />}>
          {pagesRoute.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
      </Routes>
    </div>
  );
};
export default AllRoutes;
