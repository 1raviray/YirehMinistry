/* =========================================================
   YIREH MINISTRY
   GSAP CINEMATIC INTRO LOADER
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       LOADER ELEMENTS
    ===================================================== */

    const loader =
        document.getElementById("ymLoader");

    const mountains =
        document.querySelector(
            ".ym-loader-mountains img"
        );

    const homeBackground =
        document.querySelector(
            ".home-bg"
        );

    const wash =
        document.querySelector(
            ".ym-loader-wash"
        );

    const loaderLogo =
        document.querySelector(
            ".ym-loader-logo"
        );

    const loaderLogoImage =
        document.getElementById(
            "ymLoaderLogoImage"
        );

    const welcome =
        document.getElementById(
            "ymLoaderWelcome"
        );

    const title =
        document.getElementById(
            "ymLoaderTitle"
        );

    const headerLogo =
        document.querySelector(
            ".site-header .logo"
        );


    /* =====================================================
       HOMEPAGE ELEMENTS
    ===================================================== */

    const navLinks =
        document.querySelector(
            ".site-header .nav-links"
        );

    const homeMessage =
        document.querySelector(
            ".home-message"
        );

    const homePromise =
        document.querySelector(
            ".home-promise"
        );

    const homeHeading =
        document.querySelector(
            ".home-message h1"
        );

    const homeDescription =
        document.querySelector(
            ".home-description"
        );

    const homeFounders =
        document.querySelector(
            ".home-founders"
        );

    const homeStoryButton =
        document.querySelector(
            ".home-story-btn"
        );

    const homeForeground =
        document.querySelector(
            ".home-foreground"
        );


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (
        !loader ||
        !mountains ||
        !wash ||
        !loaderLogo ||
        !loaderLogoImage ||
        !welcome ||
        !title
    ) {

        if (headerLogo) {
            headerLogo.style.opacity = "1";
        }

        if (navLinks) {
            navLinks.style.opacity = "1";
            navLinks.style.transform = "none";
        }

        if (homeBackground) {
            homeBackground.style.opacity = "0.4";
        }

        if (homePromise) {
            homePromise.style.opacity = "1";
            homePromise.style.transform = "none";
        }

        if (homeMessage) {
            homeMessage.style.opacity = "1";
            homeMessage.style.transform = "none";
        }

        if (homeHeading) {
            homeHeading.style.opacity = "1";
            homeHeading.style.transform = "none";
        }

        if (homeDescription) {
            homeDescription.style.opacity = "1";
            homeDescription.style.transform = "none";
        }

        if (homeFounders) {
            homeFounders.style.opacity = "1";
            homeFounders.style.transform = "none";
        }

        if (homeStoryButton) {
            homeStoryButton.style.opacity = "1";
            homeStoryButton.style.transform = "none";
        }

        if (homeForeground) {
            homeForeground.style.opacity = "1";
            homeForeground.style.transform = "none";
        }

        return;
    }


    /* =====================================================
       LOCK PAGE SCROLL
    ===================================================== */

    document.documentElement.classList.add(
        "ym-loading"
    );

    document.body.classList.add(
        "ym-loading"
    );


    /* =====================================================
       FALLBACK
    ===================================================== */

    let introFinished = false;


    function finishImmediately() {

        if (introFinished) {
            return;
        }

        introFinished = true;


        /* Header */

        if (headerLogo) {
            headerLogo.style.opacity = "1";
        }

        if (navLinks) {
            navLinks.style.opacity = "1";
            navLinks.style.transform = "none";
        }


        /* Homepage mountain */

        if (homeBackground) {
            homeBackground.style.opacity = "0.4";
        }


        /* Home promise */

        if (homePromise) {
            homePromise.style.opacity = "1";
            homePromise.style.transform = "none";
        }


        /* Home message */

        if (homeMessage) {
            homeMessage.style.opacity = "1";
            homeMessage.style.transform = "none";
        }


        /* Heading */

        if (homeHeading) {
            homeHeading.style.opacity = "1";
            homeHeading.style.transform = "none";
        }


        /* Description */

        if (homeDescription) {
            homeDescription.style.opacity = "1";
            homeDescription.style.transform = "none";
        }


        /* Founders */

        if (homeFounders) {
            homeFounders.style.opacity = "1";
            homeFounders.style.transform = "none";
        }


        /* Story button */

        if (homeStoryButton) {
            homeStoryButton.style.opacity = "1";
            homeStoryButton.style.transform = "none";
        }


        /* Foreground */

        if (homeForeground) {
            homeForeground.style.opacity = "1";
            homeForeground.style.transform = "none";
        }


        /* Remove loader */

        loader.remove();


        /* Unlock */

        document.documentElement
            .classList
            .remove("ym-loading");

        document.body
            .classList
            .remove("ym-loading");
    }


    const emergencyTimer =
        setTimeout(
            finishImmediately,
            8000
        );


    /* =====================================================
       GSAP CHECK
    ===================================================== */

    if (
        typeof gsap === "undefined"
    ) {

        clearTimeout(
            emergencyTimer
        );

        finishImmediately();

        return;
    }


    /* =====================================================
       SPLIT TEXT
       Each character zooms OUT.
    ===================================================== */

    function splitText(element) {

        const text =
            element.textContent.trim();

        element.innerHTML = "";


        [...text].forEach(
            (character) => {

                const span =
                    document.createElement(
                        "span"
                    );


                if (
                    character === " "
                ) {

                    span.className =
                        "ym-loader-space";

                    span.innerHTML =
                        "&nbsp;";

                } else {

                    span.textContent =
                        character;
                }


                element.appendChild(
                    span
                );
            }
        );


        return element.querySelectorAll(
            "span:not(.ym-loader-space)"
        );
    }


    const welcomeLetters =
        splitText(welcome);


    const titleLetters =
        splitText(title);


    /* =====================================================
       INITIAL LOADER STATES
    ===================================================== */

    /* Loader mountain */

    gsap.set(
        mountains,
        {
            y: 1000,
            opacity: 1
        }
    );


    /* Homepage mountain */

    gsap.set(
        homeBackground,
        {
            opacity: 0
        }
    );


    /* White wash */

    gsap.set(
        wash,
        {
            y: -1000,
            opacity: 1
        }
    );


    /* Loader logo */

    gsap.set(
        loaderLogo,
        {
            opacity: 0,
            scale: 0.84
        }
    );


    /* Loader logo image */

    gsap.set(
        loaderLogoImage,
        {
            opacity: 0,
            scale: 0.75,

            filter:
                "drop-shadow(0 0 0 rgba(245,102,34,0))"
        }
    );


    /* Welcome letters */

    gsap.set(
        welcomeLetters,
        {
            opacity: 0,

            scale: 2.5,

            transformOrigin:
                "center center",

            filter:
                "blur(7px)"
        }
    );


    /* Yireh Ministry letters */

    gsap.set(
        titleLetters,
        {
            opacity: 0,

            scale: 2.5,

            transformOrigin:
                "center center",

            filter:
                "blur(8px)"
        }
    );


    /* =====================================================
       MASTER TIMELINE
    ===================================================== */

    const tl =
        gsap.timeline();


    /* =====================================================
       1. MOUNTAINS DROP
    ===================================================== */

    tl.to(
        mountains,
        {
            y: 0,

            duration: 0.95,

            ease:
                "power4.out"
        }
    );


    /* =====================================================
       2. WHITE LAYER
    ===================================================== */

    tl.to(
        wash,
        {
            y: 0,

            duration: 0.55,

            ease:
                "power3.out"
        },
        "-=0.25"
    );


    /* =====================================================
       3. LOGO APPEARS
    ===================================================== */

    tl.to(
        loaderLogo,
        {
            opacity: 1,

            scale: 1,

            duration: 0.5,

            ease:
                "back.out(1.5)"
        },
        "-=0.1"
    );


    /* =====================================================
       4. LOGO IMAGE
    ===================================================== */

    tl.to(
        loaderLogoImage,
        {
            opacity: 1,

            scale: 1,

            duration: 0.45,

            ease:
                "power3.out"
        },
        "-=0.3"
    );


    /* =====================================================
       5. WELCOME TO
       EACH LETTER ZOOMS OUT
    ===================================================== */

    tl.to(
        welcomeLetters,
        {
            opacity: 1,

            scale: 1,

            filter:
                "blur(0px)",

            duration: 0.55,

            stagger: {
                each: 0.035,

                from: "center"
            },

            ease:
                "power3.out"
        },
        "+=0.05"
    );


    /* =====================================================
       6. YIREH MINISTRY
       EACH LETTER ZOOMS OUT
    ===================================================== */

    tl.to(
        titleLetters,
        {
            opacity: 1,

            scale: 1,

            filter:
                "blur(0px)",

            duration: 0.6,

            stagger: {
                each: 0.04,

                from: "center"
            },

            ease:
                "power3.out"
        },
        "-=0.12"
    );


    /* =====================================================
       7. SHORT HOLD
    ===================================================== */

    tl.to(
        {},
        {
            duration: 0.35
        }
    );


    /* =====================================================
       8. CALCULATE LOGO TRAVEL
    ===================================================== */

    const loaderRect =
        loaderLogo.getBoundingClientRect();


    const headerRect =
        headerLogo
            ? headerLogo.getBoundingClientRect()
            : null;


    let moveX = 0;

    let moveY = 0;

    let targetScale = 0.35;


    if (headerRect) {

        const loaderCenterX =
            loaderRect.left +
            loaderRect.width / 2;


        const loaderCenterY =
            loaderRect.top +
            loaderRect.height / 2;


        /*
           Target circular Y portion
           of the header logo.
        */

        const targetX =
            headerRect.left +
            headerRect.height / 2;


        const targetY =
            headerRect.top +
            headerRect.height / 2;


        moveX =
            targetX -
            loaderCenterX;


        moveY =
            targetY -
            loaderCenterY;


        targetScale =
            headerRect.height /
            loaderRect.width;
    }


    /* =====================================================
       9. REMOVE LOADER MOUNTAIN
    ===================================================== */

    tl.to(
        mountains,
        {
            opacity: 0,

            duration: 0.32,

            ease:
                "power2.inOut"
        }
    );


    /* =====================================================
       10. REMOVE WHITE LAYER
    ===================================================== */

    tl.to(
        wash,
        {
            opacity: 0,

            duration: 0.32,

            ease:
                "power2.inOut"
        },
        "<"
    );


    /* =====================================================
       11. REMOVE LOADER TEXT
    ===================================================== */

    tl.to(
        welcome,
        {
            opacity: 0,

            duration: 0.25,

            ease:
                "power2.inOut"
        },
        "<"
    );


    tl.to(
        title,
        {
            opacity: 0,

            duration: 0.25,

            ease:
                "power2.inOut"
        },
        "<"
    );


    /* =====================================================
       12. CLEAR LOADER BACKGROUND
    ===================================================== */

    tl.to(
        loader,
        {
            backgroundColor:
                "rgba(237,237,237,0)",

            duration: 0.3,

            ease:
                "power2.out"
        },
        "-=0.15"
    );


    /* =====================================================
       13. LOGO TRAVELS TO HEADER
    ===================================================== */

    tl.to(
        loaderLogo,
        {
            x: moveX,

            y: moveY,

            scale: targetScale,

            duration: 0.85,

            ease:
                "power3.inOut"
        },
        "-=0.05"
    );


    /* =====================================================
       14. SHOW HEADER LOGO
    ===================================================== */

    if (headerLogo) {

        tl.to(
            headerLogo,
            {
                opacity: 1,

                duration: 0.3,

                ease:
                    "power2.out"
            }
        );
    }


    /* =====================================================
       15. SHOW HOMEPAGE MOUNTAIN
       AND FOREGROUND TOGETHER
    ===================================================== */

    if (homeBackground) {

        tl.to(
            homeBackground,
            {
                opacity: 0.4,

                duration: 0.45,

                ease:
                    "power2.out"
            }
        );
    }


    /*
       Foreground has NO movement animation.
       It simply becomes visible with the homepage mountain.
    */

    if (homeForeground) {

        tl.to(
            homeForeground,
            {
                opacity: 1,

                duration: 0.45,

                ease:
                    "power2.out"
            },
            "<"
        );
    }


    /* =====================================================
       16. HEADER NAVIGATION
    ===================================================== */

    if (navLinks) {

        tl.to(
            navLinks,
            {
                opacity: 1,

                y: 0,

                duration: 0.35,

                ease:
                    "power3.out"
            },
            "+=0.05"
        );
    }


    /* =====================================================
       17. HOME PROMISE
    ===================================================== */

    if (homePromise) {

        tl.to(
            homePromise,
            {
                opacity: 1,

                y: 0,

                duration: 0.45,

                ease:
                    "power3.out"
            },
            "+=0.05"
        );
    }


    /* =====================================================
       18. HOME MESSAGE CONTAINER
       Instant visibility — no extra lag.
    ===================================================== */

    if (homeMessage) {

        tl.set(
            homeMessage,
            {
                opacity: 1,

                y: 0
            }
        );
    }


    /* =====================================================
       19. HERO HEADING
    ===================================================== */

    if (homeHeading) {

        tl.to(
            homeHeading,
            {
                opacity: 1,

                y: 0,

                duration: 0.4,

                ease:
                    "power3.out"
            },
            "+=0.03"
        );
    }


    /* =====================================================
       20. DESCRIPTION
    ===================================================== */

    if (homeDescription) {

        tl.to(
            homeDescription,
            {
                opacity: 1,

                y: 0,

                duration: 0.45,

                ease:
                    "power3.out"
            },
            "+=0.04"
        );
    }


    /* =====================================================
       21. FOUNDERS
    ===================================================== */

    if (homeFounders) {

        tl.to(
            homeFounders,
            {
                opacity: 1,

                y: 0,

                duration: 0.35,

                ease:
                    "power3.out"
            },
            "+=0.04"
        );
    }


    /* =====================================================
       22. STORY BUTTON
    ===================================================== */

    if (homeStoryButton) {

        tl.to(
            homeStoryButton,
            {
                opacity: 1,

                y: 0,

                duration: 0.4,

                ease:
                    "back.out(1.25)"
            },
            "+=0.04"
        );
    }


    /* =====================================================
       23. HIDE TRAVELING LOADER LOGO
    ===================================================== */

    tl.to(
        loaderLogo,
        {
            opacity: 0,

            duration: 0.2,

            ease:
                "power2.out"
        },
        "-=0.10"
    );


    /* =====================================================
       24. FINAL LOADER DISSOLVE
    ===================================================== */

    tl.to(
        loader,
        {
            opacity: 0,

            filter:
                "blur(7px)",

            duration: 0.45,

            ease:
                "power2.inOut",

            onComplete: () => {

                clearTimeout(
                    emergencyTimer
                );

                introFinished = true;


                /* Header */

                if (headerLogo) {
                    headerLogo.style.opacity = "1";
                }

                if (navLinks) {
                    navLinks.style.opacity = "1";
                    navLinks.style.transform = "none";
                }


                /* Homepage mountain */

                if (homeBackground) {
                    homeBackground.style.opacity = "0.4";
                }


                /* Promise */

                if (homePromise) {
                    homePromise.style.opacity = "1";
                    homePromise.style.transform = "none";
                }


                /* Message */

                if (homeMessage) {
                    homeMessage.style.opacity = "1";
                    homeMessage.style.transform = "none";
                }


                /* Heading */

                if (homeHeading) {
                    homeHeading.style.opacity = "1";
                    homeHeading.style.transform = "none";
                }


                /* Description */

                if (homeDescription) {
                    homeDescription.style.opacity = "1";
                    homeDescription.style.transform = "none";
                }


                /* Founders */

                if (homeFounders) {
                    homeFounders.style.opacity = "1";
                    homeFounders.style.transform = "none";
                }


                /* Story button */

                if (homeStoryButton) {
                    homeStoryButton.style.opacity = "1";
                    homeStoryButton.style.transform = "none";
                }


                /* Foreground */

                if (homeForeground) {
                    homeForeground.style.opacity = "1";
                    homeForeground.style.transform = "none";
                }


                /* Remove loader */

                loader.remove();


                /* Unlock page */

                document.documentElement
                    .classList
                    .remove("ym-loading");

                document.body
                    .classList
                    .remove("ym-loading");
            }
        }
    );

})();