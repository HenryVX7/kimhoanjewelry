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
  
    var englishText = document.querySelectorAll('#english');
    var vietnameseText = document.querySelectorAll('#vietnamese');
    var savedLanguage = localStorage.getItem('language');

    if (savedLanguage === 'vietnamese') {
        englishTexts.forEach(function(el) {
          el.style.display = 'none';
        });
        vietnameseTexts.forEach(function(el) {
          el.style.display = 'block';
        });
      } else {
        englishTexts.forEach(function(el) {
          el.style.display = 'block';
        });
        vietnameseTexts.forEach(function(el) {
          el.style.display = 'none';
        });
      }

    if (toggleButton) {
      toggleButton.addEventListener('click', function() {
        englishText.forEach(el => {
            el.style.display = (el.style.display === 'none') ? 'contents' : 'none';
        });

        vietnameseText.forEach(el => {
            el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'contents' : 'none';
        });

        var newLanguage = (englishTexts[0].style.display === 'none') ? 'vietnamese' : 'english';
        localStorage.setItem('language', newLanguage);
      });
    }
  });
  
