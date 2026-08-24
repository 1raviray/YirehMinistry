/* =========================================================
   YIREH MINISTRY
   EVENTS PAGE SCROLL ANIMATIONS
   INTERSECTION OBSERVER
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

    if (reducedMotion) {
        return;
    }


    /* =====================================================
       INTERSECTION OBSERVER CHECK
    ===================================================== */

    if (
        typeof IntersectionObserver ===
        "undefined"
    ) {
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


                            /* ---------------------------------
                               TYPEWRITER
                            --------------------------------- */

                            if (
                                element.classList.contains(
                                    "events-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".events-type-line"
                                    );


                                lines.forEach(
                                    function (
                                        line,
                                        index
                                    ) {

                                        window.setTimeout(
                                            function () {

                                                line.classList.add(
                                                    "is-visible"
                                                );

                                            },
                                            index * 150
                                        );

                                    }
                                );
                            }


                        } else {

                            /* ---------------------------------
                               REVERSE
                            --------------------------------- */

                            element.classList.remove(
                                "is-visible"
                            );


                            /* Reset typewriter */

                            if (
                                element.classList.contains(
                                    "events-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".events-type-line"
                                    );


                                lines.forEach(
                                    function (line) {

                                        line.classList.remove(
                                            "is-visible"
                                        );

                                    }
                                );
                            }

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
        element
    ) {

        if (!element) {
            return;
        }

        observer.observe(
            element
        );
    }


    function reveal(
        element,
        className
    ) {

        if (!element) {
            return;
        }

        element.classList.add(
            className
        );

        observe(
            element
        );
    }


    /* =====================================================
       TYPEWRITER BUILDER
    ===================================================== */

    function prepareTypewriter(
        paragraph
    ) {

        if (!paragraph) {
            return;
        }


        /* -----------------------------------------------
           SAVE ORIGINAL TEXT
        ------------------------------------------------ */

        if (
            !paragraph.dataset.originalText
        ) {

            paragraph.dataset.originalText =
                paragraph.textContent
                    .replace(/\s+/g, " ")
                    .trim();
        }


        const originalText =
            paragraph.dataset.originalText;


        if (!originalText) {
            return;
        }


        /* -----------------------------------------------
           CLEAR GENERATED CONTENT
        ------------------------------------------------ */

        paragraph.innerHTML = "";


        const container =
            document.createElement(
                "span"
            );


        container.className =
            "events-type-lines";


        paragraph.appendChild(
            container
        );


        /* -----------------------------------------------
           MEASUREMENT ELEMENT
        ------------------------------------------------ */

        const measure =
            document.createElement(
                "span"
            );


        const computed =
            getComputedStyle(
                paragraph
            );


        measure.style.position =
            "absolute";

        measure.style.visibility =
            "hidden";

        measure.style.pointerEvents =
            "none";

        measure.style.whiteSpace =
            "nowrap";

        measure.style.fontFamily =
            computed.fontFamily;

        measure.style.fontSize =
            computed.fontSize;

        measure.style.fontWeight =
            computed.fontWeight;

        measure.style.fontStyle =
            computed.fontStyle;

        measure.style.letterSpacing =
            computed.letterSpacing;

        measure.style.wordSpacing =
            computed.wordSpacing;


        document.body.appendChild(
            measure
        );


        /* -----------------------------------------------
           AVAILABLE WIDTH
        ------------------------------------------------ */

        const availableWidth =
            paragraph.clientWidth;


        const words =
            originalText.split(" ");


        let currentLine =
            "";

        let lineIndex =
            0;


        /* -----------------------------------------------
           CREATE LINE
        ------------------------------------------------ */

        function createLine(
            value,
            index
        ) {

            const line =
                document.createElement(
                    "span"
                );


            line.className =
                "events-type-line";


            line.dataset.line =
                index;


            line.textContent =
                value;


            container.appendChild(
                line
            );
        }


        /* -----------------------------------------------
           BUILD RESPONSIVE LINES
        ------------------------------------------------ */

        words.forEach(
            function (word) {

                const proposed =
                    currentLine
                        ? `${currentLine} ${word}`
                        : word;


                measure.textContent =
                    proposed;


                if (
                    currentLine &&
                    measure.offsetWidth >
                    availableWidth
                ) {

                    createLine(
                        currentLine,
                        lineIndex
                    );


                    lineIndex++;

                    currentLine =
                        word;

                } else {

                    currentLine =
                        proposed;
                }

            }
        );


        /* -----------------------------------------------
           LAST LINE
        ------------------------------------------------ */

        if (currentLine) {

            createLine(
                currentLine,
                lineIndex
            );
        }


        measure.remove();


        /* -----------------------------------------------
           OBSERVE TYPEWRITER
        ------------------------------------------------ */

        observe(
            container
        );
    }


    /* =====================================================
       01. EVENTS INTRO
    ===================================================== */

    const eventsSection =
        document.querySelector(
            ".events-section"
        );


    if (eventsSection) {

        const eyebrow =
            eventsSection.querySelector(
                ".events-heading span"
            );

        const title =
            eventsSection.querySelector(
                ".events-heading h1"
            );

        const description =
            eventsSection.querySelector(
                ".events-heading p"
            );


        /* Eyebrow */

        reveal(
            eyebrow,
            "events-reveal"
        );


        /* Title */

        reveal(
            title,
            "events-reveal-scale"
        );


        /* Typewriter */

        prepareTypewriter(
            description
        );
    }


    /* =====================================================
       02. EVENT CARDS
    ===================================================== */

    if (eventsSection) {

        const cards =
            eventsSection.querySelectorAll(
                ".event-card"
            );


        cards.forEach(
            function (
                card,
                index
            ) {

                /* -----------------------------------------
                   ALTERNATE DIRECTION
                ----------------------------------------- */

                if (
                    index % 2 === 0
                ) {

                    reveal(
                        card,
                        "events-reveal-left"
                    );

                } else {

                    reveal(
                        card,
                        "events-reveal-right"
                    );
                }


                card.classList.add(
                    `events-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                /* -----------------------------------------
                   EVENT BODY
                ----------------------------------------- */

                const body =
                    card.querySelector(
                        ".event-body"
                    );


                reveal(
                    body,
                    "events-reveal"
                );


                /* -----------------------------------------
                   EVENT BUTTON
                ----------------------------------------- */

                const button =
                    card.querySelector(
                        ".event-button"
                    );


                reveal(
                    button,
                    "events-reveal-scale"
                );

            }
        );
    }


    /* =====================================================
       03. ANTHEMS SEASON 1
    ===================================================== */

    if (eventsSection) {

        const anthemCard =
            eventsSection.querySelector(
                ".anthem-card"
            );


        if (anthemCard) {

            const title =
                anthemCard.querySelector(
                    "h2"
                );

            const paragraph =
                anthemCard.querySelector(
                    "p"
                );

            const button =
                anthemCard.querySelector(
                    ".anthem-button"
                );


            /* Card */

            reveal(
                anthemCard,
                "events-reveal-scale"
            );


            /* Title */

            reveal(
                title,
                "events-reveal"
            );


            /* Description */

            reveal(
                paragraph,
                "events-reveal"
            );


            /* Button */

            reveal(
                button,
                "events-reveal-scale"
            );
        }
    }


    /* =====================================================
       04. CONTACT CTA
    ===================================================== */

    const contactSection =
        document.querySelector(
            ".contact-cta-section"
        );


    if (contactSection) {

        const card =
            contactSection.querySelector(
                ".contact-cta-card"
            );

        const left =
            contactSection.querySelector(
                ".contact-cta-left"
            );

        const eyebrow =
            contactSection.querySelector(
                ".contact-eyebrow"
            );

        const title =
            contactSection.querySelector(
                ".contact-title"
            );

        const description =
            contactSection.querySelector(
                ".contact-description"
            );

        const button =
            contactSection.querySelector(
                ".contact-button"
            );

        const divider =
            contactSection.querySelector(
                ".contact-divider"
            );

        const right =
            contactSection.querySelector(
                ".contact-cta-right"
            );

        const items =
            contactSection.querySelectorAll(
                ".contact-info-item"
            );


        /*
           IMPORTANT:

           .contact-watermark is deliberately NOT
           selected, modified, observed, or animated.

           Its opacity/position/visibility remains
           100% under your existing events.css.
        */


        /* -----------------------------------------------
           CONTACT CARD
        ------------------------------------------------ */

        reveal(
            card,
            "events-contact-card"
        );


        /* -----------------------------------------------
           LEFT CONTENT
        ------------------------------------------------ */

        reveal(
            left,
            "events-reveal-left"
        );


        /* -----------------------------------------------
           EYEBROW
        ------------------------------------------------ */

        reveal(
            eyebrow,
            "events-reveal"
        );


        /* -----------------------------------------------
           TITLE
        ------------------------------------------------ */

        reveal(
            title,
            "events-reveal"
        );


        /* -----------------------------------------------
           DESCRIPTION
        ------------------------------------------------ */

        reveal(
            description,
            "events-reveal"
        );


        /* -----------------------------------------------
           BUTTON
        ------------------------------------------------ */

        reveal(
            button,
            "events-reveal-scale"
        );


        /* -----------------------------------------------
           DIVIDER
        ------------------------------------------------ */

        reveal(
            divider,
            "events-reveal"
        );


        /* -----------------------------------------------
           RIGHT CONTENT
        ------------------------------------------------ */

        reveal(
            right,
            "events-reveal-right"
        );


        /* -----------------------------------------------
           CONTACT INFO ITEMS
        ------------------------------------------------ */

        items.forEach(
            function (
                item,
                index
            ) {

                item.classList.add(
                    "events-reveal"
                );


                item.classList.add(
                    `events-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observe(
                    item
                );
            }
        );
    }


    /* =====================================================
       05. FOOTER
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


        /* -----------------------------------------------
           BRAND
        ------------------------------------------------ */

        reveal(
            brand,
            "events-reveal"
        );


        /* -----------------------------------------------
           COLUMNS
        ------------------------------------------------ */

        columns.forEach(
            function (
                column,
                index
            ) {

                column.classList.add(
                    "events-reveal"
                );


                column.classList.add(
                    `events-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observe(
                    column
                );
            }
        );


        /* -----------------------------------------------
           DIVIDER
        ------------------------------------------------ */

        reveal(
            divider,
            "events-reveal"
        );


        /* -----------------------------------------------
           BOTTOM
        ------------------------------------------------ */

        reveal(
            bottom,
            "events-reveal"
        );
    }


    /* =====================================================
       RESPONSIVE TYPEWRITER REBUILD
    ===================================================== */

    let resizeTimer =
        null;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        const description =
                            document.querySelector(
                                ".events-heading p"
                            );


                        if (
                            description
                        ) {

                            const originalText =
                                description.dataset
                                    .originalText ||
                                description.textContent
                                    .replace(/\s+/g, " ")
                                    .trim();


                            description.dataset
                                .originalText =
                                originalText;


                            prepareTypewriter(
                                description
                            );
                        }

                    },
                    180
                );
        }
    );


})();