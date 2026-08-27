/* =========================================================
   YIREH MINISTRY
   ANTHEMS PAGE SCROLL ANIMATIONS
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
       01. PAGE TITLE & 02. INTRO
       Removed to allow instant loading of the first section
    ===================================================== */

    /* =====================================================
       03. SUBMISSION TYPE
    ===================================================== */
    const submissionType = document.querySelector(".submission-type");
    if (submissionType) {
        reveal(submissionType, "anthem-reveal");
    }

    /* =====================================================
       04. AGREEMENT
    ===================================================== */
    const agreement = document.querySelector(".agreement-row");
    if (agreement) {
        reveal(agreement, "anthem-reveal");
    }

    /* =====================================================
       05. FORM
    ===================================================== */
    const form = document.querySelector(".anthem-form");
    if (form) {
        reveal(form, "anthem-reveal");
    }

    /* =====================================================
       06. GUIDELINES
    ===================================================== */
    const guidelines = document.querySelector(".guidelines-section");
    if (guidelines) {
        const eyebrow = guidelines.querySelector(".guidelines-eyebrow");
        const title = guidelines.querySelector(".guidelines-title");
        const cards = guidelines.querySelectorAll(".guideline-card");

        reveal(eyebrow, "anthem-reveal");
        reveal(title, "anthem-reveal-scale");

        cards.forEach(function (card, index) {
            card.classList.add(`anthem-stagger-${Math.min(index + 1, 4)}`);
            reveal(card, "anthem-reveal");
        });
    }

    /* =====================================================
       07. FAQ
    ===================================================== */
    const faq = document.querySelector(".faq-section");
    if (faq) {
        const eyebrow = faq.querySelector(".faq-eyebrow");
        const title = faq.querySelector(".faq-title");
        const items = faq.querySelectorAll(".faq-item");

        reveal(eyebrow, "anthem-reveal");
        reveal(title, "anthem-reveal-scale");

        items.forEach(function (item, index) {
            item.classList.add(`anthem-stagger-${Math.min(index + 1, 4)}`);
            reveal(item, "anthem-reveal");
        });
    }

    /* =====================================================
       08. FOOTER
    ===================================================== */
    const footer = document.querySelector(".site-footer");
    if (footer) {
        const brand = footer.querySelector(".footer-brand");
        const columns = footer.querySelectorAll(".footer-column");
        const divider = footer.querySelector(".footer-divider");
        const bottom = footer.querySelector(".footer-bottom");

        reveal(brand, "anthem-reveal");

        columns.forEach(function (column, index) {
            column.classList.add(`anthem-stagger-${Math.min(index + 1, 4)}`);
            reveal(column, "anthem-reveal");
        });

        reveal(divider, "anthem-reveal");
        reveal(bottom, "anthem-reveal");
    }

})();