/* =========================================================
   YIREH MINISTRY
   HOME PAGE SCROLL ANIMATIONS
   CSS + INTERSECTION OBSERVER

   IMPORTANT:
   GSAP remains ONLY in loader.js.
   This file does NOT use GSAP or ScrollTrigger.
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       INTERSECTION OBSERVER CHECK
    ===================================================== */

    if (
        prefersReducedMotion ||
        typeof IntersectionObserver ===
            "undefined"
    ) {

        /*
           Reveal everything immediately.
        */

        document
            .querySelectorAll(
                `
                .home-reveal,
                .home-reveal-left,
                .home-reveal-right,
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

                            /*
                               Remove when leaving viewport.

                               This allows the animation to
                               replay when scrolling back up.
                            */

                            element.classList.remove(
                                "is-visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -8% 0px"
            }
        );


    /* =====================================================
       HELPERS
    ===================================================== */

    function observe(
        element,
        className
    ) {

        if (!element) {
            return;
        }


        if (className) {

            element.classList.add(
                className
            );
        }


        observer.observe(
            element
        );
    }


    function observeGroup(
        elements,
        className
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

                if (className) {

                    element.classList.add(
                        className
                    );
                }


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
       01. ABOUT / WHAT WE DO
    ===================================================== */

    const whatWeDo =
        document.querySelector(
            ".what-we-do-section"
        );


    if (whatWeDo) {

        const title =
            whatWeDo.querySelector(
                ".what-we-do-title"
            );

        const description =
            whatWeDo.querySelector(
                ".what-we-do-description"
            );

        const services =
            whatWeDo.querySelectorAll(
                ".service-item"
            );

        const images =
            whatWeDo.querySelectorAll(
                ".service-image"
            );

        const button =
            whatWeDo.querySelector(
                ".what-we-do-cta"
            );


        /* Title */

        observe(
            title,
            "home-reveal"
        );


        /* Description */

        observe(
            description,
            "home-reveal"
        );


        /* Services */

        observeGroup(
            services,
            "home-reveal"
        );


        /* Images */

        images.forEach(
            function (image) {

                image.classList.add(
                    "home-image-reveal"
                );

                observer.observe(
                    image
                );

            }
        );


        /* Button */

        observe(
            button,
            "home-anthems-button-reveal"
        );
    }


    /* =====================================================
       02. ABOUT INTRO
    ===================================================== */

    const about =
        document.querySelector(
            ".about-intro-section"
        );


    if (about) {

        const title =
            about.querySelector(
                ".about-intro-title"
            );

        const text =
            about.querySelectorAll(
                ".about-intro-text"
            );

        const button =
            about.querySelector(
                ".about-intro-btn"
            );


        observe(
            title,
            "home-reveal"
        );


        observeGroup(
            text,
            "home-reveal"
        );


        observe(
            button,
            "home-anthems-button-reveal"
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

        const heading =
            events.querySelector(
                ".home-events-heading"
            );

        const cards =
            events.querySelectorAll(
                ".home-event-card"
            );

        const contents =
            events.querySelectorAll(
                ".home-event-content"
            );

        const button =
            events.querySelector(
                ".home-events-explore"
            );


        observe(
            heading,
            "home-reveal"
        );


        observeGroup(
            cards,
            "home-anthems-button-reveal"
        );


        observeGroup(
            contents,
            "home-reveal"
        );


        observe(
            button,
            "home-anthems-button-reveal"
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

        observe(
            ticker,
            "home-reveal"
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


        /*
           Desktop:
           left and right enter from opposite sides.

           Mobile:
           CSS automatically changes them into
           vertical reveals.
        */

        observe(
            left,
            "home-reveal-left"
        );


        observe(
            right,
            "home-reveal-right"
        );


        observe(
            button,
            "home-anthems-button-reveal"
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
       06. SONGS
    ===================================================== */

    const songs =
        document.querySelector(
            ".home-songs-section"
        );


    if (songs) {

        const heading =
            songs.querySelector(
                ".home-songs-heading"
            );

        const cards =
            songs.querySelectorAll(
                ".home-song-card"
            );

        const images =
            songs.querySelectorAll(
                ".home-song-image"
            );

        const button =
            songs.querySelector(
                ".home-songs-button"
            );


        observe(
            heading,
            "home-reveal"
        );


        observeGroup(
            cards,
            "home-reveal"
        );


        /*
           Image class only.
           No IntersectionObserver needed if the card
           itself controls visibility, but we keep it
           lightweight.
        */

        images.forEach(
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
            button,
            "home-anthems-button-reveal"
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

        const leftHand =
            prayer.querySelector(
                ".prayer-cta-hand-left"
            );

        const rightHand =
            prayer.querySelector(
                ".prayer-cta-hand-right"
            );

        const quote =
            prayer.querySelector(
                ".prayer-cta-quote"
            );

        const title =
            prayer.querySelector(
                ".prayer-cta-title"
            );

        const description =
            prayer.querySelector(
                ".prayer-cta-description"
            );

        const button =
            prayer.querySelector(
                ".prayer-cta-button"
            );


        observe(
            leftHand,
            "home-reveal-left"
        );


        observe(
            rightHand,
            "home-reveal-right"
        );


        observe(
            quote,
            "home-reveal"
        );


        observe(
            title,
            "home-reveal"
        );


        observe(
            description,
            "home-reveal"
        );


        observe(
            button,
            "home-anthems-button-reveal"
        );
    }


    /* =====================================================
       08. CONTACT CTA
    ===================================================== */

    const contact =
        document.querySelector(
            ".contact-cta-section"
        );


    if (contact) {

        const card =
            contact.querySelector(
                ".contact-cta-card"
            );

        const left =
            contact.querySelector(
                ".contact-cta-left"
            );

        const right =
            contact.querySelector(
                ".contact-cta-right"
            );

        const items =
            contact.querySelectorAll(
                ".contact-info-item"
            );


        /*
           IMPORTANT:
           contact-watermark is completely untouched.
        */


        observe(
            card,
            "home-reveal"
        );


        observe(
            left,
            "home-reveal-left"
        );


        observe(
            right,
            "home-reveal-right"
        );


        observeGroup(
            items,
            "home-reveal"
        );
    }


    /* =====================================================
       09. FOOTER
    ===================================================== */

    const footer =
        document.querySelector(
            ".site-footer"
        );


    if (footer) {

        const brand =
            footer.querySelector(
                ".footer-brand"
            );

        const columns =
            footer.querySelectorAll(
                ".footer-column"
            );

        const divider =
            footer.querySelector(
                ".footer-divider"
            );

        const bottom =
            footer.querySelector(
                ".footer-bottom"
            );


        observe(
            brand,
            "home-reveal"
        );


        observeGroup(
            columns,
            "home-reveal"
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
            bottom,
            "home-reveal"
        );
    }


    /* =====================================================
       LOADER COMPATIBILITY
    ===================================================== */

    const loader =
        document.getElementById(
            "ymLoader"
        );


    if (loader) {

        /*
           We do not control the loader.

           loader.js remains completely responsible
           for GSAP and the intro sequence.
        */

        const loaderObserver =
            new MutationObserver(
                function () {

                    if (
                        !document.body.classList
                            .contains(
                                "ym-loading"
                            )
                    ) {

                        /*
                           Give the browser one frame
                           after the loader disappears.
                        */

                        requestAnimationFrame(
                            function () {

                                document.body
                                    .classList
                                    .add(
                                        "ym-content-ready"
                                    );

                            }
                        );


                        loaderObserver.disconnect();
                    }

                }
            );


        loaderObserver.observe(
            document.body,
            {
                attributes: true,

                attributeFilter: [
                    "class"
                ]
            }
        );
    }


})();