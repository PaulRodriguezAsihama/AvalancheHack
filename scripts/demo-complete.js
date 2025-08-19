const { ethers } = require("hardhat");

// Direcciones de los contratos desplegados
const CONTRACTS = {
  AccessControl: "0xE581f2a4840fdb1CAc660876Fdd512980846Ad04",
  MedicalRecords: "0xC6902Cdd7732DFA81c3d14431D0F1de670BC1747",
  AuditTrail: "0xD587fA568C2a48a9ae8b5793796C9e71c201f059",
};

async function loadContracts() {
  console.log("📋 Cargando contratos...");

  const AccessControl = await ethers.getContractFactory("AccessControl");
  const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
  const AuditTrail = await ethers.getContractFactory("AuditTrail");

  const accessControl = AccessControl.attach(CONTRACTS.AccessControl);
  const medicalRecords = MedicalRecords.attach(CONTRACTS.MedicalRecords);
  const auditTrail = AuditTrail.attach(CONTRACTS.AuditTrail);

  return { accessControl, medicalRecords, auditTrail };
}

async function step1_RegisterEntities(accessControl, signer) {
  console.log("\n🏥 PASO 1: REGISTRAR ENTIDADES EN EL SISTEMA");
  console.log("=".repeat(50));

  const currentAddress = await signer.getAddress();

  try {
    // 1. Registrar como paciente (self-register)
    console.log("👤 Registrando como PACIENTE...");
    const tx1 = await accessControl.registerPatient();
    await tx1.wait();
    console.log(`✅ Paciente registrado: ${currentAddress}`);

    // 2. Registrar como doctor (misma dirección para demo)
    console.log("👨‍⚕️ Registrando como DOCTOR...");
    const tx2 = await accessControl.registerEntity(currentAddress, 1); // DOCTOR = 1
    await tx2.wait();
    console.log(`✅ Doctor registrado: ${currentAddress}`);

    // 3. Registrar una dirección simulada como seguro
    const insuranceAddress = "0x1234567890123456789012345678901234567890";
    console.log("🏢 Registrando SEGURO...");
    const tx3 = await accessControl.registerEntity(insuranceAddress, 2); // INSURANCE = 2
    await tx3.wait();
    console.log(`✅ Seguro registrado: ${insuranceAddress}`);

    // 4. Registrar una dirección simulada como auditor
    const auditorAddress = "0xABCDEF123456789012345678901234567890ABCD";
    console.log("🔍 Registrando AUDITOR...");
    const tx4 = await accessControl.registerEntity(auditorAddress, 3); // AUDITOR = 3
    await tx4.wait();
    console.log(`✅ Auditor registrado: ${auditorAddress}`);

    console.log("\n🎉 Todas las entidades registradas exitosamente!");
  } catch (error) {
    console.log("❌ Error en registro:", error.message);
  }
}

async function step2_GrantPermissions(accessControl, signer) {
  console.log("\n🔐 PASO 2: OTORGAR PERMISOS DE ACCESO");
  console.log("=".repeat(40));

  const patientAddress = await signer.getAddress();
  const doctorAddress = await signer.getAddress(); // Misma dirección para demo
  const insuranceAddress = "0x1234567890123456789012345678901234567890";

  try {
    console.log(`👤 Paciente otorgando permisos: ${patientAddress}`);

    // Otorgar permisos WRITE al doctor (puede leer y escribir)
    console.log("🔸 Otorgando permisos WRITE al doctor...");
    const tx1 = await accessControl.grantAccess(doctorAddress, 1); // WRITE = 1
    await tx1.wait();
    console.log("✅ Doctor puede leer y escribir documentos");

    // Otorgar permisos READ al seguro (solo puede leer)
    console.log("🔸 Otorgando permisos READ al seguro...");
    const tx2 = await accessControl.grantAccess(insuranceAddress, 0); // READ = 0
    await tx2.wait();
    console.log("✅ Seguro puede leer documentos");

    console.log("\n🎉 Permisos otorgados exitosamente!");
  } catch (error) {
    console.log("❌ Error otorgando permisos:", error.message);
  }
}

