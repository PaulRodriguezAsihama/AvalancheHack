#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log(
  "🚀 Inicializando proyecto de contratos médicos para Arbitrum...\n"
);

// Función para ejecutar comandos
const runCommand = (command, description) => {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
};

// Función para crear archivo si no existe
const createFileIfNotExists = (filePath, content, description) => {
  if (!fs.existsSync(filePath)) {
    console.log(`📋 Creando ${description}...`);
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${description} creado\n`);
  } else {
    console.log(`ℹ️  ${description} ya existe\n`);
  }
};

// Paso 1: Verificar Node.js
console.log("📋 Verificando Node.js...");
try {
  const nodeVersion = execSync("node --version", { encoding: "utf8" }).trim();
  console.log(`✅ Node.js detectado: ${nodeVersion}\n`);
} catch (error) {
  console.error(
    "❌ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/"
  );
  process.exit(1);
}

// Paso 2: Instalar dependencias
runCommand("npm install", "Instalando dependencias");

// Paso 3: Crear directorio deployments
const deploymentsDir = path.join(__dirname, "deployments");
if (!fs.existsSync(deploymentsDir)) {
  console.log("📋 Creando directorio deployments...");
  fs.mkdirSync(deploymentsDir, { recursive: true });
  console.log("✅ Directorio deployments creado\n");
}

// Paso 4: Crear archivo .env si no existe
const envPath = path.join(__dirname, ".env");
const envExamplePath = path.join(__dirname, ".env.example");

if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
  console.log("📋 Creando archivo .env desde .env.example...");
  fs.copyFileSync(envExamplePath, envPath);
  console.log("✅ Archivo .env creado");
  console.log("⚠️  IMPORTANTE: Edita el archivo .env con tus datos reales\n");
} else if (fs.existsSync(envPath)) {
  console.log("ℹ️  Archivo .env ya existe\n");
}

// Paso 5: Compilar contratos
runCommand("npm run compile", "Compilando contratos");

// Paso 6: Ejecutar tests
console.log("📋 ¿Deseas ejecutar los tests? (puede tomar unos minutos)");
console.log(
  "🔍 Los tests verifican que todos los contratos funcionen correctamente"
);

// En un entorno real, podrías usar readline para input del usuario
// Por ahora, ejecutamos los tests automáticamente
try {
  runCommand("npm run test", "Ejecutando tests");
} catch (error) {
  console.log("⚠️  Los tests fallaron, pero la inicialización puede continuar");
  console.log('🔧 Revisa los errores y ejecuta "npm run test" manualmente\n');
}

// Información final
console.log("🎉 ¡Inicialización completada!\n");
console.log("📋 Próximos pasos:");
console.log("==================");
console.log("1. Edita el archivo .env con tus datos:");
console.log("   - PRIVATE_KEY: Tu clave privada (¡NUNCA la subas a GitHub!)");
console.log("   - ARBISCAN_API_KEY: Tu API key de Arbiscan");
console.log("   - URLs de RPC si usas servicios como Alchemy o Infura\n");

console.log("2. Para testnet (Arbitrum Sepolia):");
console.log("   - Obtén ETH en Ethereum Sepolia: https://sepoliafaucet.com/");
console.log("   - Transfiere a Arbitrum Sepolia: https://bridge.arbitrum.io/");
console.log("   - Ejecuta: npm run deploy:arbitrum-sepolia\n");

console.log("3. Para mainnet (Arbitrum One):");
console.log("   - Asegúrate de tener ETH real en tu wallet");
console.log("   - Ejecuta: npm run deploy:arbitrum-mainnet\n");

console.log("4. Después del despliegue:");
console.log("   - Verifica contratos: npm run verify:arbitrum-sepolia");
console.log(
  "   - Interactúa con contratos: npx hardhat run scripts/interact.js --network arbitrumSepolia\n"
);

console.log("📚 Documentación completa en:");
console.log("   - README.md: Información general del proyecto");
console.log("   - DEPLOYMENT_GUIDE.md: Guía detallada de despliegue");
console.log("   - PROJECT_STRUCTURE.md: Estructura del proyecto\n");

console.log("🔒 Recordatorios de seguridad:");
console.log("   - NUNCA subas tu clave privada a GitHub");
console.log("   - Prueba siempre en testnet antes de mainnet");
console.log(
  "   - Verifica las direcciones de contratos después del despliegue\n"
);

console.log("💬 ¿Necesitas ayuda?");
console.log("   - Revisa DEPLOYMENT_GUIDE.md para troubleshooting");
console.log(
  "   - Consulta la documentación de Arbitrum: https://docs.arbitrum.io/\n"
);

console.log("¡Listo para desplegar en Arbitrum! 🚀");
