# Guía de Despliegue en Arbitrum

Esta guía te ayudará a desplegar los contratos del sistema de registros médicos en la red Arbitrum.

## 📋 Requisitos Previos

### 1. Instalación de Dependencias

```bash
# Instalar Node.js (versión 16 o superior)
# Descargar desde: https://nodejs.org/

# Instalar dependencias del proyecto
npm install

# Instalar Hardhat globalmente (opcional)
npm install -g hardhat
```

### 2. Configuración del Entorno

1. **Copia el archivo de variables de entorno:**

   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env` con tus datos:**

   ```bash
   # Clave privada de la cuenta que desplegará (¡NUNCA la subas a GitHub!)
   PRIVATE_KEY=tu_clave_privada_aqui

   # URLs de RPC (puedes usar las por defecto o configurar Alchemy/Infura)
   ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
   ARBITRUM_MAINNET_RPC_URL=https://arb1.arbitrum.io/rpc

   # API Key de Arbiscan para verificación de contratos
   ARBISCAN_API_KEY=tu_api_key_de_arbiscan
   ```

### 3. Obtener ETH de Prueba (Para Arbitrum Sepolia)

1. **Obtén ETH en Ethereum Sepolia:**

   - https://sepoliafaucet.com/
   - https://faucet.quicknode.com/ethereum/sepolia

2. **Transfiere ETH a Arbitrum Sepolia:**
   - Ve a: https://bridge.arbitrum.io/
   - Conecta tu wallet
   - Selecciona "Ethereum Sepolia" → "Arbitrum Sepolia"
   - Transfiere al menos 0.1 ETH

## 🚀 Proceso de Despliegue

### Paso 1: Compilar Contratos

```bash
npm run compile
```

### Paso 2: Ejecutar Tests (Opcional pero Recomendado)

```bash
npm run test
```

### Paso 3: Desplegar en Arbitrum Sepolia (Testnet)

```bash
npm run deploy:arbitrum-sepolia
```

**Salida esperada:**

```
🚀 Starting deployment on arbitrumSepolia
📍 Deploying with account: 0x742d35Cc6669C7e7D1dD6e4E72BDC8D4bF0DeF3B
💰 Account balance: 0.1 ETH

📋 Step 1: Deploying AccessControl contract...
✅ AccessControl deployed to: 0x1234567890123456789012345678901234567890

📋 Step 2: Deploying MedicalRecords contract...
✅ MedicalRecords deployed to: 0x2345678901234567890123456789012345678901

📋 Step 3: Deploying AuditTrail contract...
✅ AuditTrail deployed to: 0x3456789012345678901234567890123456789012

🎉 Deployment completed successfully!
```

### Paso 4: Verificar Contratos en Arbiscan

```bash
npm run verify:arbitrum-sepolia
```

### Paso 5: Desplegar en Arbitrum Mainnet (Producción)

⚠️ **¡CUIDADO!** Este despliegue usará ETH real.

```bash
npm run deploy:arbitrum-mainnet
```

## 🔧 Configuración Post-Despliegue

### 1. Registrar Entidades Iniciales

Usa el script de interacción para registrar doctores, compañías de seguros y auditores:

```bash
npx hardhat run scripts/interact.js --network arbitrumSepolia
```

O modifica el script para registrar entidades específicas:

```javascript
// En scripts/interact.js, descomenta y modifica:
await interactionFunctions.registerDoctor(
  contracts,
  "0xDoctorAddress",
  "Dr. García"
);
await interactionFunctions.registerInsurance(
  contracts,
  "0xInsuranceAddress",
  "Seguros Médicos SA"
);
await interactionFunctions.registerAuditor(
  contracts,
  "0xAuditorAddress",
  "Auditoría Salud SL"
);
```

### 2. Verificar el Estado del Sistema

```bash
npx hardhat run scripts/interact.js --network arbitrumSepolia
```

## 📁 Archivos de Despliegue

Después del despliegue, encontrarás:

- `deployments/arbitrumSepolia-deployment.json` - Direcciones y detalles del despliegue en testnet
- `deployments/arbitrumOne-deployment.json` - Direcciones y detalles del despliegue en mainnet

**Ejemplo de archivo de despliegue:**

```json
{
  "network": "arbitrumSepolia",
  "deployer": "0x742d35Cc6669C7e7D1dD6e4E72BDC8D4bF0DeF3B",
  "timestamp": "2025-08-03T10:30:00.000Z",
  "contracts": {
    "accessControl": {
      "address": "0x1234567890123456789012345678901234567890",
      "txHash": "0xabc123..."
    },
    "medicalRecords": {
      "address": "0x2345678901234567890123456789012345678901",
      "txHash": "0xdef456..."
    },
    "auditTrail": {
      "address": "0x3456789012345678901234567890123456789012",
      "txHash": "0x789ghi..."
    }
  }
}
```

## 💡 Comandos Útiles

```bash
# Limpiar artefactos de compilación
npm run clean

