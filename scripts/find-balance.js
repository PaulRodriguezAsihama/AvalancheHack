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
  console.log("🔍 BÚSQUEDA DE ETH EN MÚLTIPLES REDES\n");

  const address =
    process.env.DEPLOYER_ADDRESS ||
    "0x358cE1068DDD9C88659772e61c304B59F81b1b2C";
  console.log(`👤 Dirección: ${address}\n`);

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
      console.log("\n🚀 ¡Listo para desplegar en Arbitrum Sepolia!");
      console.log("Ejecuta: npm run quick-deploy");
    } else if (foundNetworks.some((net) => net.name === "Ethereum Sepolia")) {
      console.log("\n🌉 ETH encontrado en Sepolia. Necesitas hacer bridge:");
      console.log("1. Ve a: https://bridge.arbitrum.io/");
      console.log("2. Bridge de Sepolia a Arbitrum Sepolia");
    } else {
      console.log("\n⚠️  ETH encontrado pero no en redes de testnet");
    }
  } else {
    console.log("❌ No se encontró ETH en ninguna red");
    console.log("\n🔗 Obtén ETH de testnet:");
    console.log("1. Sepolia Faucet: https://sepoliafaucet.com/");
    console.log("2. Bridge: https://bridge.arbitrum.io/");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
