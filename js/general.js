let btnMute = document.getElementById("mute");
let btnLoud = document.getElementById("loud");

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
