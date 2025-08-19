const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔧 Configuración Inicial del Proyecto\n");

  const envPath = path.join(__dirname, "..", ".env");
  const envExamplePath = path.join(__dirname, "..", ".env.example");

  // Verificar si ya existe .env
  if (fs.existsSync(envPath)) {
    console.log("📄 Archivo .env ya existe");
    console.log(
      "⚠️  Por favor configura manualmente las siguientes variables:"
    );
    console.log("   - PRIVATE_KEY (clave privada de tu wallet SIN prefijo 0x)");
    console.log(
      "   - ARBISCAN_API_KEY (obten uno gratis en https://arbiscan.io/apis)"
    );
    console.log("   - DEPLOYER_ADDRESS (dirección de tu wallet)");
    console.log("\n📋 Usa SETUP_INSTRUCTIONS.md para guía detallada");
    return;
  }

  console.log("🔑 Generando wallet de desarrollo...");

  // Generar wallet de desarrollo
  const wallet = ethers.Wallet.createRandom();

  console.log("✅ Wallet generada:");
  console.log(`   Dirección: ${wallet.address}`);
  console.log(`   Clave Privada: ${wallet.privateKey.substring(2)}`); // Sin prefijo 0x

  // Leer plantilla .env.example
  let envContent = fs.readFileSync(envExamplePath, "utf8");

  // Reemplazar valores
  envContent = envContent.replace(
    "your_private_key_here",
    wallet.privateKey.substring(2)
  );
  envContent = envContent.replace("your_deployer_address_here", wallet.address);
  envContent = envContent.replace(
    "your_arbiscan_api_key_here",
    "PLEASE_GET_FROM_ARBISCAN"
  );

  // Escribir archivo .env
  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ Archivo .env creado exitosamente");
  console.log("\n⚠️  IMPORTANTE:");
  console.log("1. 📝 Edita el archivo .env y agrega tu ARBISCAN_API_KEY");
  console.log("   - Ve a: https://arbiscan.io/apis");
  console.log("   - Crea cuenta gratuita y genera API Key");

  console.log("\n2. 💰 Obtén ETH de testnet para esta dirección:");
  console.log(`   ${wallet.address}`);
  console.log("   - Sepolia Faucet: https://sepoliafaucet.com/");
  console.log("   - Bridge a Arbitrum: https://bridge.arbitrum.io/");

  console.log("\n3. 🚀 Una vez configurado, ejecuta:");
  console.log("   npm run setup");
  console.log("   npm run deploy:arbitrum-sepolia");

  console.log("\n⚠️  NOTA DE SEGURIDAD:");
  console.log("   Esta wallet es SOLO para desarrollo/testnet");
  console.log("   NUNCA uses esta clave en mainnet con fondos reales");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
