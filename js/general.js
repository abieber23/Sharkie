let btnMute = document.getElementById("mute");
let btnLoud = document.getElementById("loud");

let canvasElement = document.getElementById("canvas"); // dein Spielcanvas
let hint = document.getElementById("fullscreenHint");

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } 
}

function enterFullscreen() {
    if (canvasElement.requestFullscreen) {
        canvasElement.requestFullscreen();
    } else if (canvasElement.webkitRequestFullscreen) { // Safari
        canvasElement.webkitRequestFullscreen();
    } else if (canvasElement.msRequestFullscreen) { // ältere IE
        canvasElement.msRequestFullscreen();
    }


}

function toggleMute() {
    btnMute.classList.toggle("d-none");
    btnLoud.classList.toggle("d-none");

    // WENN du zusätzlich Sound ein/aus machen möchtest:
    if (world) world.toggleMute?.();
}




function openModal() {
    document.getElementById('modal-overlay').classList.add('active');
  }
  
  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
  }
  
  function overlayClick(event) {
    // wenn außerhalb des Fensters geklickt → schließen
    if (event.target.id === 'modal-overlay') {
      closeModal();
    }
  }

  function checkOrientation() {
    const rotateScreen = document.getElementById('rotate-device');
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



const btnLeft  = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnJump  = document.getElementById('btn-jump');
const btnShoot = document.getElementById('btn-shoot');
const btnSlap = document.getElementById('btn-slap');
const btnPause = document.getElementById('btn-pause');

function holdButton(btn, onDown, onUp) {
    if (!btn) return;

    // Maus
    btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        onDown();
    });
    btn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        onUp();
    });
    btn.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        onUp();
    });

    // Touch
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onDown();
    }, { passive: false });

    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        onUp();
    }, { passive: false });
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof keyboard !== 'undefined') {
        holdButton(btnLeft,  () => keyboard.LEFT  = true, () => keyboard.LEFT  = false);
        holdButton(btnRight, () => keyboard.RIGHT = true, () => keyboard.RIGHT = false);
        holdButton(btnJump,  () => keyboard.UP    = true, () => keyboard.UP    = false);
        holdButton(btnShoot, () => keyboard.SPACE = true, () => keyboard.SPACE = false);
        holdButton(btnSlap, () => keyboard.ATTACK = true, () => keyboard.ATTACK = false);
        holdButton(btnPause, () => world.togglePause());
    }
});
