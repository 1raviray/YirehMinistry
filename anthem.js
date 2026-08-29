/* =========================================================
   YIREH MINISTRY
   ANTHEMS PAGE
   FORM SUBMISSION + RENDER WAKE-UP LOADER
========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const form =
    document.getElementById("anthemForm");


const lyricsOnlyBtn =
    document.getElementById("lyricsOnlyBtn");


const lyricsTuneBtn =
    document.getElementById("lyricsTuneBtn");


const tuneField =
    document.getElementById("tuneField");


const tuneFile =
    document.getElementById("tuneFile");


const tuneFileName =
    document.getElementById("tuneFileName");


const supportFile =
    document.getElementById("supportFile");


const supportFileName =
    document.getElementById("supportFileName");


const tuneUploadBox =
    document.getElementById("tuneUploadBox");


const supportUploadBox =
    document.getElementById("supportUploadBox");


const agreement =
    document.getElementById("agreement");


const submitBtn =
    document.getElementById("submitBtn");


const fullName =
    document.getElementById("fullName");


const locationInput =
    document.getElementById("location");


const phone =
    document.getElementById("phone");


const lyrics =
    document.getElementById("lyrics");


const attachmentSizeWarning =
    document.getElementById("attachmentSizeWarning");


/* =========================================================
   SUBMISSION LOADER
========================================================= */

const submissionLoader =
    document.getElementById("submissionLoader");


/* =========================================================
   SETTINGS
========================================================= */

const MAX_TOTAL_FILE_SIZE =
    10 * 1024 * 1024;


let submissionType =
    "lyrics";


/* =========================================================
   SUBMISSION LOADER FUNCTIONS
========================================================= */

function showSubmissionLoader() {

    if (!submissionLoader) {
        return;
    }


    submissionLoader.classList.add(
        "is-active"
    );


    submissionLoader.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
       Prevent the user from scrolling
       while the submission is being processed.
    */

    document.body.style.overflow =
        "hidden";
}


function hideSubmissionLoader() {

    if (!submissionLoader) {
        return;
    }


    submissionLoader.classList.remove(
        "is-active"
    );


    submissionLoader.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
       Restore normal page scrolling.
    */

    document.body.style.overflow =
        "";
}


/* =========================================================
   OUTSIDE SUBMISSION BUTTONS
========================================================= */

function setSubmissionType(type) {

    submissionType =
        type;


    if (type === "lyrics") {

        lyricsOnlyBtn.classList.add(
            "active"
        );


        lyricsTuneBtn.classList.remove(
            "active"
        );


        tuneField.classList.remove(
            "show"
        );


        tuneFile.required =
            false;


    } else {

        lyricsOnlyBtn.classList.remove(
            "active"
        );


        lyricsTuneBtn.classList.add(
            "active"
        );


        tuneField.classList.add(
            "show"
        );


        tuneFile.required =
            true;
    }


    updateSubmitState();
}


/* =========================================================
   SUBMISSION TYPE BUTTONS
========================================================= */

lyricsOnlyBtn.addEventListener(
    "click",
    () => {

        setSubmissionType(
            "lyrics"
        );

    }
);


lyricsTuneBtn.addEventListener(
    "click",
    () => {

        setSubmissionType(
            "tune"
        );

    }
);


/* =========================================================
   FILE DISPLAY
========================================================= */

tuneFile.addEventListener(
    "change",
    () => {

        if (
            tuneFile.files.length > 0
        ) {

            tuneFileName.textContent =
                `Selected: ${tuneFile.files[0].name}`;


            tuneUploadBox.classList.add(
                "has-file"
            );


        } else {

            tuneFileName.textContent =
                "";


            tuneUploadBox.classList.remove(
                "has-file"
            );

        }


        checkAttachmentSize();

        updateSubmitState();

    }
);


