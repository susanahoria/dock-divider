# dock-divider

Separadores para el Dock de macOS. Cada separador es una mini app que **no hace nada**: solo tiene un ícono lindo y, si la abres sin querer, se cierra al instante.

## Uso

```bash
npm install        # instala sharp (convierte SVG a PNG)
npm start          # build + install-apps  (corre este para que complicarse la vidaaaaa)
```

O por separado:

```bash
npm run build          # genera las apps en dist/
npm run install-apps   # las copia a ~/Applications/Separadores Dock
```

Después arrastra las que quieras desde Finder al Dock :).

## Estructura

```
dock-separadores/
├── package.json
├── src/
│   ├── separators.js        ← lista de separadores (como un array de datos)
│   ├── icons/               ← los dibujos en SVG
│   │   ├── star8bits.svg
│   └── templates/
│       ├── infoPlist.js     ← genera la "ficha" de cada app
│       └── launcher.sh      ← el programa que no hace nada
├── scripts/
│   ├── build.js             ← arma las apps en dist/
│   └── install.js           ← las copia a ~/Applications
└── dist/
```
### Info.plist

Las claves importantes son:

- `CFBundleName`: el nombre que aparece al pasar el mouse.
- `CFBundleExecutable`: qué archivo de `MacOS/` ejecutar.
- `CFBundleIconFile`: qué ícono de `Resources/` usar.
- `LSUIElement` y `LSBackgroundOnly`: hacen que la app sea invisible al abrirse, sin ventana y sin menú :).

### launcher

```sh
#!/bin/sh
exit 0
```

La primera línea dice "esto es un script de terminal". La segunda dice "termina sin error". La app se abre y se cierra.

### icon.icns

macOS necesita el ícono en varios tamaños, de 16px a 1024px. `build.js` toma cada SVG y hace esto:

1. Lo convierte a PNG en cada tamaño con [sharp](https://sharp.pixelplumbing.com/).
2. Los junta en una carpeta `.iconset`.
3. La convierte a `.icns` con `iconutil`, instalado por defecto en el Mac.

## Agregar un separador nuevo

1. Dibuja/descarga el SVG y guárdalo en `src/icons/`, por ejemplo `x.svg`. Usa `viewBox="0 0 1024 1024"` y fondo transparente o con fondo, como quieras.
2. Agrégalo a `src/separators.js`:
   ```js
   { id: 'x', name: 'icono bonito', icon: 'x.svg' },
   ```
3. Corre `npm start`.

## Notas

- Si borras la carpeta `~/Applications/Separadores Dock`, los separadores desaparecen del Dock.
- Si cambias un ícono y el Dock sigue mostrando el antiguo, saca el separador del Dock y vuelve a arrastrarlo :c.
