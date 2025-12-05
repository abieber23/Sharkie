let btnMute = document.getElementById("mute");
let btnLoud = document.getElementById("loud");
let btnMuteMobile = document.getElementById("mute-mobile");
let btnLoudMobile = document.getElementById("loud-mobile");

let canvasElement = document.getElementById("canvas");
let hint = document.getElementById("fullscreenHint");

document.addEventListener("DOMContentLoaded", () => {
  loadMuteFromStorage();
});

/**
 * Toggles fullscreen mode for the application.
 * If the document is not currently in fullscreen,
 * it requests fullscreen mode by calling `enterFullscreen()`.
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    enterFullscreen();
  }
}

/**
 * Aktiviert den Vollbildmodus für das Canvas.
 * Prüft Standard-, WebKit- und MS-Fullscreen-Methoden.
 */

function enterFullscreen() {
  if (canvasElement.requestFullscreen) {
    canvasElement.requestFullscreen();
  } else if (canvasElement.webkitRequestFullscreen) {
    canvasElement.webkitRequestFullscreen();
  } else if (canvasElement.msRequestFullscreen) {
    canvasElement.msRequestFullscreen();
  }
}

/**
 * Toggles mute state for all sound elements.
 * Updates UI icons (desktop & mobile), saves state to localStorage,
 * applies mute to all sounds and the world instance if available.
 */
function toggleMute() {
    btnMute.classList.toggle("d-none");
    btnLoud.classList.toggle("d-none");
    if (btnMuteMobile && btnLoudMobile) {
      btnMuteMobile.classList.toggle("d-none");
      btnLoudMobile.classList.toggle("d-none");
    }
    const isMuted = !btnLoud.classList.contains("d-none");
    localStorage.setItem("isMuted", isMuted ? "1" : "0");
    for (let key in Sounds) {
      Sounds[key].muted = isMuted;
    }
    if (window.world && world.applyMuteState) {
      world.applyMuteState(isMuted);
    }
  }

  /**
 * Loads mute state from localStorage.
 * Updates UI icons and applies the stored mute state to all sounds.
 */
function loadMuteFromStorage() {
  const saved = localStorage.getItem("isMuted");
  const isMuted = saved === "1";
  if (isMuted) {
    btnLoud.classList.remove("d-none");
    btnMute.classList.add("d-none");
  } else {
    btnLoud.classList.add("d-none");
    btnMute.classList.remove("d-none");
  }
  for (let key in Sounds) {
    Sounds[key].muted = isMuted;
  }
}

/**
 * Opens the modal by activating the overlay element.
 */
function openModal() {
  document.getElementById("modal-overlay").classList.add("active");
}

/**
 * Closes the modal by deactivating the overlay element.
 */
function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

/**
 * Closes the modal when the overlay itself is clicked.
 */
function overlayClick(event) {
  if (event.target.id === "modal-overlay") {
    closeModal();
  }
}

/**
 * Checks device orientation and screen size.
 * Shows a rotate prompt on mobile devices in portrait mode.
 */
function checkOrientation() {
  const rotateScreen = document.getElementById("rotate-device");
  const isPortrait = window.innerHeight > window.innerWidth;
  const isMobile = window.innerWidth < 900;

  if (isPortrait && isMobile) {
    rotateScreen.style.display = "flex";
  } else {
    rotateScreen.style.display = "none";
  }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
checkOrientation();

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnJump = document.getElementById("btn-jump");
const btnShoot = document.getElementById("btn-shoot");
const btnSlap = document.getElementById("btn-slap");
const btnPause = document.getElementById("btn-pause");

/**
 * Adds press-and-hold behavior to a button.
 * Triggers `onDown` on press (mouse/touch) and `onUp` on release/leave.
 */
function holdButton(btn, onDown, onUp) {
  if (!btn) return;

  // Maus
  btn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    onDown();
  });
  btn.addEventListener("mouseup", (e) => {
    e.preventDefault();
    onUp();
  });
  btn.addEventListener("mouseleave", (e) => {
    e.preventDefault();
    onUp();
  });

  // Touch
  btn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      onDown();
    },
    { passive: false }
  );

  btn.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      onUp();
    },
    { passive: false }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof keyboard !== "undefined") {
    holdButton(
      btnLeft,
      () => (keyboard.LEFT = true),
      () => (keyboard.LEFT = false)
    );
    holdButton(
      btnRight,
      () => (keyboard.RIGHT = true),
      () => (keyboard.RIGHT = false)
    );
    holdButton(
      btnJump,
      () => (keyboard.UP = true),
      () => (keyboard.UP = false)
    );
    holdButton(
      btnShoot,
      () => (keyboard.SPACE = true),
      () => (keyboard.SPACE = false)
    );
    holdButton(
      btnSlap,
      () => (keyboard.ATTACK = true),
      () => (keyboard.ATTACK = false)
    );
    holdButton(btnPause, () => world.togglePause());
  }
});

const mobileControls = document.getElementById("mobile-controls");

  /**
 * Detects if the user is on a mobile device using UA and pointer type.
 * @returns {boolean} True if a mobile device is detected.
 */
function isMobileDevice() {
    return navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)
        || window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Shows or hides mobile controls based on device detection.
 */
  function updateMobileControls() {
    if (isMobileDevice()) {
        mobileControls.style.display = "block";
    } else {
        mobileControls.style.display = "none";
    }
}

window.addEventListener("resize", updateMobileControls);
updateMobileControls();

/**
 * Toggles visibility of the mobile menu between flex and none.
 */
function toggleMenu() {
    let menu = document.getElementById("mobile-menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
  