supportFile.addEventListener(
    "change",
    () => {

        if (
            supportFile.files.length > 0
        ) {

            supportFileName.textContent =
                `Selected: ${supportFile.files[0].name}`;


            supportUploadBox.classList.add(
                "has-file"
            );


        } else {

            supportFileName.textContent =
                "";


            supportUploadBox.classList.remove(
                "has-file"
            );

        }


        checkAttachmentSize();

        updateSubmitState();

    }
);


/* =========================================================
   TOTAL FILE SIZE
========================================================= */

function getTotalFileSize() {

    let totalSize =
        0;


    if (
        tuneFile.files.length > 0
    ) {

        totalSize +=
            tuneFile.files[0].size;
    }


    if (
        supportFile.files.length > 0
    ) {

        totalSize +=
            supportFile.files[0].size;
    }


    return totalSize;
}


/* =========================================================
   FORMAT FILE SIZE
========================================================= */

function formatFileSize(bytes) {

    return (
        bytes /
        (1024 * 1024)
    ).toFixed(2);
}


/* =========================================================
   CHECK ATTACHMENT SIZE
========================================================= */

function checkAttachmentSize() {

    const totalSize =
        getTotalFileSize();


    if (
        totalSize >
        MAX_TOTAL_FILE_SIZE
    ) {

        attachmentSizeWarning.textContent =
            `Total attachment size is ` +
            `${formatFileSize(totalSize)} MB. ` +
            `Maximum allowed is 10 MB. ` +
            `Please remove or replace a file.`;


        attachmentSizeWarning.classList.add(
            "show"
        );


        return false;
    }


    attachmentSizeWarning.textContent =
        "";


    attachmentSizeWarning.classList.remove(
        "show"
    );


    return true;
}


/* =========================================================
   FIELD VALIDATION
========================================================= */

function validateField(
    element,
    groupId
) {

    const group =
        document.getElementById(
            groupId
        );


    const valid =
        element.value.trim() !== "";


    group.classList.toggle(
        "invalid",
        !valid
    );


    return valid;
}


/* =========================================================
   FORM VALIDATION
========================================================= */

function isFormValid() {

    const nameValid =
        fullName.value.trim() !== "";


    const locationValid =
        locationInput.value.trim() !== "";


    const phoneValid =
        phone.value.trim() !== "";


    const lyricsValid =
        lyrics.value.trim() !== "";


    const agreementValid =
        agreement.checked;


    const tuneValid =
        submissionType === "lyrics" ||
        tuneFile.files.length > 0;


    const attachmentsValid =
        checkAttachmentSize();


    return (
        nameValid &&
        locationValid &&
        phoneValid &&
        lyricsValid &&
        agreementValid &&
        tuneValid &&
        attachmentsValid
    );
}


/* =========================================================
   SUBMIT BUTTON STATE
========================================================= */

function updateSubmitState() {

    submitBtn.disabled =
        !isFormValid();
}


/* =========================================================
   LIVE VALIDATION
========================================================= */

fullName.addEventListener(
    "input",
    () => {

        validateField(
            fullName,
            "nameGroup"
        );


        updateSubmitState();

    }
);


locationInput.addEventListener(
    "input",
    () => {

        validateField(
            locationInput,
            "locationGroup"
        );


        updateSubmitState();

    }
);


phone.addEventListener(
    "input",
    () => {

        validateField(
            phone,
            "phoneGroup"
        );


        updateSubmitState();

    }
);


lyrics.addEventListener(
    "input",
    () => {

        validateField(
            lyrics,
            "lyricsGroup"
        );


        updateSubmitState();

    }
);


agreement.addEventListener(
    "change",
    updateSubmitState
);


