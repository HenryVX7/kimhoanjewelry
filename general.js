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

  document.addEventListener('DOMContentLoaded', function() {
    var toggleButton = document.getElementById('language-toggle');
  
    if (toggleButton) {
      toggleButton.addEventListener('click', function() {
        var englishText = document.getElementById('english');
        var vietnameseText = document.getElementById('vietnamese');
  
        if (englishText.style.display === 'none') {
          englishText.style.display = 'block';
          vietnameseText.style.display = 'none';
        } else {
          englishText.style.display = 'none';
          vietnameseText.style.display = 'block';
        }
      });
    }
  });
  
