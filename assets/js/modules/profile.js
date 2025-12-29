// profile.js — profile picture + age + name (darker pastel circle)

import { updateGreeting } from "../app.js";

/* -----------------------------------------------------------
   STORAGE KEYS
----------------------------------------------------------- */

const PROFILE_PIC_KEY = "aura_profile_picture";
const PROFILE_AGE_KEY = "aura_profile_age";
const PROFILE_NAME_KEY = "aura_username";

/* -----------------------------------------------------------
   ELEMENTS
----------------------------------------------------------- */

let overlayEl;
let previewEl;
let uploadInput;
let ageInput;
let saveBtn;
let closeBtn;

/* -----------------------------------------------------------
   LOAD PROFILE
----------------------------------------------------------- */

function loadProfile() {
  // Load picture
  const pic = localStorage.getItem(PROFILE_PIC_KEY);
  if (pic) {
    previewEl.style.backgroundImage = `url(${pic})`;
  }

  // Load age
  const age = localStorage.getItem(PROFILE_AGE_KEY);
  if (age) {
    ageInput.value = age;
  }
}

/* -----------------------------------------------------------
   SAVE PROFILE
----------------------------------------------------------- */

function saveProfile() {
  // Save age
  const age = ageInput.value.trim();
  if (age) {
    localStorage.setItem(PROFILE_AGE_KEY, age);
  }

  // Ask for name change
  const newName = prompt("Enter your name (leave blank to keep current):");
  if (newName && newName.trim()) {
    localStorage.setItem(PROFILE_NAME_KEY, newName.trim());
    updateGreeting();
  }

  closeProfile();
}

/* -----------------------------------------------------------
   UPLOAD PICTURE
----------------------------------------------------------- */

function handlePictureUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataURL = reader.result;

    // Save to localStorage
    localStorage.setItem(PROFILE_PIC_KEY, dataURL);

    // Update preview
    previewEl.style.backgroundImage = `url(${dataURL})`;
  };

  reader.readAsDataURL(file);
}

/* -----------------------------------------------------------
   OPEN / CLOSE OVERLAY
----------------------------------------------------------- */

function closeProfile() {
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");
}

function initOverlayClose() {
  overlayEl.addEventListener("click", (evt) => {
    if (evt.target === overlayEl) closeProfile();
  });
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */

export function initProfile() {
  overlayEl = document.getElementById("profile-overlay");
  previewEl = document.getElementById("profile-preview");
  uploadInput = document.getElementById("profile-upload");
  ageInput = document.getElementById("profile-age");
  saveBtn = document.getElementById("profile-save");
  closeBtn = document.getElementById("profile-close");

  loadProfile();

  uploadInput.addEventListener("change", handlePictureUpload);
  saveBtn.addEventListener("click", saveProfile);
  closeBtn.addEventListener("click", closeProfile);

  initOverlayClose();
}
