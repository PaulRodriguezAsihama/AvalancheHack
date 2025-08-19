# 🚀 Instrucciones de Configuración para Despliegue en Arbitrum

## 📋 Pasos para Configurar tu Entorno

### 1. 🔑 Configurar Archivo .env

Copia el archivo `.env.example` a `.env`:

```bash
Copy-Item .env.example .env
```

### 2. 🔐 Obtener tu Clave Privada

**⚠️ IMPORTANTE: Usa una wallet de desarrollo, NUNCA tu wallet principal**

#### Opción A: MetaMask

1. Abre MetaMask
2. Ve a Account Details → Export Private Key
3. Ingresa tu contraseña
4. Copia la clave privada (sin el prefijo 0x)

#### Opción B: Crear nueva wallet con Hardhat

```bash
npx hardhat console
# En la consola:
const wallet = ethers.Wallet.createRandom()
console.log("Address:", wallet.address)
console.log("Private Key:", wallet.privateKey)
```

### 3. 🌐 Obtener ETH para Testnet (Arbitrum Sepolia)

#### Paso 1: Obtener Sepolia ETH

- Ve a: https://sepoliafaucet.com/
- Conecta tu wallet
- Solicita ETH de testnet

#### Paso 2: Bridge a Arbitrum Sepolia

- Ve a: https://bridge.arbitrum.io/
- Cambia a "Sepolia" network
- Bridge tu ETH de Sepolia a Arbitrum Sepolia

### 4. 📝 Obtener Arbiscan API Key

1. Ve a: https://arbiscan.io/apis
2. Crea una cuenta gratuita
3. Genera un API Key
4. Copia el API Key

### 5. ✏️ Editar tu archivo .env

Abre el archivo `.env` y completa:

```bash
# Tu clave privada (SIN el prefijo 0x)
PRIVATE_KEY=tu_clave_privada_aqui

# Tu API key de Arbiscan
ARBISCAN_API_KEY=tu_api_key_aqui

# Tu dirección de deployer
DEPLOYER_ADDRESS=tu_direccion_aqui
```

### 6. 🧪 Verificar Configuración

```bash
npm run check
```

### 7. 🚀 Desplegar en Testnet

```bash
npm run deploy:arbitrum-sepolia
```

### 8. ✅ Verificar Contratos

```bash
npm run verify:arbitrum-sepolia
```

## 💰 Costos Estimados

- **Arbitrum Sepolia (Testnet)**: GRATIS ✅
- **Arbitrum One (Mainnet)**: ~$1-5 USD (vs ~$100-500 en Ethereum)

## 🆘 Resolución de Problemas

### Error: "insufficient funds"

- Verifica que tienes ETH en Arbitrum Sepolia
- Usa el bridge si solo tienes ETH en Sepolia

### Error: "Invalid private key"

- Asegúrate de que la clave privada NO tenga el prefijo "0x"
- Verifica que copiaste toda la clave

### Error: "Network not supported"

- Verifica que tu RPC URL esté correcta
- Intenta usar una RPC alternativa (Alchemy/Infura)

## 📞 Comandos Útiles

```bash
# Verificar balance
npm run balance

# Ver estado de la red
npm run network-info

# Interactuar con contratos desplegados
npm run interact:arbitrum-sepolia
```

---

**¿Listo para continuar?**

1. Configura tu `.env`
2. Obtén ETH de testnet
3. Ejecuta `npm run deploy:arbitrum-sepolia` 🚀
