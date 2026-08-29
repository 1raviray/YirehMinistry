"use strict";

/* =========================================================
   YIREH MINISTRY
   CONTACT FORM
   RENDER BACKEND + GMAIL API
   WITH SUBMISSION LOADER
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CONTACT_API_URL =
    "https://yirehministry.onrender.com/api/contact";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           ELEMENTS
        ===================================================== */

        const contactForm =
            document.getElementById(
                "contactDetailsForm"
            );


        const contactSubmitButton =
            document.getElementById(
                "contactSubmitButton"
            );


        const detailsName =
            document.getElementById(
                "detailsName"
            );


        const detailsLocation =
            document.getElementById(
                "detailsLocation"
            );


        const detailsContact =
            document.getElementById(
                "detailsContact"
            );


        const detailsMessage =
            document.getElementById(
                "detailsMessage"
            );


        /* =====================================================
           ERROR ELEMENTS
        ===================================================== */

        const detailsNameError =
            document.getElementById(
                "detailsNameError"
            );


        const detailsLocationError =
            document.getElementById(
                "detailsLocationError"
            );


        const detailsContactError =
            document.getElementById(
                "detailsContactError"
            );


        const detailsMessageError =
            document.getElementById(
                "detailsMessageError"
            );


        /* =====================================================
           LOADER
        ===================================================== */

        const contactLoader =
            document.getElementById(
                "contactLoader"
            );


        /* =====================================================
           REQUIRED ELEMENT CHECK
        ===================================================== */

        if (
            !contactForm ||
            !contactSubmitButton ||
            !detailsName ||
            !detailsLocation ||
            !detailsContact ||
            !detailsMessage
        ) {

            console.error(
                "Yireh Contact Form: Required HTML elements are missing."
            );

            return;
        }


        /* =====================================================
           SHOW LOADER
        ===================================================== */

        function showContactLoader(
            message = "Sending your message"
        ) {

            if (!contactLoader) {
                return;
            }


            const loaderTitle =
                contactLoader.querySelector(
                    ".contact-loader-title"
                );


            const loaderText =
                contactLoader.querySelector(
                    ".contact-loader-text"
                );


            if (loaderTitle) {

                loaderTitle.textContent =
                    message;
            }


            if (loaderText) {

                loaderText.textContent =
                    "Please wait while we connect with Yireh Ministry...";
            }


            contactLoader.classList.add(
                "is-active"
            );


            contactLoader.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";
        }


        /* =====================================================
           UPDATE LOADER MESSAGE
        ===================================================== */

        function updateContactLoader(
            title,
            description
        ) {

            if (!contactLoader) {
                return;
            }


            const loaderTitle =
                contactLoader.querySelector(
                    ".contact-loader-title"
                );


            const loaderText =
                contactLoader.querySelector(
                    ".contact-loader-text"
                );


            if (
                loaderTitle &&
                title
            ) {

                loaderTitle.textContent =
                    title;
            }


            if (
                loaderText &&
                description
            ) {

                loaderText.textContent =
                    description;
            }
        }


        /* =====================================================
           HIDE LOADER
        ===================================================== */

        function hideContactLoader() {

            if (!contactLoader) {
                return;
            }


            contactLoader.classList.remove(
                "is-active"
            );


            contactLoader.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.style.overflow =
                "";
        }


        /* =====================================================
           CLEAR ERROR
        ===================================================== */

        function clearFieldError(
            field,
            errorElement
        ) {

            if (field) {

                field.classList.remove(
                    "contact-field-error"
                );
            }


            if (errorElement) {

                errorElement.textContent =
                    "";
            }
        }


        /* =====================================================
           CLEAR ALL ERRORS
        ===================================================== */

        function clearErrors() {

            clearFieldError(
                detailsName,
                detailsNameError
            );


            clearFieldError(
                detailsLocation,
                detailsLocationError
            );


            clearFieldError(
                detailsContact,
                detailsContactError
            );


            clearFieldError(
                detailsMessage,
                detailsMessageError
            );
        }


        /* =====================================================
           SHOW ERROR
        ===================================================== */

        function showError(
            field,
            errorElement,
            message
        ) {

            if (field) {

                field.classList.add(
                    "contact-field-error"
                );
            }


            if (errorElement) {

                errorElement.textContent =
                    message;
            }
        }


        /* =====================================================
           NAME VALIDATION
        ===================================================== */

        function validateName() {

            const value =
                detailsName.value.trim();


            if (!value) {

                showError(
                    detailsName,
                    detailsNameError,
                    "Please enter your full name."
                );

                return false;
            }


            if (value.length < 2) {

                showError(
                    detailsName,
                    detailsNameError,
                    "Please enter a valid name."
                );

                return false;
            }


            return true;
        }


        /* =====================================================
           LOCATION VALIDATION
        ===================================================== */

        function validateLocation() {

            const value =
                detailsLocation.value.trim();


            if (!value) {

                showError(
                    detailsLocation,
                    detailsLocationError,
                    "Please enter your location."
                );

                return false;
            }


            if (value.length < 2) {

                showError(
                    detailsLocation,
                    detailsLocationError,
                    "Please enter a valid location."
                );

                return false;
            }


            return true;
        }


        /* =====================================================
           EMAIL VALIDATION
        ===================================================== */

        function isValidEmail(
            value
        ) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(value);
        }


        /* =====================================================
           PHONE VALIDATION
        ===================================================== */

        function isValidPhone(
            value
        ) {

            const digits =
                value.replace(
                    /\D/g,
                    ""
                );


            return (
                digits.length >= 10 &&
                digits.length <= 15
            );
        }


        /* =====================================================
           EMAIL / PHONE VALIDATION
        ===================================================== */

        function validateContact() {

            const value =
                detailsContact.value.trim();


            if (!value) {

                showError(
                    detailsContact,
                    detailsContactError,
                    "Please enter your email or phone number."
                );

                return false;
            }


            const validEmail =
                isValidEmail(value);


            const validPhone =
                isValidPhone(value);


            if (
                !validEmail &&
                !validPhone
            ) {

                showError(
                    detailsContact,
                    detailsContactError,
                    "Please enter a valid email or phone number."
                );

                return false;
            }


            return true;
        }


        /* =====================================================
           MESSAGE VALIDATION
        ===================================================== */

        function validateMessage() {

            const value =
                detailsMessage.value.trim();


            if (!value) {

                showError(
                    detailsMessage,
                    detailsMessageError,
                    "Please enter your message."
                );

                return false;
            }


            if (value.length < 5) {

                showError(
                    detailsMessage,
                    detailsMessageError,
                    "Please enter a little more detail."
                );

                return false;
            }


            return true;
        }


        /* =====================================================
           COMPLETE VALIDATION
        ===================================================== */

        function validateForm() {

            clearErrors();


            const nameValid =
                validateName();


            const locationValid =
                validateLocation();


            const contactValid =
                validateContact();


            const messageValid =
                validateMessage();


            return (
                nameValid &&
                locationValid &&
                contactValid &&
                messageValid
            );
        }


        /* =====================================================
           BUTTON STATE
        ===================================================== */

        function setSubmitting(
            submitting
        ) {

            contactSubmitButton.disabled =
                submitting;


            const buttonText =
                contactSubmitButton.querySelector(
                    "span"
                );


            if (!buttonText) {
                return;
            }


            buttonText.textContent =
                submitting
                    ? "Sending..."
                    : "Send Message";
        }


        /* =====================================================
           SUCCESS
        ===================================================== */

        function handleSuccess(
            responseData
        ) {

            contactForm.reset();

            clearErrors();


            hideContactLoader();


            alert(
                responseData?.message ||
                "Thank you! Your message has been sent successfully."
            );
        }


        /* =====================================================
           SUBMIT
        ===================================================== */

        contactForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* ---------------------------------------------
                   VALIDATE
                --------------------------------------------- */

                if (
                    !validateForm()
                ) {

                    const firstInvalidField =
                        contactForm.querySelector(
                            ".contact-field-error"
                        );


                    if (
                        firstInvalidField
                    ) {

                        firstInvalidField.focus();
                    }


                    return;
                }


                /* ---------------------------------------------
                   PREVENT DOUBLE SUBMIT
                --------------------------------------------- */

                if (
                    contactSubmitButton.disabled
                ) {

                    return;
                }


                /* ---------------------------------------------
                   GET VALUES
                --------------------------------------------- */

                const name =
                    detailsName.value.trim();


                const location =
                    detailsLocation.value.trim();


                const contact =
                    detailsContact.value.trim();


                const message =
                    detailsMessage.value.trim();


                /* ---------------------------------------------
                   UI
                --------------------------------------------- */

                setSubmitting(true);


                showContactLoader(
                    "Sending your message"
                );


                try {

                    /* =========================================
                       OPTIONAL STATUS MESSAGE
                    ========================================= */

                    updateContactLoader(
                        "Connecting to the server...",
                        "Please wait while we securely send your message."
                    );


                    /* =========================================
                       SEND TO RENDER
                    ========================================= */

                    const response =
                        await fetch(
                            CONTACT_API_URL,
                            {
                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        name:
                                            name,

                                        location:
                                            location,

                                        contact:
                                            contact,

                                        message:
                                            message

                                    })
                            }
                        );


                    /* =========================================
                       READ RESPONSE AS TEXT FIRST
                       
                       This prevents JSON.parse() errors when
                       the server returns HTML/plain text.
                    ========================================= */

                    const responseText =
                        await response.text();


                    console.log(
                        "Contact HTTP status:",
                        response.status
                    );


                    console.log(
                        "Contact response:",
                        responseText
                    );


                    /* =========================================
                       PARSE JSON
                    ========================================= */

                    let responseData;


                    try {

                        responseData =
                            JSON.parse(
                                responseText
                            );

                    } catch (parseError) {

                        console.error(
                            "Invalid JSON response from Contact API:",
                            parseError
                        );


                        throw new Error(
                            `Server returned an invalid response (HTTP ${response.status}).`
                        );
                    }


                    /* =========================================
                       SERVER ERROR
                    ========================================= */

                    if (
                        !response.ok ||
                        !responseData ||
                        responseData.success !== true
                    ) {

                        throw new Error(
                            responseData?.message ||
                            `Unable to send your message (HTTP ${response.status}).`
                        );
                    }


                    /* =========================================
                       SUCCESS
                    ========================================= */

                    updateContactLoader(
                        "Message sent successfully",
                        "Thank you for contacting Yireh Ministry."
                    );


                    /*
                       Small visual pause so the success state
                       can actually be seen.
                    */

                    await new Promise(
                        function (resolve) {

                            setTimeout(
                                resolve,
                                350
                            );

                        }
                    );


                    handleSuccess(
                        responseData
                    );


                } catch (error) {

                    console.error(
                        "Contact submission error:",
                        error
                    );


                    hideContactLoader();


                    alert(
                        error.message ||
                        "Unable to send your message. Please try again."
                    );


                } finally {

                    setSubmitting(false);

                }

            }
        );


        /* =====================================================
           LIVE VALIDATION
        ===================================================== */

        detailsName.addEventListener(
            "input",
            function () {

                clearFieldError(
                    detailsName,
                    detailsNameError
                );

            }
        );


        detailsLocation.addEventListener(
            "input",
            function () {

                clearFieldError(
                    detailsLocation,
                    detailsLocationError
                );

            }
        );


        detailsContact.addEventListener(
            "input",
            function () {

                clearFieldError(
                    detailsContact,
                    detailsContactError
                );

            }
        );


        detailsMessage.addEventListener(
            "input",
            function () {

                clearFieldError(
                    detailsMessage,
                    detailsMessageError
                );

            }
        );


        /* =====================================================
           PAGE RESTORE SAFETY
        ===================================================== */

        window.addEventListener(
            "pageshow",
            function () {

                hideContactLoader();

                setSubmitting(false);

            }
        );


        /* =====================================================
           INITIAL STATE
        ===================================================== */

        hideContactLoader();

        setSubmitting(false);

    }
);