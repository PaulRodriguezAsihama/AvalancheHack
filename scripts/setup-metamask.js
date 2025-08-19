const fs = require("fs");
const path = require("path");

async function main() {
  const privateKey = process.argv[2];

  if (!privateKey) {
    console.log("❌ Error: Debes proporcionar tu clave privada");
    console.log("Uso: node scripts/setup-metamask.js TU_CLAVE_PRIVADA");
    return;
  }

  // Validar que la clave privada tenga 64 caracteres
  const cleanKey = privateKey.replace("0x", "");
  if (cleanKey.length !== 64) {
    console.log("❌ Error: La clave privada debe tener 64 caracteres");
    console.log(`Recibida: ${cleanKey.length} caracteres`);
    return;
  }

  console.log("🔧 Configurando tu MetaMask...\n");

  // Leer archivo .env actual
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = fs.readFileSync(envPath, "utf8");

  // Actualizar clave privada
  envContent = envContent.replace(/PRIVATE_KEY=.*/, `PRIVATE_KEY=${cleanKey}`);

  // Actualizar dirección
  envContent = envContent.replace(
    /DEPLOYER_ADDRESS=.*/,
    "DEPLOYER_ADDRESS=0xcbC7dED126CCa5882B2Cf22e92eCcb9F1724be76"
  );

  // Escribir archivo actualizado
  fs.writeFileSync(envPath, envContent);

  console.log("✅ Configuración actualizada:");
  console.log("   - PRIVATE_KEY: *** (configurada)");
  console.log(
    "   - DEPLOYER_ADDRESS: 0xcbC7dED126CCa5882B2Cf22e92eCcb9F1724be76"
  );

  console.log("\n🚀 Siguiente paso:");
  console.log("npm run quick-deploy");

  console.log("\n💰 Tu MetaMask tiene 0.02 ETH en Arbitrum Sepolia ✅");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
