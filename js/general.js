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

function enterFullscreen() {
  if (canvasElement.requestFullscreen) {
    canvasElement.requestFullscreen();
  } else if (canvasElement.webkitRequestFullscreen) {
    canvasElement.webkitRequestFullscreen();
  } else if (canvasElement.msRequestFullscreen) {
    canvasElement.msRequestFullscreen();
  }
}


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

function openModal() {
  document.getElementById("modal-overlay").classList.add("active");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

function overlayClick(event) {
  if (event.target.id === "modal-overlay") {
    closeModal();
  }
}

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

  
function isMobileDevice() {
    return navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)
        || window.matchMedia("(pointer: coarse)").matches;
}


  function updateMobileControls() {
    if (isMobileDevice()) {
        mobileControls.style.display = "block";
    } else {
        mobileControls.style.display = "none";
    }
}

window.addEventListener("resize", updateMobileControls);
updateMobileControls();

function toggleMenu() {
    let menu = document.getElementById("mobile-menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
  

