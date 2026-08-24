/* =========================================================
   YIREH MINISTRY
   CONTACT PAGE SCROLL ANIMATIONS
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
                               INTRO TYPEWRITER
                            --------------------------------- */

                            if (
                                element.classList.contains(
                                    "contact-intro-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".contact-intro-type-line"
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


                            if (
                                element.classList.contains(
                                    "contact-intro-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".contact-intro-type-line"
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
           STORE ORIGINAL TEXT
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
            "contact-intro-type-lines";


        paragraph.appendChild(
            container
        );


        /* -----------------------------------------------
           MEASURING ELEMENT
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
                "contact-intro-type-line";


            line.dataset.line =
                index;


            line.textContent =
                value;


            container.appendChild(
                line
            );
        }


        /* -----------------------------------------------
           BUILD LINES
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
           OBSERVE
        ------------------------------------------------ */

        observe(
            container
        );
    }


    /* =====================================================
       01. CONTACT INTRO
    ===================================================== */

    const intro =
        document.querySelector(
            ".contact-intro-section"
        );


    if (intro) {

        const eyebrow =
            intro.querySelector(
                ".contact-intro-eyebrow"
            );

        const title =
            intro.querySelector(
                ".contact-intro-title"
            );

        const description =
            intro.querySelector(
                ".contact-intro-description"
            );


        /* Get In Touch */

        reveal(
            eyebrow,
            "contact-intro-reveal"
        );


        /* Main title */

        reveal(
            title,
            "contact-intro-scale"
        );


        /* Description */

        prepareTypewriter(
            description
        );
    }


    /* =====================================================
       02. CONTACT DETAILS
    ===================================================== */

    const details =
        document.querySelector(
            ".contact-details-section"
        );


    if (details) {

        const formCard =
            details.querySelector(
                ".contact-details-form-card"
            );

        const information =
            details.querySelector(
                ".contact-information"
            );

        const infoCards =
            details.querySelectorAll(
                ".contact-info-card"
            );

        const follow =
            details.querySelector(
                ".contact-follow"
            );


        /*
           Form card enters from the left.

           The actual form controls are NOT
           touched individually.
        */

        reveal(
            formCard,
            "contact-details-left"
        );


        /*
           Information column enters from right.
        */

        reveal(
            information,
            "contact-details-right"
        );


        /*
           Info cards individually reveal
           after their container.
        */

        infoCards.forEach(
            function (
                card,
                index
            ) {

                card.classList.add(
                    "contact-details-reveal"
                );


                card.classList.add(
                    `contact-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observe(
                    card
                );
            }
        );


        /*
           Follow/social section.
        */

        reveal(
            follow,
            "contact-details-reveal"
        );
    }


    /* =====================================================
       03. CONTACT CTA
       watermark deliberately excluded
    ===================================================== */

    const cta =
        document.querySelector(
            ".contact-cta-section"
        );


    if (cta) {

        const card =
            cta.querySelector(
                ".contact-cta-card"
            );

        const left =
            cta.querySelector(
                ".contact-cta-left"
            );

        const eyebrow =
            cta.querySelector(
                ".contact-eyebrow"
            );

        const title =
            cta.querySelector(
                ".contact-title"
            );

        const description =
            cta.querySelector(
                ".contact-description"
            );

        const button =
            cta.querySelector(
                ".contact-button"
            );

        const divider =
            cta.querySelector(
                ".contact-divider"
            );

        const right =
            cta.querySelector(
                ".contact-cta-right"
            );

        const items =
            cta.querySelectorAll(
                ".contact-info-item"
            );


        /*
           IMPORTANT:
           .contact-watermark is intentionally
           NOT selected, observed, or modified.
        */


        /* Entire card */

        reveal(
            card,
            "contact-cta-reveal"
        );


        /* Left */

        reveal(
            left,
            "contact-cta-left-reveal"
        );


        /* Eyebrow */

        reveal(
            eyebrow,
            "contact-cta-item-reveal"
        );


        /* Title */

        reveal(
            title,
            "contact-cta-item-reveal"
        );


        /* Description */

        reveal(
            description,
            "contact-cta-item-reveal"
        );


        /* Button */

        reveal(
            button,
            "contact-cta-scale"
        );


        /* Divider */

        reveal(
            divider,
            "contact-divider-reveal"
        );


        /* Right */

        reveal(
            right,
            "contact-cta-right-reveal"
        );


        /* Information items */

        items.forEach(
            function (
                item,
                index
            ) {

                item.classList.add(
                    "contact-cta-item-reveal"
                );


                item.classList.add(
                    `contact-stagger-${Math.min(
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
       04. FOOTER
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


        /* Brand */

        reveal(
            brand,
            "contact-footer-reveal"
        );


        /* Columns */

        columns.forEach(
            function (
                column,
                index
            ) {

                column.classList.add(
                    "contact-footer-reveal"
                );


                column.classList.add(
                    `contact-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observe(
                    column
                );
            }
        );


        /* Divider */

        reveal(
            divider,
            "contact-footer-reveal"
        );


        /* Bottom */

        reveal(
            bottom,
            "contact-footer-reveal"
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
                                ".contact-intro-description"
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