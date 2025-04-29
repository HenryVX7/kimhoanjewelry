"use strict";

// Menu Button
function toggleMenu() {
    const nav = document.getElementById('sidebar');
    nav.classList.toggle('open');
}

// Enlarge image
function openModel(src) {
    const model = document.getElementById('imageModel');
    const modelImg = document.getElementById('modelImg');
    model.style.display = "block";
    modelImg.src = src;
}

function closeModel() {
    document.getElementById('imageModel').style.display = "none";
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
      closeModel();
    }
  });

// Language Toggle
document.addEventListener('DOMContentLoaded', function() {
  var toggleButton = document.getElementById('language-toggle');

  var englishText = document.querySelectorAll('#english');
  var vietnameseText = document.querySelectorAll('#vietnamese');
  var savedLanguage = localStorage.getItem('language');

    if (savedLanguage === 'vietnamese') {
        englishText.forEach(function(el) {
          el.style.display = 'none';
        });
        vietnameseText.forEach(function(el) {
          el.style.display = 'block';
        });
      } else {
        englishText.forEach(function(el) {
          el.style.display = 'block';
        });
        vietnameseText.forEach(function(el) {
          el.style.display = 'none';
        });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      englishText.forEach(el => {
          el.style.display = (el.style.display === 'none') ? 'block' : 'none';
      });

      vietnameseText.forEach(el => {
          el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
      });

      var newLanguage = (englishText[0].style.display === 'none') ? 'vietnamese' : 'english';
      localStorage.setItem('language', newLanguage);
    });
  }
});
  
