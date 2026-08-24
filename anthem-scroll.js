/* =========================================================
   YIREH MINISTRY
   ANTHEMS PAGE SCROLL ANIMATIONS
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
                                    "anthem-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".anthem-type-line"
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
                                    "anthem-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".anthem-type-line"
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
       RESPONSIVE TYPEWRITER BUILDER
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
           REMOVE GENERATED CONTENT
        ------------------------------------------------ */

        paragraph.innerHTML = "";


        const container =
            document.createElement(
                "span"
            );


        container.className =
            "anthem-type-lines";


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
                "anthem-type-line";


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
           OBSERVE TYPEWRITER
        ------------------------------------------------ */

        observe(
            container
        );
    }


    /* =====================================================
       01. PAGE TITLE
    ===================================================== */

    const page =
        document.querySelector(
            ".anthems-page"
        );


    if (page) {

        const pageTitle =
            page.querySelector(
                ".anthems-title"
            );


        reveal(
            pageTitle,
            "anthem-reveal-scale"
        );
    }


    /* =====================================================
       02. INTRO
    ===================================================== */

    const intro =
        document.querySelector(
            ".anthems-intro"
        );


    if (intro) {

        const subtitle =
            intro.querySelector(
                ".anthems-intro-subtitle"
            );

        const title =
            intro.querySelector(
                ".anthems-intro-title"
            );

        const description =
            intro.querySelector(
                ".anthems-intro-text"
            );


        /* Subtitle */

        reveal(
            subtitle,
            "anthem-reveal"
        );


        /* Title */

        reveal(
            title,
            "anthem-reveal-scale"
        );


        /* Description */

        prepareTypewriter(
            description
        );
    }


    /* =====================================================
       03. SUBMISSION TYPE
       Small controlled reveal.
    ===================================================== */

    const submissionType =
        document.querySelector(
            ".submission-type"
        );


    if (submissionType) {

        reveal(
            submissionType,
            "anthem-reveal"
        );
    }


    /* =====================================================
       04. AGREEMENT
    ===================================================== */

    const agreement =
        document.querySelector(
            ".agreement-row"
        );


    if (agreement) {

        reveal(
            agreement,
            "anthem-reveal"
        );
    }


    /* =====================================================
       05. FORM
       Only the surrounding form block is revealed.
       Individual controls remain untouched.
    ===================================================== */

    const form =
        document.querySelector(
            ".anthem-form"
        );


    if (form) {

        reveal(
            form,
            "anthem-reveal"
        );
    }


    /* =====================================================
       06. GUIDELINES
    ===================================================== */

    const guidelines =
        document.querySelector(
            ".guidelines-section"
        );


    if (guidelines) {

        const eyebrow =
            guidelines.querySelector(
                ".guidelines-eyebrow"
            );

        const title =
            guidelines.querySelector(
                ".guidelines-title"
            );

        const cards =
            guidelines.querySelectorAll(
                ".guideline-card"
            );


        /* Eyebrow */

        reveal(
            eyebrow,
            "anthem-reveal"
        );


        /* Title */

        reveal(
            title,
            "anthem-reveal-scale"
        );


        /* Cards */

        cards.forEach(
            function (
                card,
                index
            ) {

                card.classList.add(
                    "anthem-reveal"
                );


                card.classList.add(
                    `anthem-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observe(
                    card
                );
            }
        );
    }


    /* =====================================================
       07. FAQ
    ===================================================== */

    const faq =
        document.querySelector(
            ".faq-section"
        );


    if (faq) {

        const eyebrow =
            faq.querySelector(
                ".faq-eyebrow"
            );

        const title =
            faq.querySelector(
                ".faq-title"
            );

        const items =
            faq.querySelectorAll(
                ".faq-item"
            );


        /* Eyebrow */

        reveal(
            eyebrow,
            "anthem-reveal"
        );


        /* Title */

        reveal(
            title,
            "anthem-reveal-scale"
        );


        /* FAQ items */

        items.forEach(
            function (
                item,
                index
            ) {

                item.classList.add(
                    "anthem-reveal"
                );


                item.classList.add(
                    `anthem-stagger-${Math.min(
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
       08. FOOTER
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
            "anthem-reveal"
        );


        /* Columns */

        columns.forEach(
            function (
                column,
                index
            ) {

                column.classList.add(
                    "anthem-reveal"
                );


                column.classList.add(
                    `anthem-stagger-${Math.min(
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
            "anthem-reveal"
        );


        /* Bottom */

        reveal(
            bottom,
            "anthem-reveal"
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
                                ".anthems-intro-text"
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