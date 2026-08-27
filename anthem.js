/* =========================
   ELEMENTS
========================= */

const form = document.getElementById("anthemForm");

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


/* =========================
   SETTINGS
========================= */

const MAX_TOTAL_FILE_SIZE =
  10 * 1024 * 1024;

let submissionType = "lyrics";


/* =========================
   OUTSIDE SUBMISSION BUTTONS
========================= */

function setSubmissionType(type) {

  submissionType = type;

  if (type === "lyrics") {

    lyricsOnlyBtn.classList.add("active");
    lyricsTuneBtn.classList.remove("active");

    tuneField.classList.remove("show");

    tuneFile.required = false;

  } else {

    lyricsOnlyBtn.classList.remove("active");
    lyricsTuneBtn.classList.add("active");

    tuneField.classList.add("show");

    tuneFile.required = true;
  }

  updateSubmitState();
}


lyricsOnlyBtn.addEventListener("click", () => {
  setSubmissionType("lyrics");
});


lyricsTuneBtn.addEventListener("click", () => {
  setSubmissionType("tune");
});


/* =========================
   FILE DISPLAY
========================= */

tuneFile.addEventListener("change", () => {

  if (tuneFile.files.length > 0) {

    tuneFileName.textContent =
      `Selected: ${tuneFile.files[0].name}`;

    tuneUploadBox.classList.add("has-file");

  } else {

    tuneFileName.textContent = "";

    tuneUploadBox.classList.remove("has-file");
  }

  checkAttachmentSize();
  updateSubmitState();
});


supportFile.addEventListener("change", () => {

  if (supportFile.files.length > 0) {

    supportFileName.textContent =
      `Selected: ${supportFile.files[0].name}`;

    supportUploadBox.classList.add("has-file");

  } else {

    supportFileName.textContent = "";

    supportUploadBox.classList.remove("has-file");
  }

  checkAttachmentSize();
  updateSubmitState();
});


/* =========================
   TOTAL FILE SIZE
========================= */

function getTotalFileSize() {

  let totalSize = 0;

  if (tuneFile.files.length > 0) {
    totalSize += tuneFile.files[0].size;
  }

  if (supportFile.files.length > 0) {
    totalSize += supportFile.files[0].size;
  }

  return totalSize;
}


/* =========================
   FORMAT SIZE
========================= */

function formatFileSize(bytes) {

  return (
    bytes / (1024 * 1024)
  ).toFixed(2);
}


/* =========================
   CHECK ATTACHMENT SIZE
========================= */

function checkAttachmentSize() {

  const totalSize =
    getTotalFileSize();

  if (totalSize > MAX_TOTAL_FILE_SIZE) {

    attachmentSizeWarning.textContent =
      `Total attachment size is ` +
      `${formatFileSize(totalSize)} MB. ` +
      `Maximum allowed is 10 MB. ` +
      `Please remove or replace a file.`;

    attachmentSizeWarning.classList.add("show");

    return false;
  }

  attachmentSizeWarning.textContent = "";

  attachmentSizeWarning.classList.remove("show");

  return true;
}


/* =========================
   FIELD VALIDATION
========================= */

function validateField(
  element,
  groupId
) {

  const group =
    document.getElementById(groupId);

  const valid =
    element.value.trim() !== "";

  group.classList.toggle(
    "invalid",
    !valid
  );

  return valid;
}


/* =========================
   FORM VALIDATION
========================= */

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


/* =========================
   SUBMIT BUTTON
========================= */

function updateSubmitState() {

  submitBtn.disabled =
    !isFormValid();
}


/* =========================
   LIVE VALIDATION
========================= */

fullName.addEventListener("input", () => {

  validateField(
    fullName,
    "nameGroup"
  );

  updateSubmitState();
});


locationInput.addEventListener("input", () => {

  validateField(
    locationInput,
    "locationGroup"
  );

  updateSubmitState();
});


phone.addEventListener("input", () => {

  validateField(
    phone,
    "phoneGroup"
  );

  updateSubmitState();
});


lyrics.addEventListener("input", () => {

  validateField(
    lyrics,
    "lyricsGroup"
  );

  updateSubmitState();
});


agreement.addEventListener(
  "change",
  updateSubmitState
);


/* =========================
   FORM SUBMIT
========================= */

/* =========================================================
   BACKEND SUBMISSION
========================================================= */

form.addEventListener(
  "submit",
  async (event) => {

      event.preventDefault();


      if (!isFormValid()) {

          updateSubmitState();

          return;
      }


      /* ---------------------------------------------
         FINAL FILE SIZE CHECK
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
         SUBMIT STATE
      --------------------------------------------- */

      submitBtn.disabled =
          true;

      submitBtn.textContent =
          "Sending...";


      try {

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


          const response =
              await fetch(
                  "http://localhost:10000/api/anthems",
                  {
                      method:
                          "POST",

                      body:
                          formData
                  }
              );


          const result =
              await response.json();


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

          alert(
              "Your anthem submission was sent successfully!"
          );


          form.reset();


          tuneFileName.textContent =
              "";

          supportFileName.textContent =
              "";


          document
              .getElementById(
                  "tuneUploadBox"
              )
              ?.classList
              .remove(
                  "has-file"
              );


          document
              .getElementById(
                  "supportUploadBox"
              )
              ?.classList
              .remove(
                  "has-file"
              );


          updateSubmitState();

      } catch (error) {

          console.error(
              "Submission error:",
              error
          );


          alert(
              error.message ||
              "Unable to submit your anthem."
          );

      } finally {

          submitBtn.textContent =
              "Submit";


          updateSubmitState();
      }

  }
);



// form.addEventListener("submit", (event) => {

//   if (!checkAttachmentSize()) {

//     event.preventDefault();

//     return;
//   }

//   const nameValid =
//     validateField(
//       fullName,
//       "nameGroup"
//     );

//   const locationValid =
//     validateField(
//       locationInput,
//       "locationGroup"
//     );

//   const phoneValid =
//     validateField(
//       phone,
//       "phoneGroup"
//     );

//   const lyricsValid =
//     validateField(
//       lyrics,
//       "lyricsGroup"
//     );

//   const tuneValid =
//     submissionType === "lyrics" ||
//     tuneFile.files.length > 0;

//   const agreementValid =
//     agreement.checked;


//   if (
//     !nameValid ||
//     !locationValid ||
//     !phoneValid ||
//     !lyricsValid ||
//     !tuneValid ||
//     !agreementValid
//   ) {

//     event.preventDefault();

//     updateSubmitState();

//     return;
//   }


//   /*
//     Valid:
//     allow FormSubmit to submit normally.
//   */

//   submitBtn.disabled = true;

//   submitBtn.textContent =
//     "Submitting...";
// });


/* =========================
   INITIAL STATE
========================= */

setSubmissionType("lyrics");

updateSubmitState();