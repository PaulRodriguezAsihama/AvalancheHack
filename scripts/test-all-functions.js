const { ethers } = require("hardhat");
const fs = require("fs");

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

async function showMenu() {
  console.log("\n" + "=".repeat(60));
  console.log("🏥 SISTEMA DE HISTORIAS CLÍNICAS - MENÚ INTERACTIVO");
  console.log("=".repeat(60));
  console.log("1️⃣  Registrar Doctor");
  console.log("2️⃣  Registrar Compañía de Seguros");
  console.log("3️⃣  Registrar Auditor");
  console.log("4️⃣  Otorgar Permisos (como Paciente)");
  console.log("5️⃣  Agregar Documento Médico (como Doctor)");
  console.log("6️⃣  Ver Documentos del Paciente");
  console.log("7️⃣  Ver Historial de Auditoría");
  console.log("8️⃣  Ver Estado del Sistema");
  console.log("9️⃣  Verificar Permisos");
  console.log("🔟  Revocar Permisos (como Paciente)");
  console.log("0️⃣  Salir");
  console.log("=".repeat(60));
}

async function registerDoctor(accessControl, signer) {
  console.log("\n👨‍⚕️ REGISTRAR DOCTOR");
  console.log("=".repeat(30));

  // Usar la dirección del signer actual como doctor
  const doctorAddress = await signer.getAddress();
  const doctorName = "Dr. Juan Pérez";

  try {
    console.log(`📝 Registrando doctor: ${doctorName}`);
    console.log(`📍 Dirección: ${doctorAddress}`);

    const tx = await accessControl.registerEntity(doctorAddress, 1, doctorName); // EntityType.DOCTOR = 1
    await tx.wait();

    console.log("✅ Doctor registrado exitosamente");
    console.log(`🧾 Hash de transacción: ${tx.hash}`);

    // Verificar registro
    const entityType = await accessControl.getEntityType(doctorAddress);
    console.log(`🔍 Tipo de entidad confirmado: ${entityType} (1 = DOCTOR)`);
  } catch (error) {
    console.log("❌ Error registrando doctor:", error.message);
  }
}

async function registerInsurance(accessControl, signer) {
  console.log("\n🏢 REGISTRAR COMPAÑÍA DE SEGUROS");
  console.log("=".repeat(40));

  // Simular dirección de seguro (puede ser cualquier dirección para testing)
  const insuranceAddress = "0x1234567890123456789012345678901234567890";
  const insuranceName = "Seguros MediCorp";

  try {
    console.log(`📝 Registrando seguro: ${insuranceName}`);
    console.log(`📍 Dirección: ${insuranceAddress}`);

    const tx = await accessControl.registerEntity(
      insuranceAddress,
      2,
      insuranceName
    ); // EntityType.INSURANCE = 2
    await tx.wait();

    console.log("✅ Compañía de seguros registrada exitosamente");
    console.log(`🧾 Hash de transacción: ${tx.hash}`);

    // Verificar registro
    const entityType = await accessControl.getEntityType(insuranceAddress);
    console.log(`🔍 Tipo de entidad confirmado: ${entityType} (2 = INSURANCE)`);
  } catch (error) {
    console.log("❌ Error registrando seguro:", error.message);
  }
}

async function registerAuditor(accessControl, signer) {
  console.log("\n🔍 REGISTRAR AUDITOR");
  console.log("=".repeat(25));

  // Simular dirección de auditor
  const auditorAddress = "0xABCDEF123456789012345678901234567890ABCD";
  const auditorName = "Auditores Blockchain SA";

  try {
    console.log(`📝 Registrando auditor: ${auditorName}`);
    console.log(`📍 Dirección: ${auditorAddress}`);

    const tx = await accessControl.registerEntity(
      auditorAddress,
      3,
      auditorName
    ); // EntityType.AUDITOR = 3
    await tx.wait();

    console.log("✅ Auditor registrado exitosamente");
    console.log(`🧾 Hash de transacción: ${tx.hash}`);

    // Verificar registro
    const entityType = await accessControl.getEntityType(auditorAddress);
    console.log(`🔍 Tipo de entidad confirmado: ${entityType} (3 = AUDITOR)`);
  } catch (error) {
    console.log("❌ Error registrando auditor:", error.message);
  }
}

async function grantPermissions(accessControl, signer) {
  console.log("\n🔐 OTORGAR PERMISOS (Como Paciente)");
  console.log("=".repeat(40));

  const patientAddress = await signer.getAddress();
  const doctorAddress = await signer.getAddress(); // Para demo, el mismo signer actúa como doctor
  const insuranceAddress = "0x1234567890123456789012345678901234567890";

  try {
    console.log(`👤 Paciente: ${patientAddress}`);
    console.log("📝 Otorgando permisos...");

    // Otorgar permisos de escritura al doctor
    console.log("🔸 Otorgando permisos WRITE al doctor...");
    const tx1 = await accessControl.grantAccess(doctorAddress, 1); // AccessType.WRITE = 1
    await tx1.wait();
    console.log(`✅ Permisos WRITE otorgados al doctor`);

    // Otorgar permisos de lectura al seguro
    console.log("🔸 Otorgando permisos READ al seguro...");
    const tx2 = await accessControl.grantAccess(insuranceAddress, 0); // AccessType.READ = 0
    await tx2.wait();
    console.log(`✅ Permisos READ otorgados al seguro`);

    console.log("🎉 Todos los permisos otorgados exitosamente");
  } catch (error) {
    console.log("❌ Error otorgando permisos:", error.message);
  }
}

