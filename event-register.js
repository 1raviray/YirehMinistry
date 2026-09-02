"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL =
    "https://yirehministry.onrender.com/api/event-register";


/* =========================================================
   ELEMENTS
========================================================= */

const form =
    document.getElementById("registrationForm");

const fullName =
    document.getElementById("fullName");

const city =
    document.getElementById("city");

const phone =
    document.getElementById("phone");

const email =
    document.getElementById("email");

const seats =
    document.getElementById("seats");

const continueButton =
    document.getElementById("continueButton");

const backButton =
    document.getElementById("backButton");

const cancelButton =
    document.getElementById("cancelButton");

const submitButton =
    document.getElementById("submitButton");

const stepOne =
    document.getElementById("stepOne");

const stepTwo =
    document.getElementById("stepTwo");

const stepOneLabel =
    document.getElementById("stepOneLabel");

const stepTwoLabel =
    document.getElementById("stepTwoLabel");

const eventTitle =
    document.getElementById("eventTitle");

const reviewEvent =
    document.getElementById("reviewEvent");

const reviewName =
    document.getElementById("reviewName");

const reviewContact =
    document.getElementById("reviewContact");

const reviewCity =
    document.getElementById("reviewCity");

const loaderOverlay =
    document.getElementById("loaderOverlay");

const loaderTitle =
    document.getElementById("loaderTitle");

const loaderText =
    document.getElementById("loaderText");

const successOverlay =
    document.getElementById("successOverlay");

const successMessage =
    document.getElementById("successMessage");

const successButton =
    document.getElementById("successButton");


/* =========================================================
   EVENT NAME
========================================================= */

const params =
    new URLSearchParams(window.location.search);

const eventName =
    (params.get("event") || "Yireh Ministry Event")
        .trim();


eventTitle.textContent =
    eventName;

reviewEvent.textContent =
    eventName;


/* =========================================================
   VALIDATION HELPERS
========================================================= */

function showError(id, message) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = message;
    }

}


function clearErrors() {

    document
        .querySelectorAll(".field-error")
        .forEach(function (element) {

            element.textContent = "";

        });

}


function validateStepOne() {

    clearErrors();

    let valid = true;


    const nameValue =
        fullName.value.trim();

    const cityValue =
        city.value.trim();

    const phoneValue =
        phone.value.trim();

    const emailValue =
        email.value.trim();


    /* NAME */

    if (nameValue.length < 2) {

        showError(
            "nameError",
            "Please enter your full name."
        );

        valid = false;

    }


    /* CITY */

    if (cityValue.length < 2) {

        showError(
            "cityError",
            "Please enter your city."
        );

        valid = false;

    }


    /* PHONE */

    const phoneDigits =
        phoneValue.replace(/\D/g, "");


    if (
        phoneDigits.length < 10 ||
        phoneDigits.length > 15
    ) {

        showError(
            "phoneError",
            "Please enter a valid phone number."
        );

        valid = false;

    }


    /* EMAIL */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(emailValue)) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        valid = false;

    }


    return valid;

}


/* =========================================================
   STEP SWITCHING
========================================================= */

function showStepTwo() {

    stepOne.classList.remove("active");

    stepTwo.classList.add("active");

    stepOneLabel.classList.remove("active");

    stepTwoLabel.classList.add("active");


    reviewName.textContent =
        fullName.value.trim();

    reviewContact.textContent =
        phone.value.trim();

    reviewCity.textContent =
        city.value.trim();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function showStepOne() {

    stepTwo.classList.remove("active");

    stepOne.classList.add("active");

    stepTwoLabel.classList.remove("active");

    stepOneLabel.classList.add("active");

}


/* =========================================================
   LOADER
========================================================= */

function showLoader() {

    loaderOverlay.classList.add("show");

    loaderOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


function hideLoader() {

    loaderOverlay.classList.remove("show");

    loaderOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   LOADER MESSAGES
========================================================= */

function updateLoaderMessage(
    title,
    text
) {

    loaderTitle.textContent =
        title;

    loaderText.textContent =
        text;

}


/* =========================================================
   SUCCESS
========================================================= */

function showSuccess(message) {

    successMessage.textContent =
        message;

    successOverlay.classList.add("show");

    successOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


function hideSuccess() {

    successOverlay.classList.remove("show");

    successOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   CONTINUE
========================================================= */

continueButton.addEventListener(
    "click",
    function () {

        if (!validateStepOne()) {
            return;
        }

        showStepTwo();

    }
);


/* =========================================================
   BACK
========================================================= */

backButton.addEventListener(
    "click",
    function () {

        showStepOne();

    }
);


/* =========================================================
   CANCEL
========================================================= */

cancelButton.addEventListener(
    "click",
    function () {

        window.history.back();

    }
);


/* =========================================================
   FORM SUBMISSION
========================================================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!validateStepOne()) {

            showStepOne();

            return;

        }


        const seatCount =
            Number(seats.value);


        if (
            !Number.isInteger(seatCount) ||
            seatCount < 1 ||
            seatCount > 20
        ) {

            alert(
                "Please select between 1 and 20 seats."
            );

            return;

        }


        /* =================================================
           DISABLE BUTTON
        ================================================= */

        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";


        showLoader();


        updateLoaderMessage(
            "Connecting to Yireh Ministry...",
            "This may take a few seconds if the server is waking up."
        );


        try {

            /* =================================================
               REQUEST
            ================================================= */

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            eventName:
                                eventName,

                            fullName:
                                fullName.value.trim(),

                            city:
                                city.value.trim(),

                            phone:
                                phone.value.trim(),

                            email:
                                email.value.trim(),

                            seats:
                                seatCount

                        })

                    }
                );


            /* =================================================
               READ RESPONSE SAFELY
            ================================================= */

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            let data;


            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                data =
                    await response.json();

            } else {

                const text =
                    await response.text();

                console.error(
                    "Event registration API returned non-JSON:",
                    text
                );

                throw new Error(
                    `Server returned HTTP ${response.status}.`
                );

            }


            /* =================================================
               ERROR
            ================================================= */

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to complete registration."
                );

            }


            /* =================================================
               SUCCESS
            ================================================= */

            updateLoaderMessage(
                "Registration confirmed!",
                "Your event registration has been received."
            );


            await new Promise(
                function (resolve) {
                    setTimeout(
                        resolve,
                        700
                    );
                }
            );


            hideLoader();


            showSuccess(
                data.message ||
                "Thank you. Your registration has been received."
            );


        } catch (error) {

            console.error(
                "Event registration error:",
                error
            );


            hideLoader();


            alert(
                error.message ||
                "Unable to submit your registration. Please try again."
            );


        } finally {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Confirm Registration";

        }

    }
);


/* =========================================================
   SUCCESS BUTTON
========================================================= */

successButton.addEventListener(
    "click",
    function () {

        hideSuccess();

        window.location.href =
            "events.html";

    }
);


/* =========================================================
   PREVENT ENTER FROM SUBMITTING STEP 1
========================================================= */

form.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            stepOne.classList.contains("active")
        ) {

            event.preventDefault();

            continueButton.click();

        }

    }
);