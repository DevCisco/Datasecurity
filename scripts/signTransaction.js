// signTransaction.js
import { ethers } from "ethers";
import readline from "readline";

// === CONFIGURAZIONE ===
// Qui metti la chiave privata del trusted signer (NON condividerla)
const PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; 
const wallet = new ethers.Wallet(PRIVATE_KEY);

// === INTERFACCIA CMD ===
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Chiede all'utente la stringa dell'operazione
rl.question("Inserisci operazione: ", async (input) => {
    if (!input) {
            console.log("Errore: input vuoto");
            rl.close();
            return;
        }

        // 1️⃣ Calcola operationHash
        const operationHash = ethers.keccak256(ethers.toUtf8Bytes(input));
        const ethSignedMessageHash = ethers.hashMessage(ethers.toUtf8Bytes(operationHash));

        // 2️⃣ Firma l'operationHash
        // ethers.signMessage aggiunge il prefisso Ethereum 
        const signature = await wallet.signMessage(operationHash);

        // 3️⃣ Mostra output
        console.log("\n=== RISULTATI ===");
        console.log("Operation Hash:", ethSignedMessageHash);
        console.log("Signature    :", signature);
});
