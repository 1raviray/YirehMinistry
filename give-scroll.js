/* =========================================================
   YIREH MINISTRY
   GIVE PAGE SCROLL ANIMATIONS
   CSS + INTERSECTION OBSERVER
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
       INTERSECTION OBSERVER
    ===================================================== */

    if (
        typeof IntersectionObserver ===
        "undefined"
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            (
                entries
            ) => {

                entries.forEach(
                    (entry) => {

                        const element =
                            entry.target;


                        if (
                            entry.isIntersecting
                        ) {

                            element.classList.add(
                                "is-visible"
                            );


                            /*
                               Typewriter lines
                            */

                            if (
                                element.classList.contains(
                                    "give-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".give-type-line"
                                    );


                                lines.forEach(
                                    (
                                        line,
                                        index
                                    ) => {

                                        setTimeout(
                                            function () {

                                                line.classList.add(
                                                    "is-visible"
                                                );

                                            },
                                            index * 160
                                        );

                                    }
                                );
                            }


                        } else {

                            /*
                               Reverse when the element
                               leaves the viewport.
                            */

                            element.classList.remove(
                                "is-visible"
                            );


                            if (
                                element.classList.contains(
                                    "give-type-lines"
                                )
                            ) {

                                const lines =
                                    element.querySelectorAll(
                                        ".give-type-line"
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


    function addReveal(
        element,
        className = "give-reveal"
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
       TYPEWRITER
       Build visual lines based on the actual
       rendered width.
    ===================================================== */

    function prepareTypewriter(
        paragraph,
        lineClass = "give-type-lines"
    ) {

        if (!paragraph) {
            return;
        }


        /*
           Save original text once.
        */

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


        /*
           Clear existing generated lines.
        */

        paragraph.innerHTML = "";


        const lineContainer =
            document.createElement(
                "span"
            );


        lineContainer.className =
            lineClass;


        paragraph.appendChild(
            lineContainer
        );


        /*
           Temporary hidden text
           used to calculate line wrapping.
        */

        const measure =
            document.createElement(
                "span"
            );


        const style =
            getComputedStyle(
                paragraph
            );


        measure.style.position =
            "absolute";

        measure.style.visibility =
            "hidden";

        measure.style.whiteSpace =
            "nowrap";

        measure.style.pointerEvents =
            "none";

        measure.style.fontFamily =
            style.fontFamily;

        measure.style.fontSize =
            style.fontSize;

        measure.style.fontWeight =
            style.fontWeight;

        measure.style.fontStyle =
            style.fontStyle;

        measure.style.letterSpacing =
            style.letterSpacing;

        measure.style.wordSpacing =
            style.wordSpacing;


        document.body.appendChild(
            measure
        );


        /*
           Width available for text.
        */

        const availableWidth =
            paragraph.clientWidth;


        const words =
            originalText.split(" ");


        let currentLine = "";

        let lineIndex = 0;


        function createLine(
            text,
            index
        ) {

            const line =
                document.createElement(
                    "span"
                );


            line.className =
                "give-type-line";


            line.dataset.line =
                index;


            line.textContent =
                text;


            lineContainer.appendChild(
                line
            );
        }


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


        if (currentLine) {

            createLine(
                currentLine,
                lineIndex
            );
        }


        measure.remove();


        /*
           Mark container as ready.
        */

        lineContainer.classList.add(
            "give-type-lines"
        );


        observe(
            lineContainer
        );
    }


    /* =====================================================
       01. GIVE INTRO
       TYPEWRITER LINE BY LINE
    ===================================================== */

    const intro =
        document.querySelector(
            ".give-intro"
        );


    if (intro) {

        const eyebrow =
            intro.querySelector(
                ".give-eyebrow"
            );

        const title =
            intro.querySelector(
                "h1"
            );

        const description =
            intro.querySelector(
                ".give-description"
            );


        /* -------------------------------------------------
           EYEBROW
        ------------------------------------------------- */

        addReveal(
            eyebrow,
            "give-reveal"
        );


        /* -------------------------------------------------
           TITLE
        ------------------------------------------------- */

        addReveal(
            title,
            "give-reveal-scale"
        );


        /* -------------------------------------------------
           DESCRIPTION TYPEWRITER
        ------------------------------------------------- */

        prepareTypewriter(
            description
        );
    }


    /* =====================================================
       02. SPONSORSHIP
    ===================================================== */

    const sponsorship =
        document.querySelector(
            ".sponsorship-section"
        );


    if (sponsorship) {

        const title =
            sponsorship.querySelector(
                ".sponsorship-title"
            );

        const listItems =
            sponsorship.querySelectorAll(
                ".sponsorship-list li"
            );


        addReveal(
            title
        );


        listItems.forEach(
            function (
                item,
                index
            ) {

                item.classList.add(
                    `give-stagger-${Math.min(
                        index + 1,
                        5
                    )}`
                );


                observe(
                    item
                );
            }
        );
    }


    /* =====================================================
       03. WAYS TO GIVE
    ===================================================== */

    const ways =
        document.querySelector(
            ".ways-give-section"
        );


    if (ways) {

        const title =
            ways.querySelector(
                ".ways-give-title"
            );

        const cards =
            ways.querySelectorAll(
                ".giving-card"
            );


        addReveal(
            title
        );


        cards.forEach(
            function (
                card,
                index
            ) {

                card.classList.add(
                    "give-reveal-scale"
                );

                card.classList.add(
                    `give-stagger-${Math.min(
                        index + 1,
                        5
                    )}`
                );


                observe(
                    card
                );
            }
        );
    }


    /* =====================================================
       04. WHY IT MATTERS
    ===================================================== */

    const why =
        document.querySelector(
            ".why-matters-section"
        );


    if (why) {

        const title =
            why.querySelector(
                ".why-matters-title"
            );

        const listItems =
            why.querySelectorAll(
                ".why-matters-list li"
            );

        const button =
            why.querySelector(
                ".why-matters-button"
            );

        const note =
            why.querySelector(
                ".why-matters-note"
            );


        addReveal(
            title
        );


        listItems.forEach(
            function (
                item,
                index
            ) {

                item.classList.add(
                    `give-stagger-${Math.min(
                        index + 1,
                        5
                    )}`
                );


                observe(
                    item
                );
            }
        );


        addReveal(
            button,
            "give-reveal-scale"
        );


        addReveal(
            note
        );
    }


    /* =====================================================
       05. OUR MISSION
    ===================================================== */

    const mission =
        document.querySelector(
            ".mission-section"
        );


    if (mission) {

        const title =
            mission.querySelector(
                ".mission-title"
            );

        const subtitle =
            mission.querySelector(
                ".mission-subtitle"
            );

        const cards =
            mission.querySelectorAll(
                ".mission-card"
            );

        const banner =
            mission.querySelector(
                ".mission-banner"
            );

        const bannerContent =
            mission.querySelector(
                ".banner-content"
            );

        const statement =
            mission.querySelector(
                ".mission-statement"
            );

        const button =
            mission.querySelector(
                ".mission-cta"
            );


        addReveal(
            title
        );


        addReveal(
            subtitle,
            "give-reveal"
        );


        cards.forEach(
            function (
                card,
                index
            ) {

                card.classList.add(
                    "give-reveal-scale"
                );

                card.classList.add(
                    `give-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observe(
                    card
                );
            }
        );


        addReveal(
            banner,
            "give-reveal-scale"
        );


        addReveal(
            bannerContent,
            "give-reveal"
        );


        addReveal(
            statement,
            "give-reveal"
        );


        addReveal(
            button,
            "give-reveal-scale"
        );
    }


    /* =====================================================
       06. FOOTER
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


        addReveal(
            brand
        );


        columns.forEach(
            function (
                column,
                index
            ) {

                column.classList.add(
                    `give-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                addReveal(
                    column
                );
            }
        );


        addReveal(
            divider
        );


        addReveal(
            bottom
        );
    }


    /* =====================================================
       RESPONSIVE TYPEWRITER REBUILD
    ===================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        /*
                           Rebuild the first section
                           because line wrapping changes
                           on tablet/mobile.
                        */

                        const description =
                            document.querySelector(
                                ".give-description"
                            );


                        if (description) {

                            description.dataset.originalText =
                                description.textContent
                                    .replace(/\s+/g, " ")
                                    .trim();


                            description.innerHTML =
                                "";


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