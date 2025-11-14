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
