const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Prendi i primi due account
  const [deployer, trustedSigner] = await hre.ethers.getSigners();

  console.log("Deployer address:", deployer.address);
  console.log("Trusted signer address:", trustedSigner.address);

  // Ottieni il contract factory
  const Registry = await hre.ethers.getContractFactory("CertifiedFinancialRegistry");

  // Deploy passando l'indirizzo del trusted signer
  const registry = await Registry.deploy(trustedSigner.address);

  // In ethers v6, l'indirizzo del contratto è registry.target
  console.log("Contract deployed to:", registry.target);

  // Percorso assoluto per frontend/indirizzo.json
  const frontendPath = path.join(__dirname, "..", "frontend");
  const filePath = path.join(frontendPath, "indirizzo.json");

  // Se la cartella frontend non esiste, creala
  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }

  // Scrivi l’indirizzo nel file JSON
  fs.writeFileSync(filePath, JSON.stringify({ address: registry.target }, null, 2));

  console.log("Contract address saved to:", filePath);
}

// Esegui e cattura errori
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
