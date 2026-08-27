/* =========================================================
   YIREH MINISTRY
   ABOUT PAGE SCROLL ANIMATIONS
   CSS + INTERSECTION OBSERVER
========================================================= */

(function () {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof IntersectionObserver === "undefined") {
        revealAll();
        return;
    }

    // 1. Record the exact time the script loads
    const scriptStartTime = Date.now();

    /* =====================================================
       2. OBSERVER SETUP (With Smart Initial Delay)
    ===================================================== */
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    
                    // Check how long it has been since the script started
                    const timeElapsed = Date.now() - scriptStartTime;
                    
                    // If this element is visible right on page load (within the first 500ms),
                    // force a 300ms delay. This gives the browser time to paint the white screen 
                    // into your website before the animation starts moving.
                    if (timeElapsed < 500) {
                        setTimeout(() => {
                            entry.target.classList.add("is-visible");
                        }, 0); 
                    } else {
                        // If the user scrolls down to this element later, animate immediately
                        entry.target.classList.add("is-visible");
                    }

                } else {
                    // Reverse animation when scrolling out of view
                    entry.target.classList.remove("is-visible");
                }
            });
        },
        {
            threshold: 0.05, 
            rootMargin: "0px 0px -50px 0px"
        }
    );

    /* =====================================================
       3. HELPERS
    ===================================================== */
    function observe(element) {
        if (!element || element.dataset.aboutObserved === "true") return;
        element.dataset.aboutObserved = "true";
        observer.observe(element);
    }

    function reveal(element, className) {
        if (!element) return;
        element.classList.add(className);
        observe(element);
    }

    function revealGroup(elements, className) {
        if (!elements) return;
        elements.forEach(function (element, index) {
            if (!element) return;
            element.classList.add(className);
            element.classList.add(`about-stagger-${Math.min(index + 1, 4)}`);
            observe(element);
        });
    }

    /* =====================================================
       4. ELEMENT TARGETING
    ===================================================== */
    function initAnimations() {
        if (reducedMotion) {
            revealAll();
            return;
        }

        // 01. VISION
        const vision = document.querySelector(".vision-section");
        if (vision) {
            reveal(vision.querySelector(".vision-title"), "about-reveal");
            revealGroup(vision.querySelectorAll(".vision-content p"), "about-reveal");
        }

        // 02. SRIMANTH
        const srimanth = document.querySelector(".srimanth-section");
        if (srimanth) {
            reveal(srimanth.querySelector(".section-heading-line"), "about-reveal");
            const image = srimanth.querySelector(".srimanth-image");
            if (image) {
                image.classList.add("about-image-reveal", "about-reveal-left");
                observe(image);
            }
            reveal(srimanth.querySelector(".srimanth-text"), "about-reveal-right");
            reveal(srimanth.querySelector(".srimanth-text h3"), "about-reveal");
            revealGroup(srimanth.querySelectorAll(".srimanth-text p"), "about-reveal");
        }

        // 03. PASTOR
        const pastor = document.querySelector(".pastor-section");
        if (pastor) {
            reveal(pastor.querySelector(".pastor-heading"), "about-reveal");
            const image = pastor.querySelector(".pastor-image");
            if (image) {
                image.classList.add("about-image-reveal", "about-reveal-left");
                observe(image);
            }
            reveal(pastor.querySelector(".pastor-text"), "about-reveal-right");
            reveal(pastor.querySelector(".pastor-text p"), "about-reveal");
        }

        // 04. OUR MISSION
        const mission = document.querySelector(".mission-section");
        if (mission) {
            reveal(mission.querySelector(".mission-title"), "about-reveal");
            reveal(mission.querySelector(".mission-subtitle"), "about-reveal");
            revealGroup(mission.querySelectorAll(".mission-card"), "about-reveal-scale");
            reveal(mission.querySelector(".mission-banner"), "about-reveal-scale");
            reveal(mission.querySelector(".banner-content"), "about-reveal");
            reveal(mission.querySelector(".mission-statement"), "about-reveal");
            reveal(mission.querySelector(".mission-cta"), "about-reveal-scale");
        }

        // 05. WHAT WE DO
        const whatWeDo = document.querySelector("#whatwedo.what-we-do-section");
        if (whatWeDo) {
            reveal(whatWeDo.querySelector(".what-we-do-title"), "about-reveal");
            reveal(whatWeDo.querySelector(".what-we-do-description"), "about-reveal");
            revealGroup(whatWeDo.querySelectorAll(".service-item"), "about-reveal");
            reveal(whatWeDo.querySelector(".what-we-do-cta"), "about-reveal-scale");
        }

        // 06. FOOTER
        const footer = document.querySelector(".site-footer");
        if (footer) {
            reveal(footer.querySelector(".footer-brand"), "about-reveal");
            revealGroup(footer.querySelectorAll(".footer-column"), "about-reveal");
            reveal(footer.querySelector(".footer-divider"), "about-reveal");
            reveal(footer.querySelector(".footer-bottom"), "about-reveal");
        }

        // Safety fallback for hardcoded HTML classes
        const allSelectors = ".about-reveal, .about-reveal-left, .about-reveal-right, .about-reveal-scale";
        document.querySelectorAll(allSelectors).forEach(function (element) {
            observe(element);
        });
    }

    function revealAll() {
        const allSelectors = ".about-reveal, .about-reveal-left, .about-reveal-right, .about-reveal-scale";
        document.querySelectorAll(allSelectors).forEach(function (element) {
            element.classList.add("is-visible");
        });
    }

    // Initialize immediately
    initAnimations();

})();