const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../assets/images');

async function optimize() {
  console.log('Optimizing images...');

  // 1. Convert workout_hero.png to workout_hero.webp
  const heroPngPath = path.join(imagesDir, 'workout_hero.png');
  const heroWebpPath = path.join(imagesDir, 'workout_hero.webp');
  if (fs.existsSync(heroPngPath)) {
    console.log('Converting workout_hero.png to WebP...');
    await sharp(heroPngPath)
      .webp({ quality: 80 })
      .toFile(heroWebpPath);
    fs.unlinkSync(heroPngPath);
    console.log('workout_hero optimized successfully!');
  }

  // 2. Convert logo-glow.png to logo-glow.webp
  const logoPngPath = path.join(imagesDir, 'logo-glow.png');
  const logoWebpPath = path.join(imagesDir, 'logo-glow.webp');
  if (fs.existsSync(logoPngPath)) {
    console.log('Converting logo-glow.png to WebP...');
    await sharp(logoPngPath)
      .webp({ quality: 80 })
      .toFile(logoWebpPath);
    fs.unlinkSync(logoPngPath);
    console.log('logo-glow optimized successfully!');
  }

  // 3. Optimize icon.png in place
  const iconPath = path.join(imagesDir, 'icon.png');
  const tempIconPath = path.join(imagesDir, 'icon_temp.png');
  if (fs.existsSync(iconPath)) {
    console.log('Compressing icon.png in place...');
    await sharp(iconPath)
      .png({ quality: 80, compressionLevel: 8 })
      .toFile(tempIconPath);
    fs.unlinkSync(iconPath);
    fs.renameSync(tempIconPath, iconPath);
    console.log('icon.png optimized successfully!');
  }

  console.log('All image optimizations completed.');
}

optimize().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