# Compilar contratos
npm run compile

# Ejecutar tests
npm run test

# Reportar uso de gas
npm run gas

# Verificar tamaño de contratos
npm run size

# Ejecutar nodo local para pruebas
npm run node

# Desplegar en red local
npm run deploy:localhost

# Interactuar con contratos desplegados
npx hardhat run scripts/interact.js --network [NETWORK]
```

## 🔍 Enlaces Útiles

### Arbitrum Sepolia (Testnet)

- **Block Explorer:** https://sepolia.arbiscan.io/
- **Bridge:** https://bridge.arbitrum.io/
- **RPC URL:** https://sepolia-rollup.arbitrum.io/rpc
- **Chain ID:** 421614

### Arbitrum One (Mainnet)

- **Block Explorer:** https://arbiscan.io/
- **Bridge:** https://bridge.arbitrum.io/
- **RPC URL:** https://arb1.arbitrum.io/rpc
- **Chain ID:** 42161

### APIs y Servicios

- **Arbiscan API:** https://arbiscan.io/apis
- **Alchemy:** https://www.alchemy.com/
- **Infura:** https://infura.io/
- **QuickNode:** https://www.quicknode.com/

## 💸 Costos de Despliegue

Los costos en Arbitrum son significativamente menores que en Ethereum mainnet:

- **Arbitrum Sepolia:** Gratis (testnet)
- **Arbitrum One:** ~$1-5 USD para desplegar los tres contratos

### Estimación de Gas:

- AccessControl: ~500,000 gas
- MedicalRecords: ~800,000 gas
- AuditTrail: ~1,000,000 gas
- **Total:** ~2,300,000 gas

## 🛠️ Troubleshooting

### Error: "insufficient funds"

- Asegúrate de tener suficiente ETH en tu wallet
- Para testnet, usa el bridge de Arbitrum para obtener ETH

### Error: "nonce too high"

- Espera a que se confirmen las transacciones anteriores
- O usa `--reset` en Hardhat

### Error: "network not found"

- Verifica que hayas configurado correctamente `hardhat.config.js`
- Asegúrate de que las URLs de RPC sean correctas

### Error de verificación de contratos

- Verifica que tu API key de Arbiscan sea correcta
- Espera unos minutos después del despliegue antes de verificar

## 🔒 Seguridad

### ⚠️ IMPORTANTE:

- **NUNCA** subas tu clave privada a GitHub
- Usa un archivo `.env` y agrégalo a `.gitignore`
- Para producción, considera usar un wallet hardware o multisig
- Verifica siempre las direcciones de los contratos antes de interactuar

### Buenas Prácticas:

1. Prueba primero en testnet
2. Verifica los contratos en el explorador
3. Realiza pruebas de funcionalidad post-despliegue
4. Documenta todas las direcciones de contratos
5. Configura monitoreo para transacciones importantes

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de error completos
2. Verifica la configuración de red en `hardhat.config.js`
3. Consulta la documentación de Arbitrum: https://docs.arbitrum.io/
4. Revisa el estado de la red: https://status.arbitrum.io/

¡Felicidades! Ya tienes tu sistema de registros médicos desplegado en Arbitrum. 🎉
