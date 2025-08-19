const fs = require("fs");
const path = require("path");

console.log("🔄 CONFIGURANDO PARA USAR TU METAMASK DIRECTAMENTE\n");

console.log("📋 PASOS PARA OBTENER TU CLAVE PRIVADA:");
console.log("1. Abre MetaMask");
console.log("2. Click en el avatar (círculo superior derecha)");
console.log(
  "3. Selecciona tu cuenta: 0xcbC7dED126CCa5882B2Cf22e92eCcb9F1724be76"
);
console.log("4. Click en los 3 puntos (⋯) junto al nombre");
console.log("5. Click en 'Account details'");
console.log("6. Click en 'Show private key'");
console.log("7. Ingresa tu contraseña");
console.log("8. Copia la clave privada (64 caracteres)");

console.log("\n🔧 CONFIGURACIÓN AUTOMÁTICA:");
console.log("Una vez que tengas tu clave privada, ejecuta:");
console.log("node scripts/setup-metamask.js TU_CLAVE_PRIVADA_AQUI");

console.log("\n⚠️  IMPORTANTE:");
console.log("- NO compartas tu clave privada");
console.log("- Úsala solo para desarrollo/testnet");
console.log("- Tu MetaMask ya tiene 0.02 ETH en Arbitrum Sepolia ✅");
