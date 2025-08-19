const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const main = async () => {
  const network = hre.network.name;
  console.log("🔍 Starting contract verification on", network);

  // Load deployment record
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const deploymentFile = path.join(
    deploymentsDir,
    `${network}-deployment.json`
  );

  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment record not found:", deploymentFile);
    console.error("Please run the deployment script first");
    process.exit(1);
  }

  const deploymentRecord = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contracts = deploymentRecord.contracts;

  try {
    console.log("\n📋 Step 1: Verifying AccessControl contract...");
    await hre.run("verify:verify", {
      address: contracts.accessControl.address,
      constructorArguments: [],
    });
    console.log("✅ AccessControl verified");

    console.log("\n📋 Step 2: Verifying MedicalRecords contract...");
    await hre.run("verify:verify", {
      address: contracts.medicalRecords.address,
      constructorArguments: [contracts.accessControl.address],
    });
    console.log("✅ MedicalRecords verified");

    console.log("\n📋 Step 3: Verifying AuditTrail contract...");
    await hre.run("verify:verify", {
      address: contracts.auditTrail.address,
      constructorArguments: [contracts.accessControl.address],
    });
    console.log("✅ AuditTrail verified");

    console.log("\n🎉 All contracts verified successfully!");

    // Display contract links
    const explorerBase =
      network === "arbitrumOne"
        ? "https://arbiscan.io"
        : "https://sepolia.arbiscan.io";

    console.log("\n🌐 Verified Contract Links:");
    console.log(
      `AccessControl: ${explorerBase}/address/${contracts.accessControl.address}#code`
    );
    console.log(
      `MedicalRecords: ${explorerBase}/address/${contracts.medicalRecords.address}#code`
    );
    console.log(
      `AuditTrail: ${explorerBase}/address/${contracts.auditTrail.address}#code`
    );
  } catch (error) {
    console.error("❌ Verification failed:", error);

    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract may already be verified");
    } else if (error.message.includes("API Key")) {
      console.error("Please ensure ARBISCAN_API_KEY is set in your .env file");
    }

    process.exit(1);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification script failed:", error);
    process.exit(1);
  });
