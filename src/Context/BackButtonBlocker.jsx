// src/components/BackButtonBlocker.jsx
import { useEffect } from "react";

const BackButtonBlocker = ({ children }) => {
    useEffect(() => {
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return children;
};

export default BackButtonBlocker;
