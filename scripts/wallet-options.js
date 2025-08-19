const { ethers } = require("ethers");

async function main() {
  console.log("🔧 CONFIGURACIÓN DE WALLET PERSONALIZADA\n");

  console.log("Si ya tienes ETH en otra wallet, puedes:");
  console.log("1. Usar tu propia clave privada");
  console.log("2. Transferir ETH a la wallet generada");
  console.log("3. Usar MetaMask para enviar ETH\n");

  console.log("📋 OPCIONES:");
  console.log("\n🔑 OPCIÓN 1: Configurar tu propia wallet");
  console.log("1. Edita el archivo .env");
  console.log("2. Reemplaza PRIVATE_KEY con tu clave privada");
  console.log("3. Reemplaza DEPLOYER_ADDRESS con tu dirección");
  console.log(
    "⚠️  IMPORTANTE: Usa solo wallets de testnet, nunca tu wallet principal"
  );

  console.log("\n💸 OPCIÓN 2: Enviar ETH a la wallet generada");
  console.log("Dirección destino: 0x358cE1068DDD9C88659772e61c304B59F81b1b2C");
  console.log("Red: Arbitrum Sepolia");
  console.log("Cantidad mínima: 0.001 ETH");

  console.log("\n🌐 OPCIÓN 3: Obtener ETH directamente");
  console.log("1. Ve a: https://sepoliafaucet.com/");
  console.log(
    "2. Solicita ETH para: 0x358cE1068DDD9C88659772e61c304B59F81b1b2C"
  );
  console.log("3. Bridge a Arbitrum: https://bridge.arbitrum.io/");

  console.log("\n🛠️  COMANDOS DE VERIFICACIÓN:");
  console.log(
    "node scripts/find-balance.js     # Buscar ETH en todas las redes"
  );
  console.log("npm run balance                  # Verificar balance actual");
  console.log("npm run quick-deploy             # Desplegar cuando tengas ETH");

  console.log("\n❓ ¿En qué wallet tienes ETH actualmente?");
  console.log("Si necesitas ayuda con alguna opción específica, dímelo.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