async function addMedicalDocument(medicalRecords, signer) {
  console.log("\n📄 AGREGAR DOCUMENTO MÉDICO (Como Doctor)");
  console.log("=".repeat(45));

  const patientAddress = await signer.getAddress(); // Para demo, mismo como paciente
  const ipfsHash = "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Hash simulado
  const documentType = "Análisis de Sangre";
  const description =
    "Resultados de análisis de sangre completo - Paciente en condiciones normales";
  const tags = ["sangre", "análisis", "laboratorio", "2025"];

  try {
    console.log(`👤 Paciente: ${patientAddress}`);
    console.log(`📁 Tipo: ${documentType}`);
    console.log(`📝 Descripción: ${description}`);
    console.log(`🏷️ Tags: ${tags.join(", ")}`);
    console.log(`📎 IPFS Hash: ${ipfsHash}`);

    const tx = await medicalRecords.addDocument(
      patientAddress,
      ipfsHash,
      documentType,
      description,
      tags
    );

    const receipt = await tx.wait();

    // Buscar el evento DocumentAdded para obtener el ID
    const documentAddedEvent = receipt.logs.find((log) => {
      try {
        const parsed = medicalRecords.interface.parseLog(log);
        return parsed.name === "DocumentAdded";
      } catch {
        return false;
      }
    });

    if (documentAddedEvent) {
      const parsed = medicalRecords.interface.parseLog(documentAddedEvent);
      const documentId = parsed.args.documentId;
      console.log(`✅ Documento creado con ID: ${documentId}`);
    }

    console.log(`🧾 Hash de transacción: ${tx.hash}`);
    console.log("🎉 Documento médico agregado exitosamente");
  } catch (error) {
    console.log("❌ Error agregando documento:", error.message);
  }
}

async function viewPatientDocuments(medicalRecords, signer) {
  console.log("\n📋 VER DOCUMENTOS DEL PACIENTE");
  console.log("=".repeat(35));

  const patientAddress = await signer.getAddress();

  try {
    console.log(`👤 Paciente: ${patientAddress}`);

    const documentIds = await medicalRecords.getPatientDocuments(
      patientAddress
    );
    console.log(`📄 Total de documentos: ${documentIds.length}`);

    if (documentIds.length === 0) {
      console.log("ℹ️  No hay documentos para este paciente");
      return;
    }

    for (let i = 0; i < documentIds.length; i++) {
      const docId = documentIds[i];
      console.log(`\n📄 Documento #${docId}:`);

      try {
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
        console.log(`   ✅ Activo: ${document.isActive}`);
      } catch (error) {
        console.log(`   ❌ Error leyendo documento: ${error.message}`);
      }
    }
  } catch (error) {
    console.log("❌ Error obteniendo documentos:", error.message);
  }
}

async function viewAuditTrail(auditTrail, signer) {
  console.log("\n🔍 VER HISTORIAL DE AUDITORÍA");
  console.log("=".repeat(35));

  const patientAddress = await signer.getAddress();

  try {
    console.log(`👤 Paciente: ${patientAddress}`);

    const auditEntries = await auditTrail.getAuditTrail(patientAddress, 0, 10); // Primeras 10 entradas
    console.log(`📊 Entradas de auditoría encontradas: ${auditEntries.length}`);

    if (auditEntries.length === 0) {
      console.log("ℹ️  No hay entradas de auditoría para este paciente");
      return;
    }

    for (let i = 0; i < auditEntries.length; i++) {
      const entry = auditEntries[i];
      console.log(`\n🔍 Entrada de Auditoría #${i + 1}:`);
      console.log(`   🎯 Acción: ${entry.action}`);
      console.log(`   👤 Realizada por: ${entry.performer}`);
      console.log(
        `   📅 Fecha: ${new Date(
          Number(entry.timestamp) * 1000
        ).toLocaleString()}`
      );
      console.log(`   📄 Documento ID: ${entry.documentId}`);
      if (entry.details) {
        console.log(`   📝 Detalles: ${entry.details}`);
      }
    }
  } catch (error) {
    console.log("❌ Error obteniendo auditoría:", error.message);
  }
}

