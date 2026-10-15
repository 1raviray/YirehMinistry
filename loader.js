/* =========================================================
   YIREH MINISTRY
   FAST CINEMATIC INTRO LOADER

   FLOW:

   Background
       ↓
   Welcome To → fast fade + zoom in
       ↓
   Yireh Ministry → fast fade + zoom in
       ↓
   Center circle appears
       ↓
   Circle rapidly EXPANDS
       ↓
   Homepage revealed
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       LOADER
    ===================================================== */

    const loader =
        document.getElementById(
            "ymLoader"
        );

    const background =
        document.getElementById(
            "ymLoaderBackground"
        );

    const welcome =
        document.getElementById(
            "ymLoaderWelcome"
        );

    const title =
        document.getElementById(
            "ymLoaderTitle"
        );


    /* =====================================================
       HOMEPAGE ELEMENTS
    ===================================================== */

    const headerLogo =
        document.querySelector(
            ".site-header .logo"
        );

    const navLinks =
        document.querySelector(
            ".site-header .nav-links"
        );

    const homeBackground =
        document.querySelector(
            ".home-bg"
        );

    const homePromise =
        document.querySelector(
            ".home-promise"
        );

    const homeMessage =
        document.querySelector(
            ".home-message"
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
       FINISH
    ===================================================== */

    let finished = false;


    function finishIntro() {

        if (finished) {
            return;
        }

        finished = true;


        if (headerLogo) {

            headerLogo.style.opacity = "1";

        }


        if (navLinks) {

            navLinks.style.opacity = "1";

            navLinks.style.transform =
                "none";

        }


        if (homeBackground) {

            homeBackground.style.opacity =
                "0.4";

        }


        if (homePromise) {

            homePromise.style.opacity = "1";

            homePromise.style.transform =
                "none";

        }


        if (homeMessage) {

            homeMessage.style.opacity = "1";

            homeMessage.style.transform =
                "none";

        }


        if (homeHeading) {

            homeHeading.style.opacity = "1";

            homeHeading.style.transform =
                "none";

        }


        if (homeDescription) {

            homeDescription.style.opacity = "1";

            homeDescription.style.transform =
                "none";

        }


        if (homeFounders) {

            homeFounders.style.opacity = "1";

            homeFounders.style.transform =
                "none";

        }


        if (homeStoryButton) {

            homeStoryButton.style.opacity = "1";

            homeStoryButton.style.transform =
                "none";

        }


        if (homeForeground) {

            homeForeground.style.opacity = "1";

            homeForeground.style.transform =
                "none";

        }


        if (loader) {

            loader.remove();

        }


        document.documentElement.classList.remove(
            "ym-loading"
        );

        document.body.classList.remove(
            "ym-loading"
        );

    }


    /* =====================================================
       SAFETY
    ===================================================== */

    if (
        !loader ||
        !background ||
        !welcome ||
        !title
    ) {

        finishIntro();

        return;

    }


    /* =====================================================
       LOCK SCROLL
    ===================================================== */

    document.documentElement.classList.add(
        "ym-loading"
    );

    document.body.classList.add(
        "ym-loading"
    );


    /* =====================================================
       GSAP CHECK
    ===================================================== */

    if (
        typeof gsap === "undefined"
    ) {

        finishIntro();

        return;

    }


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        finishIntro();

        return;

    }


    /* =====================================================
       INITIAL STATES
    ===================================================== */

    gsap.set(
        loader,
        {
            "--reveal-radius": "0%"
        }
    );


    gsap.set(
        background,
        {
            scale: 1.08
        }
    );


    gsap.set(
        welcome,
        {
            opacity: 0,
            y: 24,
            scale: 0.82,
            filter: "blur(3px)"
        }
    );


    gsap.set(
        title,
        {
            opacity: 0,
            y: 30,
            scale: 0.80,
            filter: "blur(4px)"
        }
    );


    /* =====================================================
       MASTER TIMELINE
    ===================================================== */

    const tl =
        gsap.timeline();


    /* =====================================================
       1. BACKGROUND ZOOM-IN
    ===================================================== */

    tl.to(
        background,
        {
            scale: 1,

            duration: 1.65,

            ease:
                "power2.out"
        }
    );


    /* =====================================================
       2. WELCOME TO
       FAST FADE + ZOOM-IN
    ===================================================== */

    tl.to(
        welcome,
        {
            opacity: 1,

            y: 0,

            scale: 1,

            filter: "blur(0px)",

            duration: 0.38,

            ease:
                "power3.out"
        },
        "-=1.35"
    );


    /* =====================================================
       3. YIREH MINISTRY
       FAST FADE + ZOOM-IN
    ===================================================== */

    tl.to(
        title,
        {
            opacity: 1,

            y: 0,

            scale: 1,

            filter: "blur(0px)",

            duration: 0.42,

            ease:
                "power3.out"
        },
        "-=0.20"
    );


    /* =====================================================
       4. VERY SHORT HOLD
    ===================================================== */

    tl.to(
        {},
        {
            duration: 0.15
        }
    );


    /* =====================================================
       5. TEXT QUICK EXIT
    ===================================================== */

    tl.to(
        welcome,
        {
            opacity: 0,

            y: -10,

            scale: 1.02,

            duration: 0.18,

            ease:
                "power2.in"
        }
    );


    tl.to(
        title,
        {
            opacity: 0,

            y: -12,

            scale: 1.03,

            duration: 0.20,

            ease:
                "power2.in"
        },
        "<0.02"
    );


    /* =====================================================
       6. PREPARE HOMEPAGE
       Homepage is already underneath the loader.
    ===================================================== */

    tl.set(
        [
            homeBackground,
            homePromise,
            homeMessage,
            homeHeading,
            homeDescription,
            homeFounders,
            homeStoryButton,
            homeForeground
        ].filter(Boolean),
        {
            opacity: 1,

            y: 0,

            x: 0
        }
    );


    /* =====================================================
       7. CENTER CIRCLE → RAPID ZOOM IN

       IMPORTANT:

       This is NOT a shrinking loader.

       A transparent circular hole starts
       in the CENTER and EXPANDS outward.

       0% → small hole
       50% → large hole
       100%+ → full screen reveal
    ===================================================== */

    tl.to(
        loader,
        {
            "--reveal-radius": "160%",

            duration: 0.72,

            ease:
                "power4.inOut"
        },
        "-=0.02"
    );


    /* =====================================================
       8. REVEAL HOMEPAGE
    ===================================================== */

    if (homeBackground) {

        tl.to(
            homeBackground,
            {
                opacity: 0.4,

                duration: 0.35,

                ease:
                    "power2.out"
            },
            "<0.35"
        );

    }


    if (homeForeground) {

        tl.to(
            homeForeground,
            {
                opacity: 1,

                duration: 0.3,

                ease:
                    "power2.out"
            },
            "<"
        );

    }


    /* =====================================================
       9. HEADER
    ===================================================== */

    if (headerLogo) {

        tl.to(
            headerLogo,
            {
                opacity: 1,

                duration: 0.22,

                ease:
                    "power2.out"
            },
            "<0.10"
        );

    }


    if (navLinks) {

        tl.to(
            navLinks,
            {
                opacity: 1,

                y: 0,

                duration: 0.25,

                ease:
                    "power3.out"
            },
            "<0.04"
        );

    }


    /* =====================================================
       10. HOMEPAGE CONTENT
    ===================================================== */

    if (homePromise) {

        tl.to(
            homePromise,
            {
                opacity: 1,

                y: 0,

                duration: 0.25,

                ease:
                    "power3.out"
            },
            "<0.03"
        );

    }


    if (homeMessage) {

        tl.set(
            homeMessage,
            {
                opacity: 1,

                y: 0
            }
        );

    }


    if (homeHeading) {

        tl.to(
            homeHeading,
            {
                opacity: 1,

                y: 0,

                duration: 0.25,

                ease:
                    "power3.out"
            },
            "<0.02"
        );

    }


    if (homeDescription) {

        tl.to(
            homeDescription,
            {
                opacity: 1,

                y: 0,

                duration: 0.25,

                ease:
                    "power3.out"
            },
            "<0.02"
        );

    }


    if (homeFounders) {

        tl.to(
            homeFounders,
            {
                opacity: 1,

                y: 0,

                duration: 0.22,

                ease:
                    "power3.out"
            },
            "<0.02"
        );

    }


    if (homeStoryButton) {

        tl.to(
            homeStoryButton,
            {
                opacity: 1,

                y: 0,

                duration: 0.25,

                ease:
                    "power3.out"
            },
            "<0.02"
        );

    }


    /* =====================================================
       11. FINISH
    ===================================================== */

    tl.call(
        finishIntro
    );


    /* =====================================================
       EMERGENCY FALLBACK
    ===================================================== */

    setTimeout(
        finishIntro,
        5000
    );


})();