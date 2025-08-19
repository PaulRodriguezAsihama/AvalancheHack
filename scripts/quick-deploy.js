const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 DESPLIEGUE RÁPIDO EN ARBITRUM SEPOLIA\n");

  // Verificar conexión y balance
  try {
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceInEther = ethers.formatEther(balance);
    const network = await ethers.provider.getNetwork();

    console.log(`🌐 Red: ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`💎 Balance: ${balanceInEther} ETH`);

    if (parseFloat(balanceInEther) === 0) {
      console.log("\n❌ ERROR: No tienes ETH en esta red");
      console.log("🔗 Obtén ETH de testnet:");
      console.log("   1. Ve a: https://sepoliafaucet.com/");
      console.log("   2. Solicita ETH para Sepolia");
      console.log("   3. Bridge a Arbitrum: https://bridge.arbitrum.io/");
      console.log(`   4. Envía a: ${deployer.address}`);
      return;
    }

    if (parseFloat(balanceInEther) < 0.001) {
      console.log("\n⚠️  Balance muy bajo, considera obtener más ETH");
    }
  } catch (error) {
    console.error("❌ Error conectando a la red:", error.message);
    return;
  }

  console.log("\n📋 ¿Quieres continuar con el despliegue? (y/n)");

  // En desarrollo, procedemos automáticamente
  console.log("✅ Procediendo con el despliegue...\n");

  try {
    // Compilar contratos
    console.log("🔨 Compilando contratos...");
    const { execSync } = require("child_process");
    execSync("npx hardhat compile", { stdio: "inherit" });

    // Ejecutar script de despliegue
    console.log("\n🚀 Desplegando contratos...");
    execSync("npx hardhat run scripts/deploy.js --network arbitrumSepolia", {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("❌ Error durante el despliegue:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
