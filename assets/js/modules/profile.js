const PROFILE_PIC_KEY = "aura_profile_picture";
const PROFILE_AGE_KEY = "aura_profile_age";
const PROFILE_NAME_KEY = "aura_username";

let overlayEl;
let previewEl;
let uploadInput;
let ageInput;
let saveBtn;
let closeBtn;

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function loadProfile() {
  const pic = localStorage.getItem(PROFILE_PIC_KEY);
  if (pic) {
    previewEl.style.backgroundImage = `url(${pic})`;
  }

  const age = localStorage.getItem(PROFILE_AGE_KEY);
  if (age) {
    ageInput.value = age;
  }
}

function saveProfile() {
  const age = ageInput.value.trim();
  if (age) {
    localStorage.setItem(PROFILE_AGE_KEY, age);
  }

  const newName = prompt("Enter your name (leave blank to keep current):");
  if (newName && newName.trim()) {
    localStorage.setItem(PROFILE_NAME_KEY, newName.trim());
  }

  vibrate(15);
  closeProfile();
}

function handlePictureUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataURL = reader.result;

    localStorage.setItem(PROFILE_PIC_KEY, dataURL);

    previewEl.style.backgroundImage = `url(${dataURL})`;
    vibrate(15);
  };

  reader.readAsDataURL(file);
}

function closeProfile() {
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");
  vibrate(10);
}

function initOverlayClose() {
  overlayEl.addEventListener("click", (evt) => {
    if (evt.target === overlayEl) closeProfile();
  });
}

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
