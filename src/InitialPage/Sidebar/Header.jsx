import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Settings, User } from "react-feather";
import { all_routes } from "../../Router/all_routes";
// import "../../style/scss/layout/_header"
import { getUserData } from "../../Context/UserData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut } from 'react-icons/fi';
const Header = () => {
  const { userdetail } = getUserData();
  const route = all_routes;
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      if (userdetail?.uaid) {
        await axios.post(`${baseUrl.Url}/backend/api/SP_UpadateUserLogin`, {
          uaid: userdetail.uaid,
          islogin: false,
        }, {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
          }
        });
      }
      navigate("/signin");
    } catch (error) {
      console.error("❌ Logout failed:", error);

    }
  };


  useEffect(() => {
    const handleMouseover = (e) => {
      e.stopPropagation();

      const body = document.body;
      const toggleBtn = document.getElementById("toggle_btn");

      if (
        body.classList.contains("mini-sidebar") &&
        isElementVisible(toggleBtn)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("mouseover", handleMouseover);

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
    };
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  // const sidebarOverlay = () => {
  //   document?.querySelector(".main-wrapper")?.classList?.toggle("slide-nav");
  //   document?.querySelector(".sidebar-overlay")?.classList?.toggle("opened");
  //   document?.querySelector("html")?.classList?.toggle("menu-opened");
  // };
  const sidebarOverlay = () => {
    const mainWrapper = document.querySelector(".main-wrapper");
    const overlay = document.querySelector(".sidebar-overlay");
    const html = document.querySelector("html");

    mainWrapper?.classList?.toggle("slide-nav");
    overlay?.classList?.toggle("opened");
    html?.classList?.toggle("menu-opened");

    // Push dummy state to history when sidebar opens (mobile only)
    if (window.innerWidth < 768 && mainWrapper?.classList.contains("slide-nav")) {
      history.pushState(null, "", location.href);
    }
  };

  const closeSidebar = () => {
    const mainWrapper = document.querySelector(".main-wrapper");
    const overlay = document.querySelector(".sidebar-overlay");
    const html = document.querySelector("html");

    mainWrapper?.classList?.remove("slide-nav");
    overlay?.classList?.remove("opened");
    html?.classList?.remove("menu-opened");
  };


  useEffect(() => {
    const submenuItems = document.querySelectorAll(".submenu-item");
    const overlay = document.querySelector(".sidebar-overlay");

    const handleMobileClose = () => {
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    };

    submenuItems.forEach((item) => {
      item.addEventListener("click", handleMobileClose);
    });

    overlay?.addEventListener("click", handleMobileClose);

    // Handle browser back button
    const handlePopState = () => {
      const isSidebarOpen = document.querySelector(".main-wrapper")?.classList.contains("slide-nav");

      if (isSidebarOpen) {
        closeSidebar();

      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [closeSidebar]);

  let pathname = location.pathname;

  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-one",
  ];
  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }

  const toggleFullscreen = (elem) => {
    elem = elem || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  return (
    <>
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link className="logo logo-normal" onClick={handleLogout}>
            <ImageWithBasePath src="assets/img/arthadishalogo.png" alt="img" />
          </Link>
          <Link className="logo logo-white" onClick={handleLogout} >
            <ImageWithBasePath src="assets/img/logo-white.png" alt="img" />
          </Link>
          <Link className="logo-small" onClick={handleLogout}>
            <ImageWithBasePath src="assets/img/logo-small.png" alt="img" />
          </Link>
          <Link
            id="toggle_btn"
            to="#"
            style={{
              display:
                pathname.includes("tasks") || pathname.includes("pos")
                  ? "none"
                  : pathname.includes("compose")
                    ? "none"
                    : "",
            }}
            onClick={handlesidebar}
          >
            <FeatherIcon icon="chevrons-left" className="feather-16" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
          {/* Search */}
          <li className="nav-item nav-searchinputs">
            <div
              className="top-nav-search"
              style={{
                backgroundColor: '#e3eef2', // lighter shade matchingrgb(88, 129, 143)2
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#2c3e50', // dark text for contrast
                fontWeight: '500',
                fontSize: '1rem',
              }}
            >
              <b style={{ color: '#3e5f68' }}>दिनांक : <span style={{ color: 'rgb(150, 70, 187) ' }}> {userdetail?.APPDT}</span> </b>
            </div>
          </li>
          <li className="nav-item" style={{ marginLeft: '10px' }}>
            <div
              style={{
                backgroundColor: '#e3eef2',
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#2c3e50',
                fontWeight: '500',
                fontSize: '1rem',
              }}
            >
              <b style={{ color: '#3e5f68' }}><span style={{ color: 'rgb(150, 70, 187)' }}> {userdetail?.departmentname}</span></b>
            </div>
          </li>

          {/* /Select Store */}

          {/* Flag */}
          {/* <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
            <Link
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              to="#"
              role="button"
            >
            
              <ImageWithBasePath
                src="assets/img/flags/in.png"
                alt="img"
                height={16}
              />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to="#" className="dropdown-item active">
                <ImageWithBasePath
                  src="assets/img/flags/in.png"
                  alt="img"
                  height={16}
                />
                English
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/fr.png"
                  alt="img"
                  height={16}
                />{" "}
                Marathi
              </Link>
              {/* <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/es.png"
                  alt="img"
                  height={16}
                />{" "}
                Spanish
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/de.png"
                  alt="img"
                  height={16}
                />{" "}
                German
              </Link> 
            </div>
          </li> */}
          {/* /Flag */}
          {/* <li className="nav-item nav-item-box">
            <Link
              to="#"
              id="btnFullscreen"
              onClick={() => toggleFullscreen()}
              className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
              {/* <i data-feather="maximize" /> 
              <FeatherIcon icon="maximize" />
            </Link>
          </li> */}
          {/* <li className="nav-item nav-item-box">
            <Link to="/email">
              <FeatherIcon icon="mail" />
              <span className="badge rounded-pill">1</span>
            </Link>
          </li> */}
          {/* <li className="nav-item dropdown nav-item-box">
            <Link
              to="#"
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
            >
              {/* <i data-feather="bell" /> 
              <FeatherIcon icon="bell" />
              <span className="badge rounded-pill">2</span>
            </Link>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <Link to="#" className="clear-noti">
                  {" "}
                  Clear All{" "}
                </Link>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message active">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-02.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">John Doe</span> added
                            new task{" "}
                            <span className="noti-title">
                              Patient appointment booking
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              4 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-03.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Tarah Shropshire</span>{" "}
                            changed the task name{" "}
                            <span className="noti-title">
                              Appointment booking with payment gateway
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              6 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-06.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Misty Tison</span>{" "}
                            added{" "}
                            <span className="noti-title">Domenic Houston</span>{" "}
                            and <span className="noti-title">Claire Mapes</span>{" "}
                            to project{" "}
                            <span className="noti-title">
                              Doctor available module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              8 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-17.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Rolland Webber</span>{" "}
                            completed task{" "}
                            <span className="noti-title">
                              Patient and Doctor video conferencing
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              12 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-13.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Bernardo Galaviz</span>{" "}
                            added new task{" "}
                            <span className="noti-title">
                              Private chat module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              2 days ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link to="/activities">View all Notifications</Link>
              </div>
            </div>
          </li> */}
          {/* /Notifications */}
          {/* <li className="nav-item nav-item-box">
            <Link to="/general-settings">
              <FeatherIcon icon="settings" />
            </Link>
          </li> */}
          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                <span className="user-letter">
                  <ImageWithBasePath
                    src="assets/img/profiles/avator1.jpg"
                    alt="img"
                    className="img-fluid"
                  />
                </span>
                <span className="user-detail">
                  <span className="user-name">{userdetail?.username || "UserName"}</span>
                  <span className="user-role">Super Admin</span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                    <ImageWithBasePath
                      src="assets/img/profiles/avator1.jpg"
                      alt="img"
                    />
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6>{userdetail?.username || "UserName"}</h6>
                    <h5>Super Admin</h5>
                  </div>
                </div>
                <hr className="m-0" />
                <Link className="dropdown-item" to={route.profile}>
                  <User className="me-2" /> My Profile
                </Link>
                <Link className="dropdown-item" to={route.generalsettings}>
                  <Settings className="me-2" />
                  Settings
                </Link>
                <hr className="m-0" />
                <Link
                  className="dropdown-item logout pb-0"
                  to="#"
                  onClick={handleLogout}
                >
                  <ImageWithBasePath
                    src="assets/img/icons/log-out.svg"
                    alt="img"
                    className="me-2"
                  />
                  Logout
                </Link>

              </div>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link onClick={handleLogout} className="logout-button" title="Logout">
            <FiLogOut size={24} />
          </Link>
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="profile">
              My Profile
            </Link>
            <Link className="dropdown-item" to="generalsettings">
              Settings
            </Link>
            <Link className="dropdown-item" to="signin">
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
