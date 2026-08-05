import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../core/json/custom';
import { getUserData } from '../../Context/UserData';

const AutoLogout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const timeoutRef = useRef(null);
    const { userdetail } = getUserData();

    const logout = async (fromUnload = false) => {
        const uaid = localStorage.getItem('uaid');
        console.log(`🚪 Logging out ${fromUnload ? 'on tab/browser close' : 'due to inactivity or remote logout'}`, uaid);

        try {
            if (uaid) {
                await axios.post(`${baseUrl.Url}/api/SP_UpadateUserLogin`, {
                    uaid,
                    islogin: false,
                });
            }
        } catch (error) {
            console.error("❌ Logout API error:", error);
        }

        if (!fromUnload) {
            navigate('/signin');
        }
    };

    const resetTimer = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => logout(false), 20 * 60 * 1000); // 20 minutes
    };

    // useEffect(() => {
    //     const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    //     const isSigninPage = location.pathname === '/signin';

    //     const handleActivity = () => resetTimer();

    //     const handleKeyDown = (e) => {

    //         if (e.key === 'Escape') {
    //             console.log("Escape key pressed, logout will be blocked.");
    //             return;
    //         }

    //         resetTimer();
    //     };

    //     events.forEach(event => window.addEventListener(event, handleActivity));
    //     if (!isSigninPage) window.addEventListener('keydown', handleKeyDown);

    //     // Start inactivity timer
    //     resetTimer();

    //     // Heartbeat every 30s
    //     // const heartbeat = setInterval(() => {
    //     //     const uaid = localStorage.getItem('uaid');
    //     //     if (uaid) {
    //     //         axios.post(`${baseUrl.Url}/backend/api/UpdateHeartbeat`, {
    //     //             uaid,
    //     //             lastActivity: new Date().toISOString()
    //     //         }).catch(err => console.error("❌ Heartbeat error:", err));
    //     //     }
    //     // }, 30000);

    //     // Session check every 15s
    //     const sessionValidator = setInterval(() => {
    //         const uaid = localStorage.getItem('uaid');
    //         if (uaid) {
    //             axios.post(`${baseUrl.Url}api/GET_CheckUserSession`, { uaid })
    //                 .then(res => {
    //                     if (res.data[0]?.islogin === false) {
    //                         console.warn("⚠️ Session invalid — user logged in somewhere else.");
    //                         logout(false);
    //                     }
    //                 }).catch(console.error);
    //         }
    //     }, 15000);

    //     return () => {
    //         events.forEach(event => window.removeEventListener(event, handleActivity));
    //         window.removeEventListener('keydown', handleKeyDown);
    //         clearTimeout(timeoutRef.current);
    //         // clearInterval(heartbeat);
    //         clearInterval(sessionValidator);
    //     };
    // }, [location.pathname]);

    // useEffect(() => {
    //     let visibilityTimer = null;

    //     const handleLogout = async () => {
    //         const uaid = localStorage.getItem('uaid');
    //         if (uaid) {
    //             try {
    //                 await axios.post(`${baseUrl.Url}/backend/api/SP_UpadateUserLogin`, {
    //                     uaid,
    //                     islogin: false,
    //                 });
    //             } catch (error) {
    //                 console.error("❌ Logout on unload/visibility change failed:", error);
    //             }
    //         }
    //     };

    //     const handleBeforeUnload = (e) => {
    //         e.preventDefault();
    //         handleLogout();
    //     };

    //     // REMOVE or COMMENT OUT this section if you don't want to logout when user changes tabs
    //     const handleVisibilityChange = () => {
    //         if (document.visibilityState === 'hidden') {
    //             visibilityTimer = setTimeout(() => {
    //                 handleLogout();
    //             }, 10 * 60 * 1000);
    //         } else if (document.visibilityState === 'visible') {
    //             clearTimeout(visibilityTimer);
    //         }
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     // REMOVE this line as well
    //     document.addEventListener('visibilitychange', handleVisibilityChange);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //         // REMOVE this line as well
    //         document.removeEventListener('visibilitychange', handleVisibilityChange);
    //         clearTimeout(visibilityTimer);
    //     };
    // }, []);
    // Handle browser tab visibility change (minimized or hidden)
    useEffect(() => {
        let visibilityTimer = null;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                console.log("Tab is hidden or minimized. Starting 10 min logout timer.");
                visibilityTimer = setTimeout(() => {
                    console.log("10 minutes of inactivity. Logging out...");
                    logout(false);
                }, 10 * 60 * 1000); // 10 minutes
            } else if (document.visibilityState === 'visible') {
                clearTimeout(visibilityTimer);
                console.log("Tab is focused again. Resetting logout timer.");
                resetTimer();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(visibilityTimer);
        };
    }, []);



    useEffect(() => {
        let isReload = false;


        const handleKeydown = (e) => {
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                isReload = true;
            }
        };

        window.addEventListener('keydown', handleKeydown);

        const handleBeforeUnload = (e) => {
            const navEntries = performance.getEntriesByType("navigation");
            const isPageReload = navEntries[0]?.type === 'reload';

            if (isPageReload || isReload) {
                return;
            }

            const confirmationMessage = 'Are you sure you want to leave?';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        };


        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const handleUnload = () => {

            logout();
        };


        window.addEventListener('unload', handleUnload);


        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, []);


    useEffect(() => {
        if (location.pathname === "/signin") {
            const uaid = localStorage.getItem('uaid');
            if (uaid) {
                console.log("🔓 Navigated to /signin — logging out user");

                axios.post(`${baseUrl.Url}/api/SP_UpadateUserLogin`, {
                    uaid,
                    islogin: false,
                })
                    .then(() => {
                        console.log("✅ User forcefully logged out on /signin");
                        localStorage.removeItem('uaid'); // Optional: clear uaid
                    })
                    .catch((err) => {
                        console.error("❌ Logout failed on signin page access:", err);
                    });
            }
        }
    }, [location.pathname]);

    // useEffect(() => {
    //     const uaid = localStorage.getItem('uaid');
    //     if (!uaid) return;


    //     if (location.pathname === '/signin') return;

    //     axios.post(`${baseUrl.Url}/backend/api/GET_CheckUserSession`, { uaid })
    //         .then(res => {
    //             if (res.data[0]?.islogin === false) {
    //                 console.warn("⚠️ Session invalid — user logged in somewhere else.");
    //                 logout(false);
    //             } else {
    //                 console.log("✅ Session is valid after page refresh.");
    //             }
    //         }).catch(console.error);
    // }, [location.pathname]);
    useEffect(() => {
        const uaid = localStorage.getItem('uaid');
        if (!uaid || location.pathname === '/signin') return;

        const navigationEntries = performance.getEntriesByType("navigation");
        const isReload = navigationEntries[0]?.type === 'reload';

        if (isReload) {
            console.log("🔁 Page reloaded — marking user as logged in again on backend.");

            axios.post(`${baseUrl.Url}/api/SP_UpadateUserLogin`, {
                uaid,
                islogin: true,
            })
                .then(() => {
                    console.log("✅ Backend login status refreshed after reload.");
                })
                .catch((err) => {
                    console.error("❌ Failed to update islogin on reload:", err);
                });
        }
    }, []);

    return <>{children}</>;
};

export default AutoLogout;
