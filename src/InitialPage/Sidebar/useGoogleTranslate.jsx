import { useEffect, useState } from "react";

export const useGoogleTranslate = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const addScript = () => {
            const script = document.createElement("script");
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: "en,mr",  // Add any languages you want
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    "google_translate_element"
                );
                setIsLoaded(true);
            };
        };

        if (!window.google || !window.google.translate) {
            addScript();
        } else {
            setIsLoaded(true);
        }
    }, []);

    return isLoaded;
};
