/* =========================================================
   YIREH MINISTRY
   ABOUT PAGE SCROLL ANIMATIONS
   IntersectionObserver
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
       HELPERS
    ===================================================== */

    function addClass(
        element,
        className
    ) {

        if (!element) {
            return;
        }

        element.classList.add(
            className
        );
    }


    function addClasses(
        elements,
        className
    ) {

        elements.forEach(
            (element) => {

                element.classList.add(
                    className
                );

            }
        );
    }


    /* =====================================================
       VISION TYPEWRITER
    ===================================================== */

    function prepareVisionTypewriter() {

        const vision =
            document.querySelector(
                ".vision-section"
            );

        if (!vision) {
            return;
        }


        const content =
            vision.querySelector(
                ".vision-content"
            );

        if (!content) {
            return;
        }


        const paragraphs =
            Array.from(
                content.querySelectorAll("p")
            );


        paragraphs.forEach(
            (paragraph) => {

                if (
                    paragraph.dataset.typewriterReady ===
                    "true"
                ) {
                    return;
                }


                const text =
                    paragraph.textContent
                        .replace(/\s+/g, " ")
                        .trim();


                if (!text) {
                    return;
                }


                paragraph.dataset.originalText =
                    text;


                paragraph.innerHTML = "";


                /*
                   Build lines according to the
                   actual paragraph width.
                */

                const words =
                    text.split(" ");


                const lineWrapper =
                    document.createElement(
                        "span"
                    );


                lineWrapper.className =
                    "vision-type-lines";


                paragraph.appendChild(
                    lineWrapper
                );


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


                document.body.appendChild(
                    measure
                );


                const availableWidth =
                    paragraph.clientWidth;


                let currentLine = "";


                function createLine(
                    value,
                    index
                ) {

                    const line =
                        document.createElement(
                            "span"
                        );


                    line.className =
                        "vision-type-line";


                    line.dataset.line =
                        index;


                    line.textContent =
                        value;


                    lineWrapper.appendChild(
                        line
                    );
                }


                let lineIndex = 0;


                words.forEach(
                    (word) => {

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


                paragraph.dataset.typewriterReady =
                    "true";
            }
        );
    }


    /* =====================================================
       OBSERVER
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

                        const target =
                            entry.target;


                        if (
                            entry.isIntersecting
                        ) {

                            target.classList.add(
                                "is-visible"
                            );


                            /*
                               Vision lines
                               are activated one by one.
                            */

                            if (
                                target.classList.contains(
                                    "vision-type-lines"
                                )
                            ) {

                                const lines =
                                    target.querySelectorAll(
                                        ".vision-type-line"
                                    );


                                lines.forEach(
                                    (
                                        line,
                                        index
                                    ) => {

                                        setTimeout(
                                            () => {

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
                               Reverse when leaving
                               the viewport so it
                               works when scrolling up.
                            */

                            target.classList.remove(
                                "is-visible"
                            );


                            if (
                                target.classList.contains(
                                    "vision-type-lines"
                                )
                            ) {

                                const lines =
                                    target.querySelectorAll(
                                        ".vision-type-line"
                                    );


                                lines.forEach(
                                    (line) => {

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
       VISION
    ===================================================== */

    prepareVisionTypewriter();


    const vision =
        document.querySelector(
            ".vision-section"
        );


    if (vision) {

        const title =
            vision.querySelector(
                ".vision-title"
            );

        const typeLines =
            vision.querySelectorAll(
                ".vision-type-lines"
            );


        addClass(
            title,
            "about-reveal"
        );


        addClasses(
            typeLines,
            "vision-type-lines"
        );


        observer.observe(
            title
        );


        typeLines.forEach(
            (element) => {

                observer.observe(
                    element
                );

            }
        );
    }


    /* =====================================================
       SRIMANTH
    ===================================================== */

    const srimanth =
        document.querySelector(
            ".srimanth-section"
        );


    if (srimanth) {

        const heading =
            srimanth.querySelector(
                ".section-heading-line"
            );

        const image =
            srimanth.querySelector(
                ".srimanth-image"
            );

        const text =
            srimanth.querySelector(
                ".srimanth-text"
            );

        const quote =
            srimanth.querySelector(
                ".srimanth-text h3"
            );

        const paragraphs =
            srimanth.querySelectorAll(
                ".srimanth-text p"
            );


        addClass(
            heading,
            "about-reveal"
        );


        addClass(
            image,
            "about-image-reveal"
        );

        addClass(
            image,
            "about-reveal-left"
        );


        addClass(
            text,
            "about-reveal-right"
        );


        addClass(
            quote,
            "about-reveal"
        );


        paragraphs.forEach(
            (
                paragraph,
                index
            ) => {

                addClass(
                    paragraph,
                    "about-reveal"
                );

                addClass(
                    paragraph,
                    `about-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );

            }
        );


        [
            heading,
            image,
            text,
            quote,
            ...paragraphs
        ]
            .filter(Boolean)
            .forEach(
                (element) => {

                    observer.observe(
                        element
                    );

                }
            );
    }


    /* =====================================================
       PASTOR
    ===================================================== */

    const pastor =
        document.querySelector(
            ".pastor-section"
        );


    if (pastor) {

        const heading =
            pastor.querySelector(
                ".pastor-heading"
            );

        const image =
            pastor.querySelector(
                ".pastor-image"
            );

        const text =
            pastor.querySelector(
                ".pastor-text"
            );

        const paragraph =
            pastor.querySelector(
                ".pastor-text p"
            );


        addClass(
            heading,
            "about-reveal"
        );


        addClass(
            image,
            "about-image-reveal"
        );

        addClass(
            image,
            "about-reveal-left"
        );


        addClass(
            text,
            "about-reveal-right"
        );


        addClass(
            paragraph,
            "about-reveal"
        );


        [
            heading,
            image,
            text,
            paragraph
        ]
            .filter(Boolean)
            .forEach(
                (element) => {

                    observer.observe(
                        element
                    );

                }
            );
    }


    /* =====================================================
       OUR MISSION
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


        addClass(
            title,
            "about-reveal"
        );


        addClass(
            subtitle,
            "about-reveal"
        );


        cards.forEach(
            (
                card,
                index
            ) => {

                addClass(
                    card,
                    "about-reveal-scale"
                );


                addClass(
                    card,
                    `about-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observer.observe(
                    card
                );

            }
        );


        addClass(
            banner,
            "about-reveal-scale"
        );


        addClass(
            bannerContent,
            "about-reveal"
        );


        addClass(
            statement,
            "about-reveal"
        );


        addClass(
            button,
            "about-reveal-scale"
        );


        [
            title,
            subtitle,
            banner,
            bannerContent,
            statement,
            button
        ]
            .filter(Boolean)
            .forEach(
                (element) => {

                    observer.observe(
                        element
                    );

                }
            );
    }


    /* =====================================================
       WHAT WE DO
    ===================================================== */

    const whatWeDo =
        document.querySelector(
            "#whatwedo.what-we-do-section"
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

        const button =
            whatWeDo.querySelector(
                ".what-we-do-cta"
            );


        addClass(
            title,
            "about-reveal"
        );


        addClass(
            description,
            "about-reveal"
        );


        services.forEach(
            (
                service,
                index
            ) => {

                addClass(
                    service,
                    "about-reveal"
                );


                addClass(
                    service,
                    `about-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observer.observe(
                    service
                );

            }
        );


        addClass(
            button,
            "about-reveal-scale"
        );


        [
            title,
            description,
            button
        ]
            .filter(Boolean)
            .forEach(
                (element) => {

                    observer.observe(
                        element
                    );

                }
            );
    }


    /* =====================================================
       FOOTER
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


        addClass(
            brand,
            "about-reveal"
        );


        columns.forEach(
            (
                column,
                index
            ) => {

                addClass(
                    column,
                    "about-reveal"
                );


                addClass(
                    column,
                    `about-stagger-${Math.min(
                        index + 1,
                        4
                    )}`
                );


                observer.observe(
                    column
                );

            }
        );


        addClass(
            divider,
            "about-reveal"
        );


        addClass(
            bottom,
            "about-reveal"
        );


        [
            brand,
            divider,
            bottom
        ]
            .filter(Boolean)
            .forEach(
                (element) => {

                    observer.observe(
                        element
                    );

                }
            );
    }


    /* =====================================================
       INITIAL OBSERVER REGISTRATION
    ===================================================== */

    document
        .querySelectorAll(
            ".about-reveal, " +
            ".about-reveal-left, " +
            ".about-reveal-right, " +
            ".about-reveal-scale"
        )
        .forEach(
            (element) => {

                /*
                   Avoid observing the same element twice.
                */

                if (
                    !element.dataset.aboutObserved
                ) {

                    observer.observe(
                        element
                    );

                    element.dataset.aboutObserved =
                        "true";
                }

            }
        );


    /* =====================================================
       RESPONSIVE VISION REBUILD
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
                           Rebuild only the Vision
                           typewriter lines.
                        */

                        const visionParagraphs =
                            document.querySelectorAll(
                                ".vision-content p"
                            );


                        visionParagraphs.forEach(
                            (paragraph) => {

                                paragraph.dataset.typewriterReady =
                                    "false";

                            }
                        );


                        prepareVisionTypewriter();


                        /*
                           Re-observe rebuilt
                           Vision lines.
                        */

                        const lines =
                            document.querySelectorAll(
                                ".vision-type-lines"
                            );


                        lines.forEach(
                            (line) => {

                                observer.observe(
                                    line
                                );

                            }
                        );

                    },
                    180
                );

        }
    );

})();