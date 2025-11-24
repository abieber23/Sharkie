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