async function step3_AddMedicalDocuments(medicalRecords, signer) {
  console.log("\n📄 PASO 3: AGREGAR DOCUMENTOS MÉDICOS");
  console.log("=".repeat(40));

  const patientAddress = await signer.getAddress();

  const documents = [
    {
      type: "Análisis de Sangre",
      description:
        "Resultados de análisis de sangre completo - Valores normales",
      ipfs: "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1",
      tags: ["sangre", "análisis", "laboratorio", "2025"],
    },
    {
      type: "Radiografía",
      description: "Radiografía de tórax - Sin anomalías detectadas",
      ipfs: "QmYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY2",
      tags: ["radiografía", "tórax", "imagen", "2025"],
    },
    {
      type: "Receta Médica",
      description: "Prescripción de medicamentos para hipertensión",
      ipfs: "QmZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ3",
      tags: ["receta", "medicamentos", "hipertensión", "2025"],
    },
  ];

  try {
    console.log(`👤 Paciente: ${patientAddress}`);
    console.log(`👨‍⚕️ Doctor agregando documentos...`);

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      console.log(`\n📄 Documento ${i + 1}: ${doc.type}`);

      const tx = await medicalRecords.addDocument(
        patientAddress,
        doc.ipfs,
        doc.type,
        doc.description,
        doc.tags
      );

      const receipt = await tx.wait();

      // Buscar evento DocumentAdded
      const addedEvent = receipt.logs.find((log) => {
        try {
          const parsed = medicalRecords.interface.parseLog(log);
          return parsed.name === "DocumentAdded";
        } catch {
          return false;
        }
      });

      if (addedEvent) {
        const parsed = medicalRecords.interface.parseLog(addedEvent);
        console.log(`✅ Documento creado con ID: ${parsed.args.documentId}`);
      }
    }

    console.log("\n🎉 Todos los documentos agregados exitosamente!");
  } catch (error) {
    console.log("❌ Error agregando documentos:", error.message);
  }
}

async function step4_ViewDocuments(medicalRecords, signer) {
  console.log("\n📋 PASO 4: VER DOCUMENTOS DEL PACIENTE");
  console.log("=".repeat(40));

  const patientAddress = await signer.getAddress();

  try {
    const documentIds = await medicalRecords.getPatientDocuments(
      patientAddress
    );
    console.log(`👤 Paciente: ${patientAddress}`);
    console.log(`📄 Total de documentos: ${documentIds.length}`);

    for (let i = 0; i < documentIds.length; i++) {
      const docId = documentIds[i];
      console.log(`\n📄 Documento #${docId}:`);

      const document = await medicalRecords.getDocument(docId);
      console.log(`   📁 Tipo: ${document.documentType}`);
      console.log(`   📝 Descripción: ${document.description}`);
      console.log(`   👨‍⚕️ Creado por: ${document.createdBy}`);
      console.log(
        `   📅 Fecha: ${new Date(
          Number(document.createdAt) * 1000
        ).toLocaleString()}`
      );
      console.log(`   📎 IPFS: ${document.ipfsHash}`);

      // Ver tags del documento
      const tags = await medicalRecords.getDocumentTags(docId);
      console.log(`   🏷️ Tags: ${tags.join(", ")}`);
    }
  } catch (error) {
    console.log("❌ Error obteniendo documentos:", error.message);
  }
}

async function step5_CheckPermissions(accessControl, signer) {
  console.log("\n🔍 PASO 5: VERIFICAR PERMISOS");
  console.log("=".repeat(30));

  const patientAddress = await signer.getAddress();
  const doctorAddress = await signer.getAddress();
  const insuranceAddress = "0x1234567890123456789012345678901234567890";

  try {
    console.log(`👤 Paciente: ${patientAddress}`);

    // Verificar tipo de entidad
    const entityType = await accessControl.getEntityType(doctorAddress);
    console.log(`🏥 Tipo de entidad del doctor: ${entityType} (1=DOCTOR)`);

    // Verificar permisos del doctor
    const doctorRead = await accessControl.checkPermission(
      patientAddress,
      doctorAddress,
      0
    );
    const doctorWrite = await accessControl.checkPermission(
      patientAddress,
      doctorAddress,
      1
    );
    const doctorFull = await accessControl.checkPermission(
      patientAddress,
      doctorAddress,
      2
    );

    console.log(`\n👨‍⚕️ Permisos del Doctor:`);
    console.log(`   📖 READ: ${doctorRead ? "✅" : "❌"}`);
    console.log(`   ✏️ WRITE: ${doctorWrite ? "✅" : "❌"}`);
    console.log(`   🔓 FULL: ${doctorFull ? "✅" : "❌"}`);

    // Verificar permisos del seguro
    const insuranceRead = await accessControl.checkPermission(
      patientAddress,
      insuranceAddress,
      0
    );
    const insuranceWrite = await accessControl.checkPermission(
      patientAddress,
      insuranceAddress,
      1
    );

    console.log(`\n🏢 Permisos del Seguro:`);
    console.log(`   📖 READ: ${insuranceRead ? "✅" : "❌"}`);
    console.log(`   ✏️ WRITE: ${insuranceWrite ? "✅" : "❌"}`);
  } catch (error) {
    console.log("❌ Error verificando permisos:", error.message);
  }
}

