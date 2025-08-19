const { ethers } = require("ethers");

// Generar una clave privada temporal para testing
const wallet = ethers.Wallet.createRandom();

console.log("🔑 CLAVE PRIVADA TEMPORAL PARA TESTING:");
console.log("=====================================");
console.log(`Clave Privada: ${wallet.privateKey.substring(2)}`);
console.log(`Dirección: ${wallet.address}`);
console.log("=====================================");
console.log("");
console.log("⚠️  IMPORTANTE: Esta es una wallet NUEVA y vacía");
console.log("💰 Necesitas enviar ETH de tu MetaMask a esta dirección");
console.log("");
console.log("📝 PASOS:");
console.log("1. Copia la clave privada (sin 0x)");
console.log("2. Pégala en el archivo .env");
console.log("3. Envía 0.01 ETH desde tu MetaMask a la nueva dirección");
console.log("4. Ejecuta: npm run quick-deploy");
console.log("");
console.log("💡 O usa la OPCIÓN 2 para usar tu MetaMask directamente");
