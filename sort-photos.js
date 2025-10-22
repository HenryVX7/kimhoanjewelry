#!/usr/bin/env node

/**
 * Interactive Photo Sorting Tool for Kim Hoan Jewelry
 *
 * This script helps you manually sort jewelry photos into categories:
 * - Rings
 * - Necklaces
 * - Earrings
 * - Pendants
 * - Bracelets
 *
 * Usage:
 *   node sort-photos.js
 *
 * The script will:
 * 1. Display each photo one by one
 * 2. Show you the filename
 * 3. Ask which category it belongs to
 * 4. Move the photo to the appropriate category folder
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const CONFIG = {
  photosDir: './Photos',
  categoriesDir: './Photos/categories',
  categories: ['Rings', 'Necklaces', 'Earrings', 'Pendants', 'Bracelets'],
  extensions: ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt user for input
 */
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Get all unsorted image files
 */
async function getUnsortedImages() {
  const files = await fs.readdir(CONFIG.photosDir, { withFileTypes: true });
  const imageFiles = [];

  for (const file of files) {
    if (file.isFile()) {
      const ext = path.extname(file.name);
      if (CONFIG.extensions.includes(ext)) {
        imageFiles.push(file.name);
      }
    }
  }

  return imageFiles.sort();
}

/**
 * Display category menu
 */
function displayMenu() {
  console.log('\n📂 Select a category:');
  CONFIG.categories.forEach((cat, index) => {
    console.log(`  ${index + 1}. ${cat}`);
  });
  console.log('  s. Skip this photo');
  console.log('  q. Quit sorting');
  console.log('  ?. Show photo filename again\n');
}

/**
 * Move photo to category folder
 */
async function movePhoto(filename, category) {
  const sourcePath = path.join(CONFIG.photosDir, filename);
  const destPath = path.join(CONFIG.categoriesDir, category, filename);

  await fs.rename(sourcePath, destPath);
  console.log(`✓ Moved to ${category}/`);
}

/**
 * Main sorting process
 */
async function sortPhotos() {
  console.log('🖼️  Kim Hoan Jewelry - Photo Sorting Tool\n');
  console.log('==========================================\n');

  try {
    // Get unsorted images
    const images = await getUnsortedImages();

    if (images.length === 0) {
      console.log('✓ No unsorted photos found! All photos have been categorized.\n');
      rl.close();
      return;
    }

    console.log(`Found ${images.length} unsorted photo(s)\n`);
    console.log('TIP: Open the Photos folder in your file browser to view images\n');
    console.log('Press Enter to start sorting...');
    await question('');

    let sorted = 0;
    let skipped = 0;

    for (let i = 0; i < images.length; i++) {
      const filename = images[i];

      console.clear();
      console.log('==========================================');
      console.log(`Photo ${i + 1} of ${images.length}`);
      console.log('==========================================\n');
      console.log(`📷 File: ${filename}`);
      console.log(`📁 Location: Photos/${filename}\n`);

      displayMenu();

      let validChoice = false;
      while (!validChoice) {
        const answer = await question('Your choice: ');
        const choice = answer.trim().toLowerCase();

        if (choice === 'q') {
          console.log(`\n✓ Sorting session ended. Sorted: ${sorted}, Skipped: ${skipped}\n`);
          rl.close();
          return;
        } else if (choice === 's') {
          console.log('⏭️  Skipped\n');
          skipped++;
          validChoice = true;
        } else if (choice === '?') {
          console.log(`\n📷 File: ${filename}\n`);
          displayMenu();
        } else {
          const categoryIndex = parseInt(choice) - 1;
          if (categoryIndex >= 0 && categoryIndex < CONFIG.categories.length) {
            await movePhoto(filename, CONFIG.categories[categoryIndex]);
            sorted++;
            validChoice = true;
            await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause
          } else {
            console.log('❌ Invalid choice. Please try again.\n');
          }
        }
      }
    }

    console.log('\n==========================================');
    console.log('✅ All photos processed!');
    console.log('==========================================\n');
    console.log(`📊 Summary:`);
    console.log(`  Sorted: ${sorted}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Total: ${images.length}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
sortPhotos();
