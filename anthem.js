/* =========================
       ELEMENTS
    ========================= */

const form = document.getElementById("anthemForm");

const lyricsOnlyBtn = document.getElementById("lyricsOnlyBtn");

const lyricsTuneBtn = document.getElementById("lyricsTuneBtn");

const tuneField = document.getElementById("tuneField");

const tuneFile = document.getElementById("tuneFile");

const tuneFileName = document.getElementById("tuneFileName");

const supportFile = document.getElementById("supportFile");

const supportFileName = document.getElementById("supportFileName");

const agreement = document.getElementById("agreement");

const submitBtn = document.getElementById("submitBtn");

const fullName = document.getElementById("fullName");

const locationInput = document.getElementById("location");

const phone = document.getElementById("phone");

const lyrics = document.getElementById("lyrics");

/* =========================
       SUBMISSION TYPE
    ========================== */

let submissionType = "lyrics";

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
    ========================== */

tuneFile.addEventListener("change", () => {
  if (tuneFile.files.length > 0) {
    tuneFileName.textContent = `Selected: ${tuneFile.files[0].name}`;

    document.getElementById("tuneUploadBox").classList.add("has-file");
  } else {
    tuneFileName.textContent = "";

    document.getElementById("tuneUploadBox").classList.remove("has-file");
  }

  updateSubmitState();
});

supportFile.addEventListener("change", () => {
  if (supportFile.files.length > 0) {
    supportFileName.textContent = `Selected: ${supportFile.files[0].name}`;

    document.getElementById("supportUploadBox").classList.add("has-file");
  } else {
    supportFileName.textContent = "";

    document.getElementById("supportUploadBox").classList.remove("has-file");
  }
});

/* =========================
       VALIDATION
    ========================== */

function isFormValid() {
  const baseFieldsFilled =
    fullName.value.trim() !== "" &&
    locationInput.value.trim() !== "" &&
    phone.value.trim() !== "" &&
    lyrics.value.trim() !== "";

  const agreementChecked = agreement.checked;

  const tuneValid = submissionType === "lyrics" || tuneFile.files.length > 0;

  return baseFieldsFilled && agreementChecked && tuneValid;
}

function updateSubmitState() {
  submitBtn.disabled = !isFormValid();
}

/* =========================
       LIVE VALIDATION
    ========================== */

[fullName, locationInput, phone, lyrics, agreement].forEach((element) => {
  element.addEventListener("input", updateSubmitState);

  element.addEventListener("change", updateSubmitState);
});

/* =========================
       EMAIL BODY
    ========================== */

function buildEmailBody() {
  const name = fullName.value.trim();

  const from = locationInput.value.trim();

  const phoneNumber = phone.value.trim();

  const lyricText = lyrics.value.trim();

  const tune =
    submissionType === "tune"
      ? tuneFile.files.length > 0
        ? tuneFile.files[0].name
        : "Not attached"
      : "Lyrics Only";

  const supportingFile =
    supportFile.files.length > 0 ? supportFile.files[0].name : "None";

  return `
Anthems Season 1 Submission

----------------------------------------

Submission Type:
${submissionType === "tune" ? "Lyrics & Tune" : "Lyrics Only"}

Full Name:
${name}

Where are you from:
${from}

Phone Number:
${phoneNumber}

----------------------------------------

Lyrics:

${lyricText}

----------------------------------------

Tune / Audio File:
${tune}

Supporting File:
${supportingFile}

----------------------------------------

Submission Agreement:
The submitter agrees that this work is their own and gives Yireh Ministry permission to review it for possible use.
        `.trim();
}

/* =========================
       SUBMIT
    ========================== */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isFormValid()) {
    updateSubmitState();
    return;
  }

  const recipient = "raviray66667@gmail.com";

  const subject =
    submissionType === "tune"
      ? `Anthems Season 1 - Lyrics & Tune Submission - ${fullName.value.trim()}`
      : `Anthems Season 1 - Lyrics Submission - ${fullName.value.trim()}`;

  const body = buildEmailBody();

  const gmailUrl =
    "https://mail.google.com/mail/?view=cm&fs=1" +
    "&to=" +
    encodeURIComponent(recipient) +
    "&su=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);

  window.open(gmailUrl, "_blank", "noopener,noreferrer");
});

/* =========================
       INITIAL STATE
    ========================== */

setSubmissionType("lyrics");
updateSubmitState();
