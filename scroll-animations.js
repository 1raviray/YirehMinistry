/* =========================================================
   YIREH MINISTRY
   HOME PAGE SCROLL ANIMATIONS

   CSS + IntersectionObserver
   NO GSAP
   NO ScrollTrigger
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       OBSERVER CHECK
    ===================================================== */

    if (
        typeof IntersectionObserver ===
        "undefined"
    ) {

        revealAll();

        return;
    }


    /* =====================================================
       OBSERVER
    ===================================================== */

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        const element =
                            entry.target;


                        if (
                            entry.isIntersecting
                        ) {

                            element.classList.add(
                                "is-visible"
                            );

                        } else {

                            element.classList.remove(
                                "is-visible"
                            );
                        }

                    }
                );

            },
            {

                threshold:
                    0.12,

                rootMargin:
                    "0px 0px -8% 0px"

            }
        );


    /* =====================================================
       HELPERS
    ===================================================== */

    function observe(
        element,
        animationClass
    ) {

        if (!element) {
            return;
        }


        element.classList.add(
            animationClass
        );


        observer.observe(
            element
        );
    }


    function observeGroup(
        elements,
        animationClass
    ) {

        if (
            !elements ||
            !elements.length
        ) {

            return;
        }


        elements.forEach(
            function (
                element,
                index
            ) {

                element.classList.add(
                    animationClass
                );


                element.classList.add(
                    `home-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observer.observe(
                    element
                );

            }
        );
    }


    /* =====================================================
       DO NOT OBSERVE HOME HERO
       
       Loader.js owns:
       - Header
       - Promise
       - Home heading
       - Description
       - Founders
       - Story button
       - Foreground
    ===================================================== */


    /* =====================================================
       01 — WHAT WE DO
    ===================================================== */

    const whatWeDo =
        document.querySelector(
            ".what-we-do-section"
        );


    if (whatWeDo) {

        observe(
            whatWeDo.querySelector(
                ".what-we-do-title"
            ),
            "home-reveal"
        );


        observe(
            whatWeDo.querySelector(
                ".what-we-do-description"
            ),
            "home-reveal"
        );


        observeGroup(
            whatWeDo.querySelectorAll(
                ".service-item"
            ),
            "home-reveal"
        );


        whatWeDo
            .querySelectorAll(
                ".service-image"
            )
            .forEach(
                function (image) {

                    image.classList.add(
                        "home-image-reveal"
                    );

                    observer.observe(
                        image
                    );

                }
            );


        observe(
            whatWeDo.querySelector(
                ".what-we-do-cta"
            ),
            "home-reveal-scale"
        );
    }


    /* =====================================================
       02 — ABOUT
    ===================================================== */

    const about =
        document.querySelector(
            ".about-intro-section"
        );


    if (about) {

        observe(
            about.querySelector(
                ".about-intro-title"
            ),
            "home-reveal"
        );


        observeGroup(
            about.querySelectorAll(
                ".about-intro-text"
            ),
            "home-reveal"
        );


        observe(
            about.querySelector(
                ".about-intro-btn"
            ),
            "home-reveal-scale"
        );
    }


    /* =====================================================
       03 — EVENTS
    ===================================================== */

    const events =
        document.querySelector(
            ".home-events-section"
        );


    if (events) {

        observe(
            events.querySelector(
                ".home-events-heading"
            ),
            "home-reveal"
        );


        observeGroup(
            events.querySelectorAll(
                ".home-event-card"
            ),
            "home-reveal-scale"
        );


        observeGroup(
            events.querySelectorAll(
                ".home-event-content"
            ),
            "home-reveal"
        );


        observe(
            events.querySelector(
                ".home-events-explore"
            ),
            "home-reveal-scale"
        );
    }


    /* =====================================================
       04 — TICKER
    ===================================================== */

    const ticker =
        document.querySelector(
            ".home-events-ticker"
        );


    if (ticker) {

        observe(
            ticker,
            "home-reveal"
        );
    }


    /* =====================================================
       05 — ANTHEMS
    ===================================================== */

    const anthems =
        document.querySelector(
            ".anthems-hero-section"
        );


    if (anthems) {

        observe(
            anthems.querySelector(
                ".anthems-hero-left"
            ),
            "home-reveal-left"
        );


        observe(
            anthems.querySelector(
                ".anthems-hero-right"
            ),
            "home-reveal-right"
        );


        /*
           IMPORTANT:
           This special class is ONLY used here.
           It preserves translateX(-50%).
        */

        observe(
            anthems.querySelector(
                ".anthems-hero-button"
            ),
            "home-anthems-button-reveal"
        );


        const line =
            anthems.querySelector(
                ".anthems-hero-bottom-line"
            );


        if (line) {

            line.classList.add(
                "home-line-reveal"
            );


            observer.observe(
                line
            );
        }
    }


    /* =====================================================
       06 — SONGS
    ===================================================== */

    const songs =
        document.querySelector(
            ".home-songs-section"
        );


    if (songs) {

        observe(
            songs.querySelector(
                ".home-songs-heading"
            ),
            "home-reveal"
        );


        observeGroup(
            songs.querySelectorAll(
                ".home-song-card"
            ),
            "home-reveal"
        );


        songs
            .querySelectorAll(
                ".home-song-image"
            )
            .forEach(
                function (image) {

                    image.classList.add(
                        "home-image-reveal"
                    );

                    observer.observe(
                        image
                    );

                }
            );


        observe(
            songs.querySelector(
                ".home-songs-button"
            ),
            "home-reveal-scale"
        );
    }


    /* =====================================================
       07 — PRAYER
    ===================================================== */

    const prayer =
        document.querySelector(
            ".prayer-cta-section"
        );


    if (prayer) {

        observe(
            prayer.querySelector(
                ".prayer-cta-hand-left"
            ),
            "home-reveal-left"
        );


        observe(
            prayer.querySelector(
                ".prayer-cta-hand-right"
            ),
            "home-reveal-right"
        );


        observe(
            prayer.querySelector(
                ".prayer-cta-quote"
            ),
            "home-reveal"
        );


        observe(
            prayer.querySelector(
                ".prayer-cta-title"
            ),
            "home-reveal"
        );


        observe(
            prayer.querySelector(
                ".prayer-cta-description"
            ),
            "home-reveal"
        );


        observe(
            prayer.querySelector(
                ".prayer-cta-button"
            ),
            "home-reveal-scale"
        );
    }


    /* =====================================================
       08 — CONTACT CTA
    ===================================================== */

    const contact =
        document.querySelector(
            ".contact-cta-section"
        );


    if (contact) {

        /*
           DO NOT TOUCH .contact-watermark.
        */

        observe(
            contact.querySelector(
                ".contact-cta-card"
            ),
            "home-reveal"
        );


        observe(
            contact.querySelector(
                ".contact-cta-left"
            ),
            "home-reveal-left"
        );


        observe(
            contact.querySelector(
                ".contact-cta-right"
            ),
            "home-reveal-right"
        );


        observeGroup(
            contact.querySelectorAll(
                ".contact-info-item"
            ),
            "home-reveal"
        );
    }


    /* =====================================================
       09 — FOOTER
    ===================================================== */

    const footer =
        document.querySelector(
            ".site-footer"
        );


    if (footer) {

        observe(
            footer.querySelector(
                ".footer-brand"
            ),
            "home-reveal"
        );


        observeGroup(
            footer.querySelectorAll(
                ".footer-column"
            ),
            "home-reveal"
        );


        const divider =
            footer.querySelector(
                ".footer-divider"
            );


        if (divider) {

            divider.classList.add(
                "home-line-reveal"
            );


            observer.observe(
                divider
            );
        }


        observe(
            footer.querySelector(
                ".footer-bottom"
            ),
            "home-reveal"
        );
    }


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    if (reducedMotion) {

        revealAll();
    }


    function revealAll() {

        document
            .querySelectorAll(
                `
                .home-reveal,
                .home-reveal-left,
                .home-reveal-right,
                .home-reveal-scale,
                .home-anthems-button-reveal
                `
            )
            .forEach(
                function (element) {

                    element.classList.add(
                        "is-visible"
                    );

                }
            );
    }


})();