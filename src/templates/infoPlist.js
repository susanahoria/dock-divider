// Genera el Info.plist de una app: la "ficha" que macOS lee para saber
// cómo se llama, qué ejecutar y qué ícono mostrar.
// Funciona como un componente: recibe props y devuelve texto.

export default function infoPlist({ id, name }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
      <key>CFBundleName</key>
      <string>${name}</string>

      <key>CFBundleId</key>
      <string>local.dock-separadores.${id}</string>

      <key>CFBundleExecutable</key>
      <string>launcher</string>

      <key>CFBundleIconFile</key>
      <string>icon</string>

      <key>CFBundlePackageType</key>
      <string>APPL</string>

      <key>CFBundleVersion</key>
      <string>1.0</string>

      <!-- No aparece en el Dock como app abierta ni muestra menús -->
      <key>LSUIElement</key>
      <true/>
      <key>LSBackgroundOnly</key>
      <true/>
    </dict>
    </plist>
  `;
}
