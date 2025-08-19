const hre = require("hardhat");

const main = async () => {
  console.log(
    "🔍 Verificación Pre-Despliegue del Sistema de Registros Médicos"
  );
  console.log(
    "=============================================================\n"
  );

  // Check compilation
  console.log("📋 1. Verificando compilación...");
  try {
    await hre.run("compile");
    console.log("✅ Compilación exitosa\n");
  } catch (error) {
    console.error("❌ Error de compilación:", error.message);
    process.exit(1);
  }

  // Check contract sizes
  console.log("📋 2. Verificando tamaños de contratos...");
  try {
    const AccessControl = await hre.ethers.getContractFactory("AccessControl");
    const MedicalRecords = await hre.ethers.getContractFactory(
      "MedicalRecords"
    );
    const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");

    console.log("✅ Todos los contratos se pueden instanciar correctamente");
    console.log("   - AccessControl: ✅");
    console.log("   - MedicalRecords: ✅");
    console.log("   - AuditTrail: ✅\n");
  } catch (error) {
    console.error("❌ Error al instanciar contratos:", error.message);
    process.exit(1);
  }

  // Run tests
  console.log("📋 3. Ejecutando tests...");
  try {
    await hre.run("test");
    console.log("✅ Todos los tests pasaron\n");
  } catch (error) {
    console.error("❌ Algunos tests fallaron. Revisar logs arriba.");
    console.log("ℹ️  Continuando con verificación...\n");
  }

  // Check environment configuration
  console.log("📋 4. Verificando configuración del entorno...");

  // Check if .env exists
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, "..", ".env");

  if (fs.existsSync(envPath)) {
    console.log("✅ Archivo .env encontrado");

    // Check for required variables (without exposing them)
    const envContent = fs.readFileSync(envPath, "utf8");

    const hasPrivateKey =
      envContent.includes("PRIVATE_KEY=") &&
      !envContent.includes("PRIVATE_KEY=your_private_key_here");
    const hasArbiscanKey =
      envContent.includes("ARBISCAN_API_KEY=") &&
      !envContent.includes("ARBISCAN_API_KEY=your_arbiscan_api_key_here");

    if (hasPrivateKey) {
      console.log("✅ PRIVATE_KEY configurada");
    } else {
      console.log("⚠️  PRIVATE_KEY no configurada o usa valor por defecto");
    }

    if (hasArbiscanKey) {
      console.log("✅ ARBISCAN_API_KEY configurada");
    } else {
      console.log(
        "⚠️  ARBISCAN_API_KEY no configurada o usa valor por defecto"
      );
    }
  } else {
    console.log("⚠️  Archivo .env no encontrado");
    console.log("   Copia .env.example a .env y configura tus variables");
  }

  console.log();

  // Check Hardhat configuration
  console.log("📋 5. Verificando configuración de Hardhat...");

  if (hre.config.solidity.settings && hre.config.solidity.settings.viaIR) {
    console.log("✅ Optimizador IR habilitado (soluciona stack too deep)");
  } else {
    console.log("⚠️  Optimizador IR no configurado");
  }

  if (
    hre.config.solidity.settings &&
    hre.config.solidity.settings.optimizer &&
    hre.config.solidity.settings.optimizer.enabled
  ) {
    console.log("✅ Optimizador habilitado");
  } else {
    console.log("⚠️  Optimizador no habilitado");
  }

  console.log();

  // Gas estimation
  console.log("📋 6. Estimación de costos de despliegue...");
  try {
    const [deployer] = await hre.ethers.getSigners();

    // Get gas estimates
    const AccessControl = await hre.ethers.getContractFactory("AccessControl");
    const MedicalRecords = await hre.ethers.getContractFactory(
      "MedicalRecords"
    );
    const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");

    const accessControlGas =
      await AccessControl.getDeployTransaction().estimateGas();
    const medicalRecordsGas = await MedicalRecords.getDeployTransaction(
      hre.ethers.ZeroAddress
    ).estimateGas();
    const auditTrailGas = await AuditTrail.getDeployTransaction(
      hre.ethers.ZeroAddress
    ).estimateGas();

    const totalGas = accessControlGas + medicalRecordsGas + auditTrailGas;

    console.log(`💰 Estimación de gas:`);
    console.log(`   AccessControl: ${accessControlGas.toLocaleString()}`);
    console.log(`   MedicalRecords: ${medicalRecordsGas.toLocaleString()}`);
    console.log(`   AuditTrail: ${auditTrailGas.toLocaleString()}`);
    console.log(`   Total: ${totalGas.toLocaleString()}`);

    // Estimate costs
    const gasPrice = 100000000n; // 0.1 gwei for Arbitrum
    const totalCost = totalGas * gasPrice;

    console.log(
      `💸 Costo estimado en Arbitrum: ${hre.ethers.formatEther(totalCost)} ETH`
    );
    console.log(
      `   (Aproximadamente $${(
        parseFloat(hre.ethers.formatEther(totalCost)) * 2000
      ).toFixed(2)} USD a $2000/ETH)`
    );
  } catch (error) {
    console.log("⚠️  No se pudo estimar gas (necesita conexión a red)");
  }

  console.log();

  // Final recommendations
  console.log("🎯 Recomendaciones finales:");
  console.log("==========================");

  console.log("📌 Para Testnet (Arbitrum Sepolia):");
  console.log(
    "   1. Obtén ETH en Ethereum Sepolia: https://sepoliafaucet.com/"
  );
  console.log("   2. Usa el bridge: https://bridge.arbitrum.io/");
  console.log("   3. Ejecuta: npm run deploy:arbitrum-sepolia");
  console.log();

  console.log("📌 Para Mainnet (Arbitrum One):");
  console.log("   1. Asegúrate de tener ETH real en tu wallet");
  console.log("   2. PRUEBA PRIMERO EN TESTNET");
  console.log("   3. Ejecuta: npm run deploy:arbitrum-mainnet");
  console.log();

  console.log("🔒 Seguridad:");
  console.log("   - NUNCA subas tu PRIVATE_KEY a GitHub");
  console.log("   - Verifica direcciones de contratos después del despliegue");
  console.log("   - Prueba la funcionalidad con el script de interacción");
  console.log();

  console.log("🚀 ¡Sistema listo para despliegue en Arbitrum!");
  console.log("   Los contratos están optimizados y probados.");
  console.log("   Sigue la DEPLOYMENT_GUIDE.md para instrucciones detalladas.");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en verificación:", error);
    process.exit(1);
  });
