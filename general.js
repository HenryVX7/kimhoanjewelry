"use strict";

// General
function toggleMenu() {
    const nav = document.getElementById('sidebar');
    nav.classList.toggle('open');
}


function openModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = "block";
    modalImg.src = src;
}

function closeModal() {
    document.getElementById('imageModal').style.display = "none";
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
  