/* =========================================================
   YIREH MINISTRY
   EVENTS PAGE SCROLL ANIMATIONS
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
            threshold: 0.05,
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
       01. EVENTS INTRO
       Removed to allow instant loading of the first section
    ===================================================== */

    /* =====================================================
       02. EVENT CARDS
    ===================================================== */
    const eventsSection = document.querySelector(".events-section");

    if (eventsSection) {
        const cards = eventsSection.querySelectorAll(".event-card");

        cards.forEach(function (card, index) {
            // Alternate left/right direction
            if (index % 2 === 0) {
                reveal(card, "events-reveal-left");
            } else {
                reveal(card, "events-reveal-right");
            }

            card.classList.add(`events-stagger-${Math.min(index + 1, 4)}`);

            const body = card.querySelector(".event-body");
            reveal(body, "events-reveal");

            const button = card.querySelector(".event-button");
            reveal(button, "events-reveal-scale");
        });
    }

    /* =====================================================
       03. ANTHEMS SEASON 1
    ===================================================== */
    if (eventsSection) {
        const anthemCard = eventsSection.querySelector(".anthem-card");

        if (anthemCard) {
            const title = anthemCard.querySelector("h2");
            const paragraph = anthemCard.querySelector("p");
            const button = anthemCard.querySelector(".anthem-button");

            reveal(anthemCard, "events-reveal-scale");
            reveal(title, "events-reveal");
            reveal(paragraph, "events-reveal");
            reveal(button, "events-reveal-scale");
        }
    }

    /* =====================================================
       04. CONTACT CTA
    ===================================================== */
    const contactSection = document.querySelector(".contact-cta-section");

    if (contactSection) {
        const card = contactSection.querySelector(".contact-cta-card");
        const left = contactSection.querySelector(".contact-cta-left");
        const eyebrow = contactSection.querySelector(".contact-eyebrow");
        const title = contactSection.querySelector(".contact-title");
        const description = contactSection.querySelector(".contact-description");
        const button = contactSection.querySelector(".contact-button");
        const divider = contactSection.querySelector(".contact-divider");
        const right = contactSection.querySelector(".contact-cta-right");
        const items = contactSection.querySelectorAll(".contact-info-item");

        reveal(card, "events-contact-card");
        reveal(left, "events-reveal-left");
        reveal(eyebrow, "events-reveal");
        reveal(title, "events-reveal");
        reveal(description, "events-reveal");
        reveal(button, "events-reveal-scale");
        reveal(divider, "events-reveal");
        reveal(right, "events-reveal-right");

        items.forEach(function (item, index) {
            item.classList.add("events-reveal");
            item.classList.add(`events-stagger-${Math.min(index + 1, 4)}`);
            observe(item);
        });
    }

    /* =====================================================
       05. FOOTER
    ===================================================== */
    const footer = document.querySelector(".site-footer");

    if (footer) {
        const brand = footer.querySelector(".footer-brand");
        const columns = footer.querySelectorAll(".footer-column");
        const divider = footer.querySelector(".footer-divider");
        const bottom = footer.querySelector(".footer-bottom");

        reveal(brand, "events-reveal");

        columns.forEach(function (column, index) {
            column.classList.add("events-reveal");
            column.classList.add(`events-stagger-${Math.min(index + 1, 4)}`);
            observe(column);
        });

        reveal(divider, "events-reveal");
        reveal(bottom, "events-reveal");
    }

})();