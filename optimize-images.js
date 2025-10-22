#!/usr/bin/env node

/**
 * Image Optimization Script for Kim Hoan Jewelry
 *
 * This script automatically optimizes images from a specific input folder:
 * - Converts JPG/PNG to WebP format (90% smaller)
 * - Creates responsive image sizes (mobile, tablet, desktop)
 * - Compresses original formats with quality optimization
 * - Preserves originals in Photos/originals backup folder
 *
 * Usage:
 *   npm install                         # Install dependencies first
 *   npm run optimize                    # Optimize all Photos (default)
 *   npm run optimize Photos/to-optimize # Optimize specific folder
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Get input directory from command line argument or use default
const customInputDir = process.argv[2];

// Configuration
const CONFIG = {
  inputDir: customInputDir || './Photos',
  outputDir: './Photos/optimized',
  backupDir: './Photos/originals',

  // Responsive breakpoints
  sizes: [
    { name: 'mobile', width: 800 },
    { name: 'tablet', width: 1200 },
    { name: 'desktop', width: 1920 }
  ],

  // Quality settings
  quality: {
    jpeg: 85,
    webp: 85,
    png: 90
  },

  // File extensions to process
  extensions: ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
};

/**
 * Get all image files recursively from a directory
 */
async function getImageFiles(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Skip already optimized and backup directories
      if (file.name === 'optimized' || file.name === 'originals') {
        continue;
      }
      await getImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file.name);
      if (CONFIG.extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Create necessary directories
 */
async function createDirectories() {
  await fs.mkdir(CONFIG.outputDir, { recursive: true });
  await fs.mkdir(CONFIG.backupDir, { recursive: true });
  console.log('✓ Created output directories');
}

/**
 * Backup original image
 */
async function backupOriginal(filePath) {
  const relativePath = path.relative(CONFIG.inputDir, filePath);
  const backupPath = path.join(CONFIG.backupDir, relativePath);
  const backupDir = path.dirname(backupPath);

  await fs.mkdir(backupDir, { recursive: true });
  await fs.copyFile(filePath, backupPath);
}

/**
 * Optimize a single image
 */
async function optimizeImage(filePath) {
  const relativePath = path.relative(CONFIG.inputDir, filePath);
  const filename = path.parse(filePath).name;
  const relativeDir = path.dirname(relativePath);
  const outputSubDir = path.join(CONFIG.outputDir, relativeDir);

  await fs.mkdir(outputSubDir, { recursive: true });

  console.log(`\nProcessing: ${relativePath}`);

  try {
    // Get image metadata
    const metadata = await sharp(filePath).metadata();
    const originalSize = (await fs.stat(filePath)).size;

    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB (${metadata.width}x${metadata.height})`);

    let totalSaved = 0;

    // Generate WebP versions at different sizes
    for (const size of CONFIG.sizes) {
      const outputPath = path.join(outputSubDir, `${filename}-${size.width}.webp`);

      await sharp(filePath)
        .resize(size.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: CONFIG.quality.webp })
        .toFile(outputPath);

      const newSize = (await fs.stat(outputPath)).size;
      totalSaved += (originalSize - newSize);

      console.log(`  ✓ Created ${size.name} WebP: ${(newSize / 1024).toFixed(0)}KB`);
    }

    // Create optimized JPEG/PNG fallback (original size)
    const ext = path.extname(filePath).toLowerCase();
    const isPng = ext === '.png';
    const fallbackPath = path.join(outputSubDir, `${filename}${isPng ? '.png' : '.jpg'}`);

    const sharpInstance = sharp(filePath);

    if (isPng) {
      await sharpInstance
        .png({ quality: CONFIG.quality.png, compressionLevel: 9 })
        .toFile(fallbackPath);
    } else {
      await sharpInstance
        .jpeg({ quality: CONFIG.quality.jpeg, mozjpeg: true })
        .toFile(fallbackPath);
    }

    const fallbackSize = (await fs.stat(fallbackPath)).size;
    totalSaved += (originalSize - fallbackSize);

    console.log(`  ✓ Created optimized ${isPng ? 'PNG' : 'JPEG'}: ${(fallbackSize / 1024).toFixed(0)}KB`);
    console.log(`  💾 Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB (${((totalSaved / originalSize) * 100).toFixed(1)}%)`);

    return { original: originalSize, saved: totalSaved };

  } catch (error) {
    console.error(`  ✗ Error processing ${relativePath}:`, error.message);
    return { original: 0, saved: 0 };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Kim Hoan Jewelry - Image Optimization Tool\n');
  console.log('================================================\n');

  try {
    // Display input directory
    console.log(`📂 Input directory: ${CONFIG.inputDir}\n`);

    // Create directories
    await createDirectories();

    // Get all image files
    console.log('📁 Scanning for images...');
    const imageFiles = await getImageFiles(CONFIG.inputDir);
    console.log(`✓ Found ${imageFiles.length} images to process\n`);

    if (imageFiles.length === 0) {
      console.log('No images found to optimize.');
      console.log(`\n💡 Tip: Place images in ${CONFIG.inputDir} to optimize them.`);
      return;
    }

    // Ask for confirmation
    console.log('This will:');
    console.log('  1. Backup originals to Photos/originals/');
    console.log('  2. Create optimized versions in Photos/optimized/');
    console.log('  3. Generate WebP + responsive sizes for each image\n');

    // Process all images
    let totalOriginalSize = 0;
    let totalSaved = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const filePath = imageFiles[i];

      // Backup original
      await backupOriginal(filePath);

      // Optimize
      const result = await optimizeImage(filePath);
      totalOriginalSize += result.original;
      totalSaved += result.saved;

      console.log(`\nProgress: ${i + 1}/${imageFiles.length} complete`);
    }

    // Summary
    console.log('\n================================================');
    console.log('✅ OPTIMIZATION COMPLETE!\n');
    console.log(`📊 Summary:`);
    console.log(`  Images processed: ${imageFiles.length}`);
    console.log(`  Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Reduction: ${((totalSaved / totalOriginalSize) * 100).toFixed(1)}%`);
    console.log('\n📁 Next steps:');
    console.log('  1. Review optimized images in Photos/optimized/');
    console.log('  2. Update HTML <img> tags to use responsive images');
    console.log('  3. Test website performance');
    console.log('  4. Originals backed up in Photos/originals/\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
