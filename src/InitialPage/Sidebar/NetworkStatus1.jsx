import React, { useState, useEffect } from "react";

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(true);

    const checkConnection = async () => {
        try {
            const response = await fetch("https://httpstat.us/204", { cache: "no-store" });
            setIsOnline(response.ok);
            console.log("Ping success:", response.ok);
        } catch (error) {
            console.log("Ping failed:", error);
            setIsOnline(false);
        }
    };

    useEffect(() => {
        window.addEventListener("online", checkConnection);
        window.addEventListener("offline", checkConnection);

        checkConnection(); // Initial check
        const interval = setInterval(checkConnection, 5000); // Every 1s

        return () => {
            window.removeEventListener("online", checkConnection);
            window.removeEventListener("offline", checkConnection);
            clearInterval(interval);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(240, 240, 240, 0.96)",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <img
                src="../../../public/assets/img/icons/network.jpg" // Use public folder path
                alt="No Internet"
                style={{
                    width: "90%",
                    maxWidth: "400px",
                    height: "auto",
                    marginBottom: "20px",
                }}
            />
            <h2 style={{ fontSize: "5vw", maxWidth: "90%", color: "#d9534f", marginBottom: "10px" }}>
                नेटवर्क उपलब्ध नाही
            </h2>
            <p style={{ fontSize: "4vw", maxWidth: "90%", color: "#333" }}>
                Cannot reach the site. Please check your internet connection and try again.
            </p>
        </div>
    );
};

export default NetworkStatus;
