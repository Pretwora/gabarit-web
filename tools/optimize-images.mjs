// Сборка картинок сайта: оригиналы фотосъёмки → webp в assets/img/
// Запуск: node optimize-images.mjs (из папки tools/)
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHOTOS = path.join(ROOT, 'Разные фото');
const COLOR = path.join(ROOT, 'Цвет');
const GABARIT = 'E:/Projects/Gabarit';
const OUT = path.join(ROOT, 'assets', 'img');

// Отбор кадров (из 64 исходных). slug — имя файла на сайте.
const SELECTION = [
  // hero: стрелок в тёмном зале, драматичный свет
  { src: [PHOTOS, 'DSC04182.jpg'], slug: 'hero', widths: [1280, 2560] },
  // о клубе
  { src: [PHOTOS, '361A0547_ЧБ.jpg'], slug: 'about-trainer', widths: [800, 1600] },
  { src: [COLOR, 'DSC02440.JPG'], slug: 'about-bows', widths: [800, 1600] },
  // программы обучения
  { src: [PHOTOS, 'IMG_8375.JPG'], slug: 'program-start', widths: [800, 1600] },
  { src: [PHOTOS, 'DSC03623.JPG'], slug: 'program-level', widths: [800, 1600] },
  // галерея
  { src: [PHOTOS, '361A6925.JPG'], slug: 'gallery-01', widths: [800, 1600] },
  { src: [PHOTOS, 'DSC01186.jpg'], slug: 'gallery-02', widths: [800, 1600] },
  { src: [PHOTOS, 'DSCF0069.jpg'], slug: 'gallery-03', widths: [800, 1600] },
  { src: [PHOTOS, 'DSC08239.JPG'], slug: 'gallery-04', widths: [800, 1600] },
  { src: [PHOTOS, 'DSCF0556.JPG'], slug: 'gallery-05', widths: [800, 1600] },
  { src: [PHOTOS, 'IMG_8330.JPG'], slug: 'gallery-06', widths: [800, 1600] },
  { src: [COLOR, 'DSC02784.JPG'], slug: 'gallery-07', widths: [800, 1600] },
  { src: [PHOTOS, 'NA_AVU_3J6A5470.jpg'], slug: 'gallery-08', widths: [800, 1600] },
  { src: [PHOTOS, 'IMG_9553.JPG'], slug: 'gallery-09', widths: [800, 1600] },
  { src: [PHOTOS, 'DSC05597.JPG'], slug: 'gallery-10', widths: [800, 1600] },
];

// Скриншоты приложения (уже webp, только копируем)
const SCREENS = ['01-home', '07-counter', '12-celebration'];

await mkdir(OUT, { recursive: true });

for (const { src, slug, widths } of SELECTION) {
  const input = path.join(...src);
  for (const w of widths) {
    const out = path.join(OUT, `${slug}-${w}.webp`);
    const info = await sharp(input)
      .rotate() // EXIF-ориентация
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    console.log(`${slug}-${w}.webp  ${Math.round(info.size / 1024)} КБ  ${info.width}×${info.height}`);
  }
}

// Скриншоты приложения
for (const name of SCREENS) {
  await copyFile(path.join(GABARIT, 'presentation/v2/assets', `${name}.webp`), path.join(OUT, `screen-${name}.webp`));
  console.log(`screen-${name}.webp скопирован`);
}

// Логотип-знак
await copyFile(path.join(GABARIT, 'presentation/assets/card-logo.webp'), path.join(OUT, 'logo.webp'));
console.log('logo.webp скопирован');

// Favicon из векторного исходника
const svg = path.join(GABARIT, 'gabarit-tracker/assets/icon-source.svg');
await copyFile(svg, path.join(OUT, 'favicon.svg'));
for (const [size, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png']]) {
  await sharp(svg, { density: 300 }).resize(size, size).png().toFile(path.join(OUT, name));
  console.log(`${name} сгенерирован`);
}

console.log('Готово.');
