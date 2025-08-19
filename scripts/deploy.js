const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Deployment configuration
const DEPLOYMENT_CONFIG = {
  arbitrumSepolia: {
    confirmations: 2,
    gasPrice: "100000000", // 0.1 gwei
  },
  arbitrumOne: {
    confirmations: 3,
    gasPrice: "100000000", // 0.1 gwei
  },
  localhost: {
    confirmations: 1,
    gasPrice: "20000000000", // 20 gwei
  },
};

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("🚀 Starting deployment on", network);
  console.log("📍 Deploying with account:", deployer.address);
  console.log(
    "💰 Account balance:",
    hre.ethers.formatEther(
      await hre.ethers.provider.getBalance(deployer.address)
    ),
    "ETH"
  );

  const config = DEPLOYMENT_CONFIG[network] || DEPLOYMENT_CONFIG.localhost;

  // Create deployment record
  const deploymentRecord = {
    network: network,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {},
  };

  try {
    console.log("\n📋 Step 1: Deploying AccessControl contract...");
    const AccessControl = await hre.ethers.getContractFactory("AccessControl");
    const accessControl = await AccessControl.deploy({
      gasPrice: config.gasPrice,
    });
    await accessControl.waitForDeployment();
    const accessControlAddress = await accessControl.getAddress();

    console.log("✅ AccessControl deployed to:", accessControlAddress);
    deploymentRecord.contracts.accessControl = {
      address: accessControlAddress,
      txHash: accessControl.deploymentTransaction().hash,
    };

    // Wait for confirmations
    console.log(`⏳ Waiting for ${config.confirmations} confirmations...`);
    await accessControl.deploymentTransaction().wait(config.confirmations);

    console.log("\n📋 Step 2: Deploying MedicalRecords contract...");
    const MedicalRecords = await hre.ethers.getContractFactory(
      "MedicalRecords"
    );
    const medicalRecords = await MedicalRecords.deploy(accessControlAddress, {
      gasPrice: config.gasPrice,
    });
    await medicalRecords.waitForDeployment();
    const medicalRecordsAddress = await medicalRecords.getAddress();

    console.log("✅ MedicalRecords deployed to:", medicalRecordsAddress);
    deploymentRecord.contracts.medicalRecords = {
      address: medicalRecordsAddress,
      txHash: medicalRecords.deploymentTransaction().hash,
    };

    await medicalRecords.deploymentTransaction().wait(config.confirmations);

    console.log("\n📋 Step 3: Deploying AuditTrail contract...");
    const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");
    const auditTrail = await AuditTrail.deploy(accessControlAddress, {
      gasPrice: config.gasPrice,
    });
    await auditTrail.waitForDeployment();
    const auditTrailAddress = await auditTrail.getAddress();

    console.log("✅ AuditTrail deployed to:", auditTrailAddress);
    deploymentRecord.contracts.auditTrail = {
      address: auditTrailAddress,
      txHash: auditTrail.deploymentTransaction().hash,
    };

    await auditTrail.deploymentTransaction().wait(config.confirmations);

    console.log(
      "\n📋 Step 4: Configuring AuditTrail with MedicalRecords address..."
    );
    const setMedicalRecordsTx = await auditTrail.setMedicalRecordsContract(
      medicalRecordsAddress,
      {
        gasPrice: config.gasPrice,
      }
    );
    await setMedicalRecordsTx.wait(config.confirmations);
    console.log("✅ AuditTrail configured with MedicalRecords address");

    // Optional: Register initial entities if provided
    if (process.env.INITIAL_DOCTOR_ADDRESS) {
      console.log("\n📋 Step 5: Registering initial doctor...");
      const registerDoctorTx = await accessControl.registerEntity(
        process.env.INITIAL_DOCTOR_ADDRESS,
        1, // EntityType.DOCTOR
        { gasPrice: config.gasPrice }
      );
      await registerDoctorTx.wait(config.confirmations);
      console.log(
        "✅ Initial doctor registered:",
        process.env.INITIAL_DOCTOR_ADDRESS
      );
    }

    if (process.env.INITIAL_INSURANCE_ADDRESS) {
      console.log("\n📋 Registering initial insurance company...");
      const registerInsuranceTx = await accessControl.registerEntity(
        process.env.INITIAL_INSURANCE_ADDRESS,
        2, // EntityType.INSURANCE
        { gasPrice: config.gasPrice }
      );
      await registerInsuranceTx.wait(config.confirmations);
      console.log(
        "✅ Initial insurance company registered:",
        process.env.INITIAL_INSURANCE_ADDRESS
      );
    }

    if (process.env.INITIAL_AUDITOR_ADDRESS) {
      console.log("\n📋 Registering initial auditor...");
      const registerAuditorTx = await accessControl.registerEntity(
        process.env.INITIAL_AUDITOR_ADDRESS,
        3, // EntityType.AUDITOR
        { gasPrice: config.gasPrice }
      );
      await registerAuditorTx.wait(config.confirmations);
      console.log(
        "✅ Initial auditor registered:",
        process.env.INITIAL_AUDITOR_ADDRESS
      );
    }

    // Save deployment record
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(
      deploymentsDir,
      `${network}-deployment.json`
    );
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentRecord, null, 2));

    console.log("\n🎉 Deployment completed successfully!");
    console.log("📄 Deployment record saved to:", deploymentFile);
    console.log("\n📋 Contract Addresses:");
    console.log("AccessControl:", accessControlAddress);
    console.log("MedicalRecords:", medicalRecordsAddress);
    console.log("AuditTrail:", auditTrailAddress);

    // Display next steps
    console.log("\n🔍 Next Steps:");
    console.log("1. Verify contracts on Arbiscan:");
    console.log(
      `   npm run verify:${
        network === "arbitrumOne" ? "arbitrum-mainnet" : "arbitrum-sepolia"
      }`
    );
    console.log("2. Update your frontend with the contract addresses");
    console.log("3. Register additional entities as needed");

    if (network === "arbitrumSepolia") {
      console.log("\n🌐 Testnet Information:");
      console.log("- Get testnet ETH from: https://bridge.arbitrum.io/");
      console.log(
        "- Arbitrum Sepolia Block Explorer: https://sepolia.arbiscan.io/"
      );
    } else if (network === "arbitrumOne") {
      console.log("\n🌐 Mainnet Information:");
      console.log("- Arbitrum One Block Explorer: https://arbiscan.io/");
    }

    // Calculate total gas used
    const accessControlReceipt =
      await hre.ethers.provider.getTransactionReceipt(
        accessControl.deploymentTransaction().hash
      );
    const medicalRecordsReceipt =
      await hre.ethers.provider.getTransactionReceipt(
        medicalRecords.deploymentTransaction().hash
      );
    const auditTrailReceipt = await hre.ethers.provider.getTransactionReceipt(
      auditTrail.deploymentTransaction().hash
    );

    const totalGasUsed =
      accessControlReceipt.gasUsed +
      medicalRecordsReceipt.gasUsed +
      auditTrailReceipt.gasUsed;
    const gasPrice = BigInt(config.gasPrice);
    const totalCost = totalGasUsed * gasPrice;

    console.log("\n💸 Deployment Costs:");
    console.log(`Total Gas Used: ${totalGasUsed.toString()}`);
    console.log(`Total Cost: ${hre.ethers.formatEther(totalCost)} ETH`);
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
};

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  });
