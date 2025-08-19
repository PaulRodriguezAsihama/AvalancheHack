const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Verificando balance del deployer...\n");

  try {
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceInEther = ethers.formatEther(balance);
    const network = await ethers.provider.getNetwork();

    console.log(`🌐 Red: ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`👤 Dirección: ${deployer.address}`);
    console.log(`💎 Balance: ${balanceInEther} ETH`);

    if (parseFloat(balanceInEther) < 0.001) {
      console.log("\n⚠️  Balance muy bajo para despliegue");
      console.log("🔗 Obtén ETH de testnet:");
      console.log("   1. Sepolia Faucet: https://sepoliafaucet.com/");
      console.log("   2. Bridge a Arbitrum: https://bridge.arbitrum.io/");
    } else if (parseFloat(balanceInEther) < 0.01) {
      console.log("\n⚠️  Balance bajo, considera obtener más ETH");
    } else {
      console.log("\n✅ Balance suficiente para despliegue");
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
