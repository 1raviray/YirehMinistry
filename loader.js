/* =========================================================
   YIREH MINISTRY — CINEMATIC INTRO LOADER

   DESIGN:
   1. Dark grayscale background
   2. Orange Y logo at the top
   3. "Welcome to" fades up
   4. "Yireh Ministry" fades up
   5. Short hold
   6. Text fades out
   7. Center circle expands outward
   8. Homepage is revealed

   TEXT ANIMATION:
   Simple fade-up only.
   No zoom, no blur, no character animation.
========================================================= */

(function () {
    "use strict";


    /* =====================================================
       1. LOADER ELEMENTS
    ===================================================== */

    const loader = document.getElementById("ymLoader");

    const background = document.getElementById(
        "ymLoaderBackground"
    );

    const welcome = document.getElementById(
        "ymLoaderWelcome"
    );

    const title = document.getElementById(
        "ymLoaderTitle"
    );


    /* =====================================================
       2. HOMEPAGE ELEMENTS
    ===================================================== */

    const headerLogo = document.querySelector(
        ".site-header .logo"
    );

    const navLinks = document.querySelector(
        ".site-header .nav-links"
    );

    const homeBackground = document.querySelector(
        ".home-bg"
    );

    const homePromise = document.querySelector(
        ".home-promise"
    );

    const homeMessage = document.querySelector(
        ".home-message"
    );

    const homeHeading = document.querySelector(
        ".home-message h1"
    );

    const homeDescription = document.querySelector(
        ".home-description"
    );

    const homeFounders = document.querySelector(
        ".home-founders"
    );

    const homeStoryButton = document.querySelector(
        ".home-story-btn"
    );

    const homeForeground = document.querySelector(
        ".home-foreground"
    );

    const homeHeroCarousel = document.querySelector(
        ".ymhc-hero"
    );


    /* =====================================================
       3. FINISH INTRO
    ===================================================== */

    let finished = false;
    let emergencyTimer = null;
    let introTimeline = null;


    function finishIntro() {

        if (finished) {
            return;
        }

        finished = true;


        /* Clear emergency fallback */

        if (emergencyTimer !== null) {
            clearTimeout(emergencyTimer);
            emergencyTimer = null;
        }


        /* Reveal header logo */

        if (headerLogo) {
            headerLogo.style.opacity = "1";
            headerLogo.style.transform = "none";
        }


        /* Reveal navigation */

        if (navLinks) {
            navLinks.style.opacity = "1";
            navLinks.style.transform = "none";
        }


        /* Original homepage background */

        if (homeBackground) {
            homeBackground.style.opacity = "0.4";
            homeBackground.style.transform = "none";
        }


        /* Original homepage content */

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


        /* New homepage hero carousel */

        if (homeHeroCarousel) {
            homeHeroCarousel.style.opacity = "1";
        }


        /* Remove loader */

        if (loader) {
            loader.remove();
        }


        /* Restore scrolling */

        document.documentElement.classList.remove(
            "ym-loading"
        );

        document.body.classList.remove(
            "ym-loading"
        );
        /* Notify the hero carousel that the loader has finished */
document.dispatchEvent(
    new Event("ym:intro-finished")
);
    }


    /* =====================================================
       4. SAFETY CHECK
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
       5. LOCK SCROLL DURING INTRO
    ===================================================== */

    document.documentElement.classList.add(
        "ym-loading"
    );

    document.body.classList.add(
        "ym-loading"
    );


    /* =====================================================
       6. GSAP AVAILABILITY
    ===================================================== */

    if (typeof gsap === "undefined") {
        finishIntro();
        return;
    }


    /* =====================================================
       7. REDUCED MOTION SUPPORT
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
       8. INITIAL STATES

       Background: static
       Welcome: invisible and slightly below
       Title: invisible and slightly below

       No scale animation.
       No blur animation.
    ===================================================== */

    gsap.set(loader, {
        "--reveal-radius": "0%"
    });


    gsap.set(background, {
        scale: 1
    });


    gsap.set(welcome, {
        opacity: 0,
        y: 22,
        scale: 1,
        filter: "blur(0px)"
    });


    gsap.set(title, {
        opacity: 0,
        y: 26,
        scale: 1,
        filter: "blur(0px)"
    });


    /* =====================================================
       9. MASTER TIMELINE
    ===================================================== */

    introTimeline = gsap.timeline({
        defaults: {
            overwrite: "auto"
        }
    });


    /* =====================================================
       10. WELCOME TO — SIMPLE FADE-UP
    ===================================================== */

    introTimeline.to(welcome, {
        opacity: 1,
        y: 0,

        duration: 0.75,

        ease: "power2.out"
    });


    /* =====================================================
       11. YIREH MINISTRY — SIMPLE FADE-UP
    ===================================================== */

    introTimeline.to(title, {
        opacity: 1,
        y: 0,

        duration: 0.85,

        ease: "power2.out"
    }, "-=0.16");


    /* =====================================================
       12. SHORT HOLD

       Keep the text visible briefly.
       No long delay.
    ===================================================== */

    introTimeline.to({}, {
        duration: 0.65
    });


    /* =====================================================
       13. TEXT FADES OUT

       Fade only.
       No zoom-out.
       No upward exit movement.
    ===================================================== */

    introTimeline.to(welcome, {
        opacity: 0,

        duration: 0.30,

        ease: "power1.out"
    });


    introTimeline.to(title, {
        opacity: 0,

        duration: 1.25,

        ease: "power1.out"
    }, "<");


    /* =====================================================
       14. PREPARE HOMEPAGE CONTENT

       The homepage remains underneath the loader.
       Make original homepage elements visible before
       the circular mask reveals them.
    ===================================================== */

    const homepageElements = [
        homeBackground,
        homePromise,
        homeMessage,
        homeHeading,
        homeDescription,
        homeFounders,
        homeStoryButton,
        homeForeground
    ].filter(Boolean);


    if (homepageElements.length) {
        introTimeline.set(homepageElements, {
            opacity: 1,
            y: 0,
            x: 0
        });
    }


    /* =====================================================
       15. CENTER CIRCLE REVEAL

       The transparent circular area starts small
       in the center and expands outward.

       The loader does not shrink.
       The circle reveals the homepage underneath.
    ===================================================== */

    introTimeline.to(loader, {
        "--reveal-radius": "160%",

        duration: 0.72,

        ease: "power3.inOut"
    }, "-=0.02");


    /* =====================================================
       16. ORIGINAL HOMEPAGE BACKGROUND
    ===================================================== */

    if (homeBackground) {
        introTimeline.to(homeBackground, {
            opacity: 0.4,

            duration: 0.35,

            ease: "power2.out"
        }, "<0.35");
    }


    /* =====================================================
       17. ORIGINAL FOREGROUND IMAGE
    ===================================================== */

    if (homeForeground) {
        introTimeline.to(homeForeground, {
            opacity: 1,

            duration: 0.30,

            ease: "power2.out"
        }, "<");
    }


    /* =====================================================
       18. HEADER LOGO
    ===================================================== */

    if (headerLogo) {
        introTimeline.to(headerLogo, {
            opacity: 1,
            y: 0,

            duration: 0.22,

            ease: "power2.out"
        }, "<0.10");
    }


    /* =====================================================
       19. NAVIGATION
    ===================================================== */

    if (navLinks) {
        introTimeline.to(navLinks, {
            opacity: 1,
            y: 0,

            duration: 0.25,

            ease: "power2.out"
        }, "<0.04");
    }


    /* =====================================================
       20. HOMEPAGE PROMISE
    ===================================================== */

    if (homePromise) {
        introTimeline.to(homePromise, {
            opacity: 1,
            y: 0,

            duration: 0.25,

            ease: "power2.out"
        }, "<0.03");
    }


    /* =====================================================
       21. HOMEPAGE HEADING
    ===================================================== */

    if (homeHeading) {
        introTimeline.to(homeHeading, {
            opacity: 1,
            y: 0,

            duration: 0.25,

            ease: "power2.out"
        }, "<0.02");
    }


    /* =====================================================
       22. HOMEPAGE DESCRIPTION
    ===================================================== */

    if (homeDescription) {
        introTimeline.to(homeDescription, {
            opacity: 1,
            y: 0,

            duration: 0.25,

            ease: "power2.out"
        }, "<0.02");
    }


    /* =====================================================
       23. FOUNDERS TEXT
    ===================================================== */

    if (homeFounders) {
        introTimeline.to(homeFounders, {
            opacity: 1,
            y: 0,

            duration: 0.22,

            ease: "power2.out"
        }, "<0.02");
    }


    /* =====================================================
       24. STORY BUTTON
    ===================================================== */

    if (homeStoryButton) {
        introTimeline.to(homeStoryButton, {
            opacity: 1,
            y: 0,

            duration: 0.25,

            ease: "power2.out"
        }, "<0.02");
    }


    /* =====================================================
       25. FINISH INTRO
    ===================================================== */

    introTimeline.call(finishIntro);


    /* =====================================================
       26. EMERGENCY FALLBACK

       If animation fails or gets interrupted,
       the website will still become usable.
    ===================================================== */

    emergencyTimer = window.setTimeout(function () {
        finishIntro();
    }, 7000);


})();