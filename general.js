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
  const label = document.getElementById('language-label');
  // var savedLanguage = localStorage.getItem('language');

  function showEnglish() {
    englishText.forEach(el => el.style.display = 'block');
    vietnameseText.forEach(el => el.style.display = 'none');
    label.textContent = 'EN';
    localStorage.setItem('language', 'english');
  }

  function showVietnamese() {
    englishText.forEach(el => el.style.display = 'none');
    vietnameseText.forEach(el => el.style.display = 'block');
    label.textContent = 'VN';
    localStorage.setItem('language', 'vietnamese');
  }

  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage === 'vietnamese') {
    showVietnamese();
  } else {
    showEnglish();
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      const isEnglishVisible = englishText[0].style.display !== 'none';
      if (isEnglishVisible) {
        showVietnamese();
      } else {
        showEnglish();
      }
    });
  }

  //   if (savedLanguage === 'vietnamese') {
  //       englishText.forEach(function(el) {
  //         el.style.display = 'none';
  //       });
  //       vietnameseText.forEach(function(el) {
  //         el.style.display = 'block';
  //         label.textContent = "VN";
  //       });
  //     } else {
  //       englishText.forEach(function(el) {
  //         el.style.display = 'block';
  //         label.textContent = "EN";
  //       });
  //       vietnameseText.forEach(function(el) {
  //         el.style.display = 'none';
  //       });
  // }

  // if (toggleButton) {
  //   toggleButton.addEventListener('click', function() {
  //     englishText.forEach(el => {
  //         el.style.display = (el.style.display === 'none') ? 'block' : 'none';
  //         label.textContent = "EN";
  //     });

  //     vietnameseText.forEach(el => {
  //         el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
  //         label.textContent = "VN";
  //     });

  //     var newLanguage = (englishText[0].style.display === 'none') ? 'vietnamese' : 'english';
  //     localStorage.setItem('language', newLanguage);
  //   });
  // }
});
  
