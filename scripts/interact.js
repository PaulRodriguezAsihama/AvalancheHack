const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Helper function to load deployment addresses
const loadDeployment = (network) => {
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const deploymentFile = path.join(
    deploymentsDir,
    `${network}-deployment.json`
  );

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment record not found for network: ${network}`);
  }

  return JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
};

// Get contract instances
const getContracts = async (network) => {
  const deployment = loadDeployment(network);
  const contracts = deployment.contracts;

  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const MedicalRecords = await hre.ethers.getContractFactory("MedicalRecords");
  const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");

  return {
    accessControl: AccessControl.attach(contracts.accessControl.address),
    medicalRecords: MedicalRecords.attach(contracts.medicalRecords.address),
    auditTrail: AuditTrail.attach(contracts.auditTrail.address),
    addresses: contracts,
  };
};

// Example interaction functions
const interactionFunctions = {
  // Register a new doctor
  registerDoctor: async (contracts, doctorAddress, doctorName) => {
    console.log(`📋 Registering doctor: ${doctorName} (${doctorAddress})`);
    const tx = await contracts.accessControl.registerEntity(doctorAddress, 1); // EntityType.DOCTOR
    await tx.wait();
    console.log("✅ Doctor registered successfully");
    return tx.hash;
  },

  // Register a new insurance company
  registerInsurance: async (contracts, insuranceAddress, insuranceName) => {
    console.log(
      `📋 Registering insurance: ${insuranceName} (${insuranceAddress})`
    );
    const tx = await contracts.accessControl.registerEntity(
      insuranceAddress,
      2
    ); // EntityType.INSURANCE
    await tx.wait();
    console.log("✅ Insurance company registered successfully");
    return tx.hash;
  },

  // Register a new auditor
  registerAuditor: async (contracts, auditorAddress, auditorName) => {
    console.log(`📋 Registering auditor: ${auditorName} (${auditorAddress})`);
    const tx = await contracts.accessControl.registerEntity(auditorAddress, 3); // EntityType.AUDITOR
    await tx.wait();
    console.log("✅ Auditor registered successfully");
    return tx.hash;
  },

  // Check entity type
  checkEntityType: async (contracts, address) => {
    const entityType = await contracts.accessControl.getEntityType(address);
    const types = ["PATIENT", "DOCTOR", "INSURANCE", "AUDITOR"];
    console.log(`📋 Entity ${address} is type: ${types[entityType]}`);
    return entityType;
  },

  // Get total documents
  getTotalDocuments: async (contracts) => {
    const total = await contracts.medicalRecords.getTotalDocuments();
    console.log(`📋 Total documents in system: ${total}`);
    return total;
  },

  // Get total audit entries
  getTotalAuditEntries: async (contracts) => {
    const total = await contracts.auditTrail.getTotalAuditEntries();
    console.log(`📋 Total audit entries: ${total}`);
    return total;
  },

  // Display system status
  getSystemStatus: async (contracts) => {
    console.log("📊 System Status:");
    console.log("================");

    const totalDocs = await contracts.medicalRecords.getTotalDocuments();
    const totalAudits = await contracts.auditTrail.getTotalAuditEntries();

    console.log(`📄 Total Documents: ${totalDocs}`);
    console.log(`📝 Total Audit Entries: ${totalAudits}`);

    return {
      totalDocuments: totalDocs,
      totalAuditEntries: totalAudits,
    };
  },
};

const main = async () => {
  const network = hre.network.name;
  console.log("🔧 Medical Records Contract Interaction Tool");
  console.log(`📍 Network: ${network}`);

  try {
    const contracts = await getContracts(network);
    console.log("✅ Contracts loaded successfully");
    console.log(
      `📍 AccessControl: ${contracts.addresses.accessControl.address}`
    );
    console.log(
      `📍 MedicalRecords: ${contracts.addresses.medicalRecords.address}`
    );
    console.log(`📍 AuditTrail: ${contracts.addresses.auditTrail.address}`);

    // Example: Get system status
    await interactionFunctions.getSystemStatus(contracts);

    // You can uncomment and modify these examples as needed:

    // Example: Register entities
    // await interactionFunctions.registerDoctor(contracts, "0x742d35Cc6669C7e7D1dD6e4E72BDC8D4bF0DeF3B", "Dr. Smith");
    // await interactionFunctions.registerInsurance(contracts, "0x742d35Cc6669C7e7D1dD6e4E72BDC8D4bF0DeF3C", "Health Insurance Co.");
    // await interactionFunctions.registerAuditor(contracts, "0x742d35Cc6669C7e7D1dD6e4E72BDC8D4bF0DeF3D", "Audit Firm LLC");

    // Example: Check entity types
    // await interactionFunctions.checkEntityType(contracts, "0x742d35Cc6669C7e7D1dD6e4E72BDC8D4bF0DeF3B");

    console.log("\n✅ Interaction completed successfully");
    console.log("\n📝 Available interaction functions:");
    console.log("- registerDoctor(address, name)");
    console.log("- registerInsurance(address, name)");
    console.log("- registerAuditor(address, name)");
    console.log("- checkEntityType(address)");
    console.log("- getTotalDocuments()");
    console.log("- getTotalAuditEntries()");
    console.log("- getSystemStatus()");
  } catch (error) {
    console.error("❌ Interaction failed:", error);
    process.exit(1);
  }
};

// If running directly, execute main function
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

// Export for use in other scripts
module.exports = {
  loadDeployment,
  getContracts,
  interactionFunctions,
};
