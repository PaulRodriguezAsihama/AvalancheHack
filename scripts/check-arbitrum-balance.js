const { ethers } = require("ethers");

async function main() {
  console.log("💰 Verificando balance en Arbitrum Sepolia...\n");

  const provider = new ethers.JsonRpcProvider(
    "https://sepolia-rollup.arbitrum.io/rpc"
  );
  const address = "0x44f787B0B086Fe98D7eceed6C62d316F03180994";

  try {
    const balance = await provider.getBalance(address);
    const balanceInEther = ethers.formatEther(balance);

    console.log(`🌐 Red: Arbitrum Sepolia`);
    console.log(`👤 Dirección: ${address}`);
    console.log(`💎 Balance: ${balanceInEther} ETH`);

    if (parseFloat(balanceInEther) === 0) {
      console.log("\n❌ PROBLEMA: Esta wallet está vacía");
      console.log("\n💡 SOLUCIONES:");
      console.log("1. 💸 Envía ETH desde tu MetaMask:");
      console.log(`   Desde: 0xcbC7dED126CCa5882B2Cf22e92eCcb9F1724be76`);
      console.log(`   A: ${address}`);
      console.log("   Red: Arbitrum Sepolia");
      console.log("   Cantidad: 0.01 ETH");
      console.log("");
      console.log("2. 🔄 O cambiar a tu MetaMask original:");
      console.log("   - Obtén tu clave privada de MetaMask");
      console.log("   - Actualiza PRIVATE_KEY en .env");
      console.log(
        "   - Actualiza DEPLOYER_ADDRESS a 0xcbC7dED126CCa5882B2Cf22e92eCcb9F1724be76"
      );
    } else {
      console.log(`\n✅ Balance suficiente para despliegue`);
    }
  } catch (error) {
    console.error("❌ Error verificando balance:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