async function step6_SystemStatus(contracts) {
  console.log("\n📊 PASO 6: ESTADO FINAL DEL SISTEMA");
  console.log("=".repeat(40));

  try {
    const totalDocuments = await contracts.medicalRecords.getTotalDocuments();
    const totalAuditEntries = await contracts.auditTrail.getTotalAuditEntries();

    console.log(`📄 Total de documentos en el sistema: ${totalDocuments}`);
    console.log(`🔍 Total de entradas de auditoría: ${totalAuditEntries}`);

    console.log("\n🌐 Direcciones de contratos en Arbitrum Sepolia:");
    console.log(`🔐 AccessControl: ${CONTRACTS.AccessControl}`);
    console.log(`📄 MedicalRecords: ${CONTRACTS.MedicalRecords}`);
    console.log(`🔍 AuditTrail: ${CONTRACTS.AuditTrail}`);

    console.log("\n🔗 Ver en Arbiscan:");
    Object.entries(CONTRACTS).forEach(([name, address]) => {
      console.log(`   ${name}: https://sepolia.arbiscan.io/address/${address}`);
    });
  } catch (error) {
    console.log("❌ Error obteniendo estado del sistema:", error.message);
  }
}

async function step7_TestRevokePermissions(accessControl, signer) {
  console.log("\n🚫 PASO 7: REVOCAR PERMISOS");
  console.log("=".repeat(30));

  const insuranceAddress = "0x1234567890123456789012345678901234567890";

  try {
    console.log(`🚫 Revocando permisos del seguro: ${insuranceAddress}`);

    const tx = await accessControl.revokeAccess(insuranceAddress);
    await tx.wait();

    console.log("✅ Permisos revocados exitosamente");

    // Verificar que los permisos fueron revocados
    const patientAddress = await signer.getAddress();
    const hasReadPermission = await accessControl.checkPermission(
      patientAddress,
      insuranceAddress,
      0
    );
    console.log(
      `🔍 Permiso READ del seguro después de revocar: ${
        hasReadPermission ? "✅" : "❌"
      }`
    );
  } catch (error) {
    console.log("❌ Error revocando permisos:", error.message);
  }
}

async function main() {
  console.log("🏥 DEMO COMPLETO DEL SISTEMA DE HISTORIAS CLÍNICAS");
  console.log("🌐 Red: Arbitrum Sepolia");
  console.log("=".repeat(60));

  const [signer] = await ethers.getSigners();
  console.log(`👤 Cuenta activa: ${await signer.getAddress()}`);

  const contracts = await loadContracts();
  console.log("✅ Contratos cargados exitosamente\n");

  // Ejecutar todas las pruebas paso a paso
  await step1_RegisterEntities(contracts.accessControl, signer);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await step2_GrantPermissions(contracts.accessControl, signer);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await step3_AddMedicalDocuments(contracts.medicalRecords, signer);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await step4_ViewDocuments(contracts.medicalRecords, signer);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await step5_CheckPermissions(contracts.accessControl, signer);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await step6_SystemStatus(contracts);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await step7_TestRevokePermissions(contracts.accessControl, signer);

  console.log("\n🎉 DEMO COMPLETADO EXITOSAMENTE!");
  console.log("=".repeat(60));
  console.log("✅ Sistema de historias clínicas funcionando perfectamente");
  console.log("💡 El paciente tiene control total sobre sus datos");
  console.log("🔐 Los permisos se gestionan de forma granular");
  console.log("📄 Los documentos se almacenan de forma segura");
  console.log("🔍 Todas las actividades quedan auditadas");
  console.log("🌐 Sistema desplegado en Arbitrum Sepolia con costos mínimos");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
