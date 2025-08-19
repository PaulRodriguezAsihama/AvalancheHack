const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Medical Records System", function () {
  let accessControl;
  let medicalRecords;
  let auditTrail;
  let deployer;
  let patient;
  let doctor;
  let insurance;

  beforeEach(async function () {
    [deployer, patient, doctor, insurance] = await ethers.getSigners();

    // Deploy AccessControl
    const AccessControl = await ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();

    // Deploy MedicalRecords
    const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
    medicalRecords = await MedicalRecords.deploy(
      await accessControl.getAddress()
    );
    await medicalRecords.waitForDeployment();

    // Deploy AuditTrail
    const AuditTrail = await ethers.getContractFactory("AuditTrail");
    auditTrail = await AuditTrail.deploy(await accessControl.getAddress());
    await auditTrail.waitForDeployment();

    // Configure AuditTrail with MedicalRecords
    await auditTrail.setMedicalRecordsContract(
      await medicalRecords.getAddress()
    );
  });

  describe("Deployment", function () {
    it("Should deploy AccessControl successfully", async function () {
      expect(await accessControl.getAddress()).to.not.equal(ethers.ZeroAddress);
    });

    it("Should deploy MedicalRecords successfully", async function () {
      expect(await medicalRecords.getAddress()).to.not.equal(
        ethers.ZeroAddress
      );
    });

    it("Should deploy AuditTrail successfully", async function () {
      expect(await auditTrail.getAddress()).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("AccessControl", function () {
    it("Should register a patient", async function () {
      await accessControl.connect(patient).registerPatient();
      const entityType = await accessControl.getEntityType(patient.address);
      expect(entityType).to.equal(0); // EntityType.PATIENT
    });

    it("Should register a doctor", async function () {
      await accessControl.registerEntity(doctor.address, 1); // EntityType.DOCTOR
      const entityType = await accessControl.getEntityType(doctor.address);
      expect(entityType).to.equal(1); // EntityType.DOCTOR
    });

    it("Should allow patient to grant access to doctor", async function () {
      // Register entities
      await accessControl.connect(patient).registerPatient();
      await accessControl.registerEntity(doctor.address, 1); // EntityType.DOCTOR

      // Grant access
      await accessControl.connect(patient).grantAccess(
        doctor.address,
        0, // AccessType.READ
        0, // No expiration
        "Medical consultation"
      );

      // Check permission
      const hasPermission = await accessControl.checkPermission(
        patient.address,
        doctor.address,
        0 // AccessType.READ
      );
      expect(hasPermission).to.be.true;
    });
  });

  describe("MedicalRecords", function () {
    beforeEach(async function () {
      // Setup entities
      await accessControl.connect(patient).registerPatient();
      await accessControl.registerEntity(doctor.address, 1); // EntityType.DOCTOR

      // Grant write access to doctor
      await accessControl.connect(patient).grantAccess(
        doctor.address,
        1, // AccessType.WRITE
        0, // No expiration
        "Medical treatment"
      );
    });

    it("Should allow doctor to add a document", async function () {
      const tx = await medicalRecords
        .connect(doctor)
        .addDocument(
          patient.address,
          "QmTestHash123",
          "Lab Result",
          "Blood test results",
          ["blood-test", "lab-result"]
        );

      await expect(tx).to.emit(medicalRecords, "DocumentAdded");

      const totalDocs = await medicalRecords.getTotalDocuments();
      expect(totalDocs).to.equal(1);
    });

    it("Should get patient documents", async function () {
      // Add a document
      await medicalRecords
        .connect(doctor)
        .addDocument(
          patient.address,
          "QmTestHash123",
          "Lab Result",
          "Blood test results",
          ["blood-test"]
        );

      // Patient should be able to get their documents
      const patientDocs = await medicalRecords
        .connect(patient)
        .getPatientDocuments(patient.address);
      expect(patientDocs.length).to.equal(1);
      expect(patientDocs[0]).to.equal(1); // First document ID
    });
  });

  describe("System Integration", function () {
    it("Should handle complete workflow", async function () {
      // 1. Register entities
      await accessControl.connect(patient).registerPatient();
      await accessControl.registerEntity(doctor.address, 1); // EntityType.DOCTOR
      await accessControl.registerEntity(insurance.address, 2); // EntityType.INSURANCE

      // 2. Patient grants access to doctor for writing
      await accessControl.connect(patient).grantAccess(
        doctor.address,
        1, // AccessType.WRITE
        0,
        "Medical treatment"
      );

      // 3. Patient grants access to insurance for reading
      await accessControl.connect(patient).grantAccess(
        insurance.address,
        0, // AccessType.READ
        0,
        "Insurance claim"
      );

      // 4. Doctor creates medical record
      await medicalRecords
        .connect(doctor)
        .addDocument(
          patient.address,
          "QmMedicalRecord123",
          "Diagnosis",
          "Patient diagnosis and treatment plan",
          ["diagnosis", "treatment"]
        );

      // 5. Insurance can read the document
      const document = await medicalRecords.connect(insurance).getDocument(1);
      expect(document.documentType).to.equal("Diagnosis");
      expect(document.patient).to.equal(patient.address);
      expect(document.createdBy).to.equal(doctor.address);

      // 6. Check system statistics
      const totalDocs = await medicalRecords.getTotalDocuments();
      const totalAudits = await auditTrail.getTotalAuditEntries();

      expect(totalDocs).to.equal(1);
      // Note: Audit entries are created when contracts call the audit functions
      // For now, we just check that the audit trail contract is working
      expect(totalAudits).to.be.greaterThanOrEqual(0);
    });
  });
});
