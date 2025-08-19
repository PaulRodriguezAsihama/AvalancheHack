const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando configuración del entorno...\n");

  // Verificar variables de entorno
  const requiredEnvVars = [
    "PRIVATE_KEY",
    "ARBISCAN_API_KEY",
    "DEPLOYER_ADDRESS",
  ];

  const missingVars = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.log("❌ Variables de entorno faltantes:");
    missingVars.forEach((envVar) => {
      console.log(`   - ${envVar}`);
    });
    console.log("\n📋 Por favor, configura tu archivo .env");
    console.log("💡 Revisa SETUP_INSTRUCTIONS.md para más detalles");
    return;
  }

  console.log("✅ Variables de entorno configuradas correctamente");

  // Verificar conexión a red
  try {
    const network = await ethers.provider.getNetwork();
    console.log(
      `✅ Conectado a red: ${network.name} (Chain ID: ${network.chainId})`
    );
  } catch (error) {
    console.log("❌ Error conectando a la red:", error.message);
    return;
  }

  // Verificar balance del deployer
  try {
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceInEther = ethers.formatEther(balance);

    console.log(`✅ Dirección del deployer: ${deployer.address}`);
    console.log(`✅ Balance: ${balanceInEther} ETH`);

    if (parseFloat(balanceInEther) < 0.01) {
      console.log("⚠️  Balance bajo. Considera obtener más ETH de testnet");
      console.log("🌐 Faucet: https://sepoliafaucet.com/");
      console.log("🌉 Bridge: https://bridge.arbitrum.io/");
    }
  } catch (error) {
    console.log("❌ Error verificando balance:", error.message);
    return;
  }

  // Verificar compilación
  try {
    console.log("\n🔨 Verificando compilación...");
    const { execSync } = require("child_process");
    execSync("npx hardhat compile", { stdio: "pipe" });
    console.log("✅ Contratos compilados correctamente");
  } catch (error) {
    console.log("❌ Error en compilación:", error.message);
    return;
  }

  console.log("\n🚀 ¡Sistema listo para despliegue!");
  console.log("📝 Siguiente paso: npm run deploy:arbitrum-sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
