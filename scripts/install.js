// para que no rompan los separadores actuales en caso de tener uno y querer agregar otro

import { cp, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const DIST_DIR = fileURLToPath(new URL('../dist', import.meta.url));
const TARGET_DIR = join(homedir(), 'Applications', 'Separadores Dock');

async function main() {
  const apps = (await readdir(DIST_DIR).catch(() => [])).filter((file) => file.endsWith('.app'));

  if (apps.length === 0) {
    console.error('No hay apps en dist/. Corre primero: npm run build');
    process.exit(1);
  }

  await mkdir(TARGET_DIR, { recursive: true });

  for (const app of apps) {
    await cp(join(DIST_DIR, app), join(TARGET_DIR, app), { recursive: true, force: true });
    console.log(`separador: ${app}`);
  }

  console.log(`Tu separador en: ${TARGET_DIR}`);
  execFileSync('open', [TARGET_DIR]);
}

main();
