/* =========================================================
   YIREH MINISTRY
   CONTACT PAGE SCROLL ANIMATIONS
   CSS + INTERSECTION OBSERVER
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       REDUCED MOTION
    ===================================================== */
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof IntersectionObserver === "undefined" || reducedMotion) {
        return;
    }

    // Record script start time for the smart delay
    const scriptStartTime = Date.now();

    /* =====================================================
       OBSERVER SETUP
    ===================================================== */
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const timeElapsed = Date.now() - scriptStartTime;
                    
                    // Smart delay for elements immediately in viewport on load
                    if (timeElapsed < 500) {
                        setTimeout(() => {
                            entry.target.classList.add("is-visible");
                        }, 300);
                    } else {
                        entry.target.classList.add("is-visible");
                    }
                } else {
                    // Reverse animation
                    entry.target.classList.remove("is-visible");
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    /* =====================================================
       HELPERS
    ===================================================== */
    function observe(element) {
        if (!element) return;
        observer.observe(element);
    }

    function reveal(element, className) {
        if (!element) return;
        element.classList.add(className);
        observe(element);
    }

    /* =====================================================
       01. CONTACT INTRO
       Removed to allow instant loading of the first section
    ===================================================== */

    /* =====================================================
       02. CONTACT DETAILS
    ===================================================== */
    const details = document.querySelector(".contact-details-section");

    if (details) {
        const formCard = details.querySelector(".contact-details-form-card");
        const information = details.querySelector(".contact-information");
        const infoCards = details.querySelectorAll(".contact-info-card");
        const follow = details.querySelector(".contact-follow");

        reveal(formCard, "contact-details-left");
        reveal(information, "contact-details-right");

        infoCards.forEach(function (card, index) {
            card.classList.add(`contact-stagger-${Math.min(index + 1, 4)}`);
            reveal(card, "contact-details-reveal");
        });

        reveal(follow, "contact-details-reveal");
    }

    /* =====================================================
       03. CONTACT CTA
       watermark deliberately excluded
    ===================================================== */
    const cta = document.querySelector(".contact-cta-section");

    if (cta) {
        const card = cta.querySelector(".contact-cta-card");
        const left = cta.querySelector(".contact-cta-left");
        const eyebrow = cta.querySelector(".contact-eyebrow");
        const title = cta.querySelector(".contact-title");
        const description = cta.querySelector(".contact-description");
        const button = cta.querySelector(".contact-button");
        const divider = cta.querySelector(".contact-divider");
        const right = cta.querySelector(".contact-cta-right");
        const items = cta.querySelectorAll(".contact-info-item");

        reveal(card, "contact-cta-reveal");
        reveal(left, "contact-cta-left-reveal");
        reveal(eyebrow, "contact-cta-item-reveal");
        reveal(title, "contact-cta-item-reveal");
        reveal(description, "contact-cta-item-reveal");
        reveal(button, "contact-cta-scale");
        reveal(divider, "contact-divider-reveal");
        reveal(right, "contact-cta-right-reveal");

        items.forEach(function (item, index) {
            item.classList.add(`contact-stagger-${Math.min(index + 1, 4)}`);
            reveal(item, "contact-cta-item-reveal");
        });
    }

    /* =====================================================
       04. FOOTER
    ===================================================== */
    const footer = document.querySelector(".site-footer");

    if (footer) {
        const brand = footer.querySelector(".footer-brand");
        const columns = footer.querySelectorAll(".footer-column");
        const divider = footer.querySelector(".footer-divider");
        const bottom = footer.querySelector(".footer-bottom");

        reveal(brand, "contact-footer-reveal");

        columns.forEach(function (column, index) {
            column.classList.add(`contact-stagger-${Math.min(index + 1, 4)}`);
            reveal(column, "contact-footer-reveal");
        });

        reveal(divider, "contact-footer-reveal");
        reveal(bottom, "contact-footer-reveal");
    }

})();