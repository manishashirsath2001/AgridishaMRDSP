import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { all_routes } from "../../Router/all_routes";
// import "../../style/scss/layout/_header"
import { getUserData, clearUserData } from "../../Context/UserData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut } from 'react-icons/fi';
import { useGoogleTranslate } from './useGoogleTranslate';



const Header = () => {
  const isTranslateLoaded = useGoogleTranslate();

  const { userdetail } = getUserData();
  const route = all_routes;
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };
  const isRestricted = userdetail?.LANGUAGE === "en";
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(isRestricted ? 'en' : 'mr');
  const waitForGoogleTranslateCombo = () => {
    return new Promise((resolve) => {
      const checkExist = setInterval(() => {
        const selectField = document.querySelector('.goog-te-combo');
        if (selectField) {
          clearInterval(checkExist);
          resolve(selectField);
        }
      }, 100);
    });
  };



  const waitForComboAndChangeLanguage = async (lang) => {
    setSelectedLanguage(lang);
    if (!isTranslateLoaded) {
      console.warn("Google Translate not yet ready");
      return;
    }

    const maxWait = 5000; // max wait 5 seconds
    const interval = 100;
    let waited = 0;

    const intervalId = setInterval(() => {
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        clearInterval(intervalId);
        selectField.value = lang;
        selectField.dispatchEvent(new Event('change'));
      }

      waited += interval;
      if (waited >= maxWait) {
        clearInterval(intervalId);
        console.error("❌ Failed to find Google Translate dropdown.");
      }
    }, interval);
  };

  function waitForIframe(callback, timeout = 5000) {
    const interval = 100;
    let waited = 0;

    const check = setInterval(() => {
      const frame = document.querySelector("iframe.goog-te-menu-frame");
      if (frame) {
        clearInterval(check);
        callback(frame);
      } else {
        waited += interval;
        if (waited >= timeout) {
          clearInterval(check);
          console.error("❌ Google Translate iframe not found.");
        }
      }
    }, interval);
  }



  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);

    waitForIframe((frame) => {
      const innerDoc = frame.contentDocument || frame.contentWindow.document;
      const langLinks = innerDoc.querySelectorAll("a.goog-te-menu2-item");

      langLinks.forEach(link => {
        if (lang === 'en' && link.innerText.includes('English')) {
          link.click();
        }
        if (lang === 'mr' && link.innerText.includes('Marathi')) {
          link.click();
        }
      });
    });
  };



  const getLanguageText = () => {
    switch (selectedLanguage) {
      case 'mr': return 'मराठी';
      case 'en':
      default: return 'English';
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
  const handleLogout = async () => {
    try {
      if (userdetail?.uaid) {
        await axios.post(`${baseUrl.Url}/api/SP_UpadateUserLogin`, {
          uaid: userdetail.uaid,
          islogin: false,
        }, {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
          }
        });
      }
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      clearUserData();
      localStorage.removeItem("uaid");
      navigate("/signin");
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
  function waitForTranslateCombo(callback) {
    const interval = setInterval(() => {
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        clearInterval(interval);
        callback(selectField);
      }
    }, 100); // check every 100ms
  }

  const doTranslation = (langText) => {
    const frame = document.querySelector("iframe.goog-te-menu-frame");
    if (!frame) {
      console.error("Google Translate iframe not loaded yet.");
      return;
    }
    const innerDoc = frame.contentDocument || frame.contentWindow.document;
    const langLinks = innerDoc.querySelectorAll("a.goog-te-menu2-item");
    for (let i = 0; i < langLinks.length; i++) {
      if (langLinks[i].innerText.includes(langText)) {
        langLinks[i].click();
        break;
      }
    }
  };

  return (
    <>
      <div className="header">
        {/* <div id="google_translate_element"></div> */}


        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link className="logo logo-normal" onClick={handleLogout}>
            <ImageWithBasePath src="assets/img/avatar/mrdbs1.png" alt="img" />
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
                backgroundColor: '#e3eef2',
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#2c3e50',
                fontWeight: '500',
                fontSize: '1rem',
              }}
            >
              <b style={{ color: '#3e5f68' }}>{isRestricted ? 'Date' : 'दिनांक'} : <span style={{ color: 'rgb(150, 70, 187) ' }}> {userdetail?.APPDT}</span> </b>
            </div>
          </li>
          <li
            className="nav-item"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-60%)',
              fontSize: '1.7rem',
              fontWeight: '500',
              fontFamily: "'Segoe Script', cursive",
              letterSpacing: '1px',
              userSelect: 'none',
              cursor: 'default',
              color: '#6D4C7B',
              textShadow: `
                  0.5px 0.5px 0 #fff,      
                  -0.5px -0.5px 0 #5A4A6B  
       `,
              whiteSpace: 'nowrap',
              padding: '4px 45px',
              borderRadius: '8px',
            }}

          >
            {userdetail?.departmentname}
          </li>
          {/* /Select Store */}

          {/* Flag */}
          <li className="nav-item dropdown has-arrow flag-nav">
            <Link
              data-bs-toggle="dropdown"
              to="#"
              role="button"
              className="nav-link dropdown-toggle"
            >
              <span style={{ fontWeight: 'bold', marginRight: '5px' }}>
                {getLanguageText()}
              </span>
              <ImageWithBasePath src="assets/img/flags/in.png" alt="Language" height={16} />
            </Link>

            <div className="dropdown-menu dropdown-menu-right p-2 shadow" style={{ minWidth: '160px', borderRadius: '10px' }}>
              <button
                onClick={() => {
                  handleLanguageChange('en');
                }}
                className={`btn btn-sm w-100 mb-2 ${selectedLanguage === 'en' ? 'btn-success' : 'btn-outline-success'}`}
              >
                English
              </button>
              <button
                onClick={() => {
                  handleLanguageChange('mr');
                }}
                className={`btn btn-sm w-100 ${selectedLanguage === 'mr' ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                मराठी
              </button>


            </div>
          </li>




          {/* /Flag */}
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
            <Link className="dropdown-item" to="#" onClick={handleLogout}>
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