/* =========================================================
   FORM SUBMIT
========================================================= */

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        /* ---------------------------------------------
           FINAL VALIDATION
        --------------------------------------------- */

        if (
            !isFormValid()
        ) {

            updateSubmitState();

            return;
        }


        /* ---------------------------------------------
           FINAL FILE SIZE LIMITS
        --------------------------------------------- */

        const MAX_FILE_SIZE =
            10 * 1024 * 1024;


        const MAX_TOTAL_SIZE =
            18 * 1024 * 1024;


        const tune =
            tuneFile.files[0] ||
            null;


        const support =
            supportFile.files[0] ||
            null;


        /* ---------------------------------------------
           INDIVIDUAL TUNE FILE SIZE
        --------------------------------------------- */

        if (
            tune &&
            tune.size >
            MAX_FILE_SIZE
        ) {

            alert(
                "The tune/audio file must be 10 MB or smaller."
            );


            return;
        }


        /* ---------------------------------------------
           INDIVIDUAL SUPPORT FILE SIZE
        --------------------------------------------- */

        if (
            support &&
            support.size >
            MAX_FILE_SIZE
        ) {

            alert(
                "The supporting file must be 10 MB or smaller."
            );


            return;
        }


        /* ---------------------------------------------
           TOTAL FILE SIZE
        --------------------------------------------- */

        const totalSize =
            (tune?.size || 0) +
            (support?.size || 0);


        if (
            totalSize >
            MAX_TOTAL_SIZE
        ) {

            alert(
                "The combined attachment size must not exceed 18 MB."
            );


            return;
        }


        /* ---------------------------------------------
           DISABLE SUBMIT BUTTON
        --------------------------------------------- */

        submitBtn.disabled =
            true;


        submitBtn.textContent =
            "Sending...";


        /* ---------------------------------------------
           SHOW RENDER WAKE-UP LOADER
        --------------------------------------------- */

        showSubmissionLoader();


        try {

            /* -----------------------------------------
               FORM DATA
            ----------------------------------------- */

            const formData =
                new FormData(
                    form
                );


            /*
               Make sure backend receives
               the submission type.
            */

            formData.set(
                "submissionType",
                submissionType
            );


            /* -----------------------------------------
               SEND TO RENDER BACKEND
            ----------------------------------------- */

            const response =
                await fetch(
                    "https://yirehministry.onrender.com/api/anthems",
                    {
                        method:
                            "POST",

                        body:
                            formData
                    }
                );


            /* -----------------------------------------
               RESPONSE
            ----------------------------------------- */

            const result =
                await response.json();


            /* -----------------------------------------
               CHECK RESPONSE
            ----------------------------------------- */

            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Submission failed."
                );
            }


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            hideSubmissionLoader();


            alert(
                "Your anthem submission was sent successfully!"
            );


            /* -----------------------------------------
               RESET FORM
            ----------------------------------------- */

            form.reset();


            tuneFileName.textContent =
                "";


            supportFileName.textContent =
                "";


            tuneUploadBox
                ?.classList
                .remove(
                    "has-file"
                );


            supportUploadBox
                ?.classList
                .remove(
                    "has-file"
                );


            /* -----------------------------------------
               RESET SUBMISSION TYPE
            ----------------------------------------- */

            setSubmissionType(
                "lyrics"
            );


            updateSubmitState();


        } catch (error) {

            /* -----------------------------------------
               ERROR
            ----------------------------------------- */

            console.error(
                "Submission error:",
                error
            );


            hideSubmissionLoader();


            alert(
                error.message ||
                "Unable to submit your anthem."
            );


        } finally {

            /* -----------------------------------------
               RESTORE BUTTON
            ----------------------------------------- */

            submitBtn.disabled =
                false;


            submitBtn.textContent =
                "Submit";


            updateSubmitState();

        }

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

setSubmissionType(
    "lyrics"
);


updateSubmitState();


/* =========================================================
   SAFETY
   If the page is restored/reloaded while loader is active,
   make sure scrolling is restored.
========================================================= */

window.addEventListener(
    "pageshow",
    () => {

        if (
            submissionLoader &&
            !submissionLoader.classList.contains(
                "is-active"
            )
        ) {

            document.body.style.overflow =
                "";

        }

    }
);