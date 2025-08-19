const { ethers } = require("ethers");

async function checkBalance(rpcUrl, networkName, address) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(address);
    const balanceInEther = ethers.formatEther(balance);
    const network = await provider.getNetwork();

    console.log(`🌐 ${networkName}:`);
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Balance: ${balanceInEther} ETH`);
    console.log(
      `   Status: ${
        parseFloat(balanceInEther) > 0 ? "✅ Tiene fondos" : "❌ Sin fondos"
      }`
    );
    console.log("");

    return parseFloat(balanceInEther);
  } catch (error) {
    console.log(`❌ ${networkName}: Error conectando - ${error.message}`);
    console.log("");
    return 0;
  }
}

async function main() {
  console.log("🔍 VERIFICANDO BALANCE DE TU WALLET METAMASK\n");

  const address = "0xcbC7dED126CCa5882B2Cf22e92eCcb9F1724be76";
  console.log(`👤 Tu dirección MetaMask: ${address}\n`);

  const networks = [
    {
      name: "Ethereum Sepolia",
      rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    },
    {
      name: "Arbitrum Sepolia",
      rpc: "https://sepolia-rollup.arbitrum.io/rpc",
    },
    {
      name: "Arbitrum One",
      rpc: "https://arb1.arbitrum.io/rpc",
    },
    {
      name: "Ethereum Mainnet",
      rpc: "https://ethereum-rpc.publicnode.com",
    },
  ];

  let totalFound = 0;
  const foundNetworks = [];

  for (const network of networks) {
    const balance = await checkBalance(network.rpc, network.name, address);
    if (balance > 0) {
      totalFound += balance;
      foundNetworks.push({ name: network.name, balance });
    }
  }

  console.log("📊 RESUMEN:");
  if (foundNetworks.length > 0) {
    console.log("✅ ETH encontrado en:");
    foundNetworks.forEach((net) => {
      console.log(`   - ${net.name}: ${net.balance} ETH`);
    });

    if (foundNetworks.some((net) => net.name === "Arbitrum Sepolia")) {
      console.log("\n🚀 ¡Perfecto! Tienes ETH en Arbitrum Sepolia");
      console.log("📝 Siguiente paso: Configurar tu clave privada en .env");
    } else if (foundNetworks.some((net) => net.name === "Ethereum Sepolia")) {
      console.log("\n🌉 Tienes ETH en Sepolia. Opciones:");
      console.log("1. Bridge a Arbitrum Sepolia: https://bridge.arbitrum.io/");
      console.log(
        "2. O usar tu clave privada y desplegar directamente en Sepolia"
      );
    } else {
      console.log("\n💡 Tienes ETH pero necesitas en testnet para desarrollo");
    }
  } else {
    console.log("❌ No se encontró ETH en esta wallet");
    console.log("\n🔗 Opciones:");
    console.log("1. Obtener ETH de testnet: https://sepoliafaucet.com/");
    console.log("2. Bridge a Arbitrum: https://bridge.arbitrum.io/");
    console.log("3. Usar otra wallet que tenga ETH");
  }

  console.log("\n🔑 PARA CONFIGURAR TU WALLET:");
  console.log("1. Exporta tu clave privada de MetaMask");
  console.log("2. Edita el archivo .env");
  console.log("3. Reemplaza PRIVATE_KEY y DEPLOYER_ADDRESS");
  console.log("⚠️  IMPORTANTE: Solo usa wallets de testnet/desarrollo");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
