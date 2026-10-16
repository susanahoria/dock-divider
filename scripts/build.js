import { mkdir, rm, writeFile, copyFile, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process'; // correr terminal desde archivo js
import sharp from 'sharp'; // svg a png

import separators from '../src/separators.js';
import infoPlist from '../src/templates/infoPlist.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ICONS_DIR = join(ROOT, 'src', 'icons');
const TEMPLATES_DIR = join(ROOT, 'src', 'templates');
const DIST_DIR = join(ROOT, 'dist');
const TMP_DIR = join(DIST_DIR, '.tmp');

// macOS pide cada ícono en estos tamaños, en versión normal y @2x (pantallas Retina)
const ICON_SIZES = [16, 32, 128, 256, 512];

// SVG -> carpeta .iconset con todos los PNG -> archivo .icns
async function buildIcon(svgPath, icnsPath, id) {
  const iconset = join(TMP_DIR, `${id}.iconset`);
  await mkdir(iconset, { recursive: true });

  for (const size of ICON_SIZES) {
    await sharp(svgPath).resize(size, size).png().toFile(join(iconset, `icon_${size}x${size}.png`));
    await sharp(svgPath).resize(size * 2, size * 2).png().toFile(join(iconset, `icon_${size}x${size}@2x.png`));
  }

  // iconutil viene instalado en todos los Mac
  execFileSync('iconutil', ['-c', 'icns', iconset, '-o', icnsPath]);
}

// Arma la carpeta .app:
//   Nombre.app/Contents/Info.plist
//   Nombre.app/Contents/MacOS/launcher
//   Nombre.app/Contents/Resources/icon.icns
async function buildApp(separator) {
  const appDir = join(DIST_DIR, `${separator.name}.app`);
  const contents = join(appDir, 'Contents');
  const macosDir = join(contents, 'MacOS');
  const resourcesDir = join(contents, 'Resources');

  await mkdir(macosDir, { recursive: true });
  await mkdir(resourcesDir, { recursive: true });

  await writeFile(join(contents, 'Info.plist'), infoPlist(separator));

  const launcher = join(macosDir, 'launcher');
  await copyFile(join(TEMPLATES_DIR, 'launcher.sh'), launcher);
  await chmod(launcher, 0o755); // permiso para ejecutarse

  await buildIcon(join(ICONS_DIR, separator.icon), join(resourcesDir, 'icon.icns'), separator.id);
  execFileSync('xattr', ['-cr', appDir]); // borra etiquetas de imagenes si tienes sincronizado con icloud
  // Firma local ("ad-hoc") para que macOS no se queje al abrirla
  execFileSync('codesign', ['--sign', '-', '--force', appDir], { stdio: 'ignore' });

  console.log(`listop: ${separator.name}  (${separator.id})`);
}

async function main() {
  console.log('Haciendo la magía separadoristica');

  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR);

  for (const separator of separators) {
    await buildApp(separator);
  }

  await rm(TMP_DIR, { recursive: true, force: true });
  console.log(`Listo: ${separators.length} apps en dist/`);
}

main();