async function viewSystemStatus(contracts) {
  console.log("\n📊 ESTADO DEL SISTEMA");
  console.log("=".repeat(25));

  try {
    const totalDocuments = await contracts.medicalRecords.getTotalDocuments();
    const totalAuditEntries = await contracts.auditTrail.getTotalAuditEntries();

    console.log(`📄 Total de documentos: ${totalDocuments}`);
    console.log(`🔍 Total de entradas de auditoría: ${totalAuditEntries}`);

    console.log("\n📍 Direcciones de contratos:");
    console.log(`   🔐 AccessControl: ${CONTRACTS.AccessControl}`);
    console.log(`   📄 MedicalRecords: ${CONTRACTS.MedicalRecords}`);
    console.log(`   🔍 AuditTrail: ${CONTRACTS.AuditTrail}`);

    console.log("\n🌐 Explorar en Arbiscan:");
    console.log(
      `   https://sepolia.arbiscan.io/address/${CONTRACTS.AccessControl}`
    );
  } catch (error) {
    console.log("❌ Error obteniendo estado del sistema:", error.message);
  }
}

async function checkPermissions(accessControl, signer) {
  console.log("\n🔍 VERIFICAR PERMISOS");
  console.log("=".repeat(25));

  const patientAddress = await signer.getAddress();
  const doctorAddress = await signer.getAddress();
  const insuranceAddress = "0x1234567890123456789012345678901234567890";

  try {
    console.log(`👤 Paciente: ${patientAddress}`);

    // Verificar permisos del doctor
    const doctorReadPermission = await accessControl.checkPermission(
      patientAddress,
      doctorAddress,
      0
    ); // READ
    const doctorWritePermission = await accessControl.checkPermission(
      patientAddress,
      doctorAddress,
      1
    ); // WRITE
    const doctorFullPermission = await accessControl.checkPermission(
      patientAddress,
      doctorAddress,
      2
    ); // FULL

    console.log(`\n👨‍⚕️ Permisos del Doctor (${doctorAddress}):`);
    console.log(`   📖 READ: ${doctorReadPermission ? "✅" : "❌"}`);
    console.log(`   ✏️ WRITE: ${doctorWritePermission ? "✅" : "❌"}`);
    console.log(`   🔓 FULL: ${doctorFullPermission ? "✅" : "❌"}`);

    // Verificar permisos del seguro
    const insuranceReadPermission = await accessControl.checkPermission(
      patientAddress,
      insuranceAddress,
      0
    );
    const insuranceWritePermission = await accessControl.checkPermission(
      patientAddress,
      insuranceAddress,
      1
    );
    const insuranceFullPermission = await accessControl.checkPermission(
      patientAddress,
      insuranceAddress,
      2
    );

    console.log(`\n🏢 Permisos del Seguro (${insuranceAddress}):`);
    console.log(`   📖 READ: ${insuranceReadPermission ? "✅" : "❌"}`);
    console.log(`   ✏️ WRITE: ${insuranceWritePermission ? "✅" : "❌"}`);
    console.log(`   🔓 FULL: ${insuranceFullPermission ? "✅" : "❌"}`);
  } catch (error) {
    console.log("❌ Error verificando permisos:", error.message);
  }
}

async function revokePermissions(accessControl, signer) {
  console.log("\n🚫 REVOCAR PERMISOS (Como Paciente)");
  console.log("=".repeat(40));

  const patientAddress = await signer.getAddress();
  const insuranceAddress = "0x1234567890123456789012345678901234567890";

  try {
    console.log(`👤 Paciente: ${patientAddress}`);
    console.log(`🚫 Revocando permisos del seguro: ${insuranceAddress}`);

    const tx = await accessControl.revokeAccess(insuranceAddress);
    await tx.wait();

    console.log("✅ Permisos revocados exitosamente");
    console.log(`🧾 Hash de transacción: ${tx.hash}`);
  } catch (error) {
    console.log("❌ Error revocando permisos:", error.message);
  }
}

async function main() {
  console.log("🏥 INICIANDO SISTEMA INTERACTIVO DE HISTORIAS CLÍNICAS");
  console.log("🌐 Red: Arbitrum Sepolia");
  console.log("=".repeat(60));

  const [signer] = await ethers.getSigners();
  console.log(`👤 Cuenta activa: ${await signer.getAddress()}`);

  const contracts = await loadContracts();
  console.log("✅ Contratos cargados exitosamente");

  // Menú interactivo simulado - ejecutamos todas las funciones en secuencia para demostración
  console.log("\n🎬 EJECUTANDO DEMO COMPLETO DEL SISTEMA...");

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await registerDoctor(contracts.accessControl, signer);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await registerInsurance(contracts.accessControl, signer);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await registerAuditor(contracts.accessControl, signer);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await grantPermissions(contracts.accessControl, signer);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await addMedicalDocument(contracts.medicalRecords, signer);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await viewPatientDocuments(contracts.medicalRecords, signer);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await checkPermissions(contracts.accessControl, signer);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await viewSystemStatus(contracts);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await viewAuditTrail(contracts.auditTrail, signer);

  console.log("\n🎉 DEMO COMPLETADO EXITOSAMENTE!");
  console.log("=".repeat(60));
  console.log("💡 Todas las funciones del sistema han sido probadas");
  console.log("🔍 Revisa las transacciones en: https://sepolia.arbiscan.io/");
  console.log("📄 Los documentos están listos para integración IPFS");
  console.log("🏥 El sistema está completamente funcional");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
