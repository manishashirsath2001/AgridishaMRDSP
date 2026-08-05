useEffect(() => {
    const addGoogleTranslate = () => {
        const existingScript = document.querySelector("script[src*='translate_a/element.js']");
        if (existingScript) return;

        const gtScript = document.createElement("script");
        gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        gtScript.async = true;
        document.body.appendChild(gtScript);
    };

    window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            { pageLanguage: "en", includedLanguages: "en,mr" },  // (optional)
            "google_translate_element"
        );
    };

    addGoogleTranslate();
}, []);
