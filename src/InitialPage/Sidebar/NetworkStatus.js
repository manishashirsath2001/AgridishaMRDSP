// NetworkStatus.js
import React, { useState, useEffect } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      width: "100%",
      backgroundColor: "red",
      color: "white",
      textAlign: "center",
      padding: "10px",
      zIndex: 9999,
    }}>
      ⚠️ नेटवर्क उपलब्ध नाही (Network Not Connected)
    </div>
  );
};

export default NetworkStatus;
