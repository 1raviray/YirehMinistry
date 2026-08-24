/* =========================================================
   YIREH MINISTRY
   PROFESSIONAL SCROLL ANIMATIONS
   GSAP + ScrollTrigger
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (typeof gsap === "undefined") {
        return;
    }

    if (typeof ScrollTrigger === "undefined") {
        return;
    }


    /* =====================================================
       REGISTER SCROLLTRIGGER
    ===================================================== */

    gsap.registerPlugin(ScrollTrigger);


    /* =====================================================
       GLOBAL GSAP CONFIG
    ===================================================== */

    gsap.config({
        nullTargetWarn: false
    });


    /* =====================================================
       COMMON SCROLL SETTINGS
    ===================================================== */

    const defaultScroll = {
        toggleActions: "play none play reverse",
        once: false
    };


    /* =====================================================
       HELPER
       Professional reveal animation
    ===================================================== */

    function reveal(
        elements,
        options = {}
    ) {

        const targets =
            gsap.utils.toArray(elements);

        if (!targets.length) {
            return;
        }


        gsap.from(
            targets,
            {
                opacity:
                    options.opacity ?? 0,

                y:
                    options.y ?? 50,

                x:
                    options.x ?? 0,

                scale:
                    options.scale ?? 1,

                filter:
                    options.filter ?? "blur(0px)",

                duration:
                    options.duration ?? 0.8,

                ease:
                    options.ease ??
                    "power3.out",

                stagger:
                    options.stagger ?? 0,

                scrollTrigger: {

                    trigger:
                        options.trigger ??
                        targets[0],

                    start:
                        options.start ??
                        "top %",

                    end:
                        options.end ??
                        "bottom 20%",

                    toggleActions:
                        options.toggleActions ??
                        defaultScroll.toggleActions,

                    once:
                        false
                }
            }
        );
    }


    /* =====================================================
       01. WHAT WE DO
    ===================================================== */

    const whatWeDo =
        document.querySelector(
            ".what-we-do-section"
        );


    if (whatWeDo) {

        /* -------------------------------------------------
           TITLE
        ------------------------------------------------- */

        reveal(
            whatWeDo.querySelector(
                ".what-we-do-title"
            ),
            {
                y: 55,

                duration: 0.8,

                start: "top 82%"
            }
        );


        /* -------------------------------------------------
           DESCRIPTION
        ------------------------------------------------- */

        reveal(
            whatWeDo.querySelector(
                ".what-we-do-description"
            ),
            {
                y: 30,

                duration: 0.7,

                start: "top 84%"
            }
        );


        /* -------------------------------------------------
           SERVICE ITEMS
        ------------------------------------------------- */

        reveal(
            whatWeDo.querySelectorAll(
                ".service-item"
            ),
            {
                y: 60,

                duration: 0.7,

                stagger: 0.16,

                start: "top 82%"
            }
        );


        /* -------------------------------------------------
           SERVICE IMAGES
        ------------------------------------------------- */

        const serviceImages =
            whatWeDo.querySelectorAll(
                ".service-image img"
            );


        if (serviceImages.length) {

            gsap.from(
                serviceImages,
                {
                    scale: 1.12,

                    duration: 1.1,

                    ease:
                        "power3.out",

                    stagger: 0.16,

                    scrollTrigger: {

                        trigger:
                            whatWeDo.querySelector(
                                ".services-list"
                            ),

                        start: "top 82%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           CTA
        ------------------------------------------------- */

        reveal(
            whatWeDo.querySelector(
                ".what-we-do-cta"
            ),
            {
                y: 35,

                scale: 0.96,

                duration: 0.7,

                start: "top 88%"
            }
        );
    }


    /* =====================================================
       02. ABOUT US
    ===================================================== */

    const about =
        document.querySelector(
            ".about-intro-section"
        );


    if (about) {

        /* -------------------------------------------------
           TITLE
        ------------------------------------------------- */

        reveal(
            about.querySelector(
                ".about-intro-title"
            ),
            {
                y: 65,

                duration: 0.9,

                start: "top 82%"
            }
        );


        /* -------------------------------------------------
           TEXT
        ------------------------------------------------- */

        reveal(
            about.querySelectorAll(
                ".about-intro-text"
            ),
            {
                y: 35,

                duration: 0.75,

                stagger: 0.12,

                start: "top 84%"
            }
        );


        /* -------------------------------------------------
           BUTTON
        ------------------------------------------------- */

        reveal(
            about.querySelector(
                ".about-intro-btn"
            ),
            {
                y: 25,

                scale: 0.96,

                duration: 0.7,

                start: "top 88%"
            }
        );
    }


    /* =====================================================
       03. EVENTS
    ===================================================== */

    const events =
        document.querySelector(
            ".home-events-section"
        );


    if (events) {

        /* -------------------------------------------------
           HEADING
        ------------------------------------------------- */

        reveal(
            events.querySelector(
                ".home-events-heading"
            ),
            {
                y: 50,

                duration: 0.8,

                start: "top 82%"
            }
        );


        /* -------------------------------------------------
           EVENT CARDS
        ------------------------------------------------- */

        reveal(
            events.querySelectorAll(
                ".home-event-card"
            ),
            {
                y: 65,

                scale: 0.97,

                duration: 0.8,

                stagger: 0.18,

                start: "top 80%"
            }
        );


        /* -------------------------------------------------
           EVENT CONTENT
        ------------------------------------------------- */

        const eventContent =
            events.querySelectorAll(
                ".home-event-content"
            );


        if (eventContent.length) {

            gsap.from(
                eventContent,
                {
                    opacity: 0,

                    y: 25,

                    duration: 0.7,

                    stagger: 0.18,

                    delay: 0.15,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: events,

                        start: "top 75%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           EXPLORE BUTTON
        ------------------------------------------------- */

        reveal(
            events.querySelector(
                ".home-events-explore"
            ),
            {
                y: 30,

                duration: 0.7,

                start: "top 88%"
            }
        );
    }


    /* =====================================================
       04. EVENTS TICKER
    ===================================================== */

    const ticker =
        document.querySelector(
            ".home-events-ticker"
        );


    if (ticker) {

        gsap.from(
            ticker,
            {
                opacity: 0,

                y: 30,

                duration: 0.7,

                ease:
                    "power3.out",

                scrollTrigger: {

                    trigger: ticker,

                    start: "top 90%",

                    toggleActions:
                        "play none play reverse",

                    once: false
                }
            }
        );
    }


    /* =====================================================
       05. ANTHEMS
    ===================================================== */

    const anthems =
        document.querySelector(
            ".anthems-hero-section"
        );


    if (anthems) {

        const left =
            anthems.querySelector(
                ".anthems-hero-left"
            );

        const right =
            anthems.querySelector(
                ".anthems-hero-right"
            );

        const button =
            anthems.querySelector(
                ".anthems-hero-button"
            );

        const line =
            anthems.querySelector(
                ".anthems-hero-bottom-line"
            );


        /* -------------------------------------------------
           LEFT CONTENT
        ------------------------------------------------- */

        if (left) {

            gsap.from(
                left,
                {
                    opacity: 0,

                    x: -70,

                    duration: 0.9,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: anthems,

                        start: "top 80%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           RIGHT CONTENT
        ------------------------------------------------- */

        if (right) {

            gsap.from(
                right,
                {
                    opacity: 0,

                    x: 70,

                    duration: 0.9,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: anthems,

                        start: "top 80%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           BUTTON
        ------------------------------------------------- */

        if (button) {

            gsap.from(
                button,
                {
                    opacity: 0,

                    y: 30,

                    scale: 0.95,

                    duration: 0.7,

                    ease:
                        "back.out(1.3)",

                    scrollTrigger: {

                        trigger: anthems,

                        start: "top 68%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           BOTTOM LINE
        ------------------------------------------------- */

        if (line) {

            gsap.fromTo(
                line,
                {
                    scaleX: 0,

                    transformOrigin:
                        "left center"
                },
                {
                    scaleX: 1,

                    duration: 1.1,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: line,

                        start: "top 90%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }
    }


    /* =====================================================
       06. SONGS
    ===================================================== */

    const songs =
        document.querySelector(
            ".home-songs-section"
        );


    if (songs) {

        /* -------------------------------------------------
           HEADING
        ------------------------------------------------- */

        reveal(
            songs.querySelector(
                ".home-songs-heading"
            ),
            {
                y: 50,

                duration: 0.8,

                start: "top 82%"
            }
        );


        /* -------------------------------------------------
           SONG CARDS
        ------------------------------------------------- */

        reveal(
            songs.querySelectorAll(
                ".home-song-card"
            ),
            {
                y: 65,

                duration: 0.75,

                stagger: 0.14,

                start: "top 82%"
            }
        );


        /* -------------------------------------------------
           SONG IMAGES
        ------------------------------------------------- */

        const songImages =
            songs.querySelectorAll(
                ".home-song-image"
            );


        if (songImages.length) {

            gsap.from(
                songImages,
                {
                    scale: 1.08,

                    duration: 1,

                    ease:
                        "power3.out",

                    stagger: 0.14,

                    scrollTrigger: {

                        trigger:
                            songs.querySelector(
                                ".home-songs-grid"
                            ),

                        start: "top 82%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           BUTTON
        ------------------------------------------------- */

        reveal(
            songs.querySelector(
                ".home-songs-button"
            ),
            {
                y: 30,

                scale: 0.96,

                duration: 0.7,

                start: "top 88%"
            }
        );
    }


    /* =====================================================
       07. PRAYER
    ===================================================== */

    const prayer =
        document.querySelector(
            ".prayer-cta-section"
        );


    if (prayer) {

        /* -------------------------------------------------
           LEFT HAND
        ------------------------------------------------- */

        const leftHand =
            prayer.querySelector(
                ".prayer-cta-hand-left"
            );


        if (leftHand) {

            gsap.from(
                leftHand,
                {
                    opacity: 0,

                    x: -100,

                    duration: 1,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: prayer,

                        start: "top 72%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           RIGHT HAND
        ------------------------------------------------- */

        const rightHand =
            prayer.querySelector(
                ".prayer-cta-hand-right"
            );


        if (rightHand) {

            gsap.from(
                rightHand,
                {
                    opacity: 0,

                    x: 100,

                    duration: 1,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: prayer,

                        start: "top 72%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           QUOTE ICON
        ------------------------------------------------- */

        reveal(
            prayer.querySelector(
                ".prayer-cta-quote"
            ),
            {
                y: 30,

                duration: 0.6,

                start: "top 78%"
            }
        );


        /* -------------------------------------------------
           TITLE
        ------------------------------------------------- */

        reveal(
            prayer.querySelector(
                ".prayer-cta-title"
            ),
            {
                y: 45,

                duration: 0.8,

                start: "top 80%"
            }
        );


        /* -------------------------------------------------
           DESCRIPTION
        ------------------------------------------------- */

        reveal(
            prayer.querySelector(
                ".prayer-cta-description"
            ),
            {
                y: 25,

                duration: 0.65,

                start: "top 84%"
            }
        );


        /* -------------------------------------------------
           BUTTON
        ------------------------------------------------- */

        reveal(
            prayer.querySelector(
                ".prayer-cta-button"
            ),
            {
                y: 25,

                scale: 0.95,

                duration: 0.7,

                start: "top 88%"
            }
        );
    }


    /* =====================================================
       08. CONTACT
    ===================================================== */

    const contact =
        document.querySelector(
            ".contact-cta-section"
        );


    if (contact) {

        /* -------------------------------------------------
           CARD
        ------------------------------------------------- */

        const card =
            contact.querySelector(
                ".contact-cta-card"
            );


        if (card) {

            gsap.from(
                card,
                {
                    opacity: 0,

                    y: 60,

                    scale: 0.98,

                    duration: 0.9,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: contact,

                        start: "top 80%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           LEFT CONTENT
        ------------------------------------------------- */

        const contactLeft =
            contact.querySelector(
                ".contact-cta-left"
            );


        if (contactLeft) {

            gsap.from(
                contactLeft,
                {
                    opacity: 0,

                    x: -50,

                    duration: 0.75,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: contact,

                        start: "top 75%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           DIVIDER
        ------------------------------------------------- */

        const divider =
            contact.querySelector(
                ".contact-divider"
            );


        if (divider) {

            gsap.fromTo(
                divider,
                {
                    scaleY: 0,

                    transformOrigin:
                        "top center"
                },
                {
                    scaleY: 1,

                    duration: 0.8,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: contact,

                        start: "top 72%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           RIGHT INFO
        ------------------------------------------------- */

        const contactItems =
            contact.querySelectorAll(
                ".contact-info-item"
            );


        if (contactItems.length) {

            gsap.from(
                contactItems,
                {
                    opacity: 0,

                    x: 50,

                    duration: 0.7,

                    stagger: 0.13,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: contact,

                        start: "top 78%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           WATERMARK
        ------------------------------------------------- */

        const watermark =
            contact.querySelector(
                ".contact-watermark"
            );


        if (watermark) {

            gsap.from(
                watermark,
                {
                    opacity: 0,

                    x: 80,

                    duration: 1,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: contact,

                        start: "top 82%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }
    }


    /* =====================================================
       09. FOOTER
    ===================================================== */

    const footer =
        document.querySelector(
            ".site-footer"
        );


    if (footer) {

        /* -------------------------------------------------
           BRAND
        ------------------------------------------------- */

        const brand =
            footer.querySelector(
                ".footer-brand"
            );


        if (brand) {

            gsap.from(
                brand,
                {
                    opacity: 0,

                    y: 40,

                    duration: 0.8,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: footer,

                        start: "top 84%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           FOOTER COLUMNS
        ------------------------------------------------- */

        const columns =
            footer.querySelectorAll(
                ".footer-column"
            );


        if (columns.length) {

            gsap.from(
                columns,
                {
                    opacity: 0,

                    y: 40,

                    duration: 0.7,

                    stagger: 0.12,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: footer,

                        start: "top 80%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           FOOTER DIVIDER
        ------------------------------------------------- */

        const divider =
            footer.querySelector(
                ".footer-divider"
            );


        if (divider) {

            gsap.fromTo(
                divider,
                {
                    scaleX: 0,

                    transformOrigin:
                        "left center"
                },
                {
                    scaleX: 1,

                    duration: 0.9,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: divider,

                        start: "top 92%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }


        /* -------------------------------------------------
           FOOTER BOTTOM
        ------------------------------------------------- */

        const footerBottom =
            footer.querySelector(
                ".footer-bottom"
            );


        if (footerBottom) {

            gsap.from(
                footerBottom,
                {
                    opacity: 0,

                    y: 20,

                    duration: 0.6,

                    ease:
                        "power3.out",

                    scrollTrigger: {

                        trigger: footerBottom,

                        start: "top 94%",

                        toggleActions:
                            "play none play reverse",

                        once: false
                    }
                }
            );
        }
    }


    /* =====================================================
       REFRESH AFTER PAGE LOAD
    ===================================================== */

    window.addEventListener(
        "load",
        function () {

            ScrollTrigger.refresh();

        }
    );


    /* =====================================================
       REFRESH AFTER RESIZE
    ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(
                    function () {

                        ScrollTrigger.refresh();

                    },
                    250
                );
        }
    );

})();