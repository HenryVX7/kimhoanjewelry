"use strict";

// Menu Button
function toggleMenu() {
  const nav = document.getElementById('sidebar');
  nav.classList.toggle('open');
}

// Enlarge image
// Image loading state tracker
let currentOpenModelSrc = null;

// Enlarge image
function openModel(src) {
  const model = document.getElementById('imageModel');
  const modelImg = document.getElementById('modelImg');

  // Show modal immediately
  model.style.display = "flex";

  // Hide image immediately to prevent "flash of old content"
  modelImg.style.opacity = "0";
  // CRITICAL: Clear the source so the old image absolutely cannot render
  modelImg.src = "";

  // Track the current request
  currentOpenModelSrc = src;

  // Preload image for smooth transition
  const newImg = new Image();
  newImg.onload = function () {
    // Only update if this is still the latest request
    if (currentOpenModelSrc === src) {
      modelImg.src = src;
      modelImg.style.opacity = "1";
    }
  };
  newImg.src = src;
}

function closeModel() {
  document.getElementById('imageModel').style.display = "none";
}

document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    closeModel();
  }
});

// Language Toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggleButton = document.getElementById('language-toggle');

  var englishText = document.querySelectorAll('#english');
  var vietnameseText = document.querySelectorAll('#vietnamese');
  const label = document.getElementById('language-label');

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
});

// Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    observer.observe(section);
  });
});

