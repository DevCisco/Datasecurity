// === GLOBAL VARIABLES ===
let provider;
let signer;
let contract; // In futuro collegherai il contratto Solidity

// === FUNZIONE PER CONNETTERE METAMASK ===
window.connectMetaMask = async function() {
    try {
        if (!window.ethereum) {
            alert("MetaMask non installato!");
            return;
        }

        // 2️⃣ Richiesta accesso all'account
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // 3️⃣ Crea provider e signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // 4️⃣ Carica ABI
        const abiResponse = await fetch('./abi.json');
        const contractABI = await abiResponse.json();

        // 5️⃣ Carica indirizzo contratto
        const addrResponse = await fetch('./indirizzo.json');
        const addrJson = await addrResponse.json();
        const contractAddress = addrJson.address;

        // 6️⃣ Crea istanza del contratto
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("Contract pronto:", contract);

        alert("MetaMask connesso correttamente!");

        // 7️⃣ Mostra UI
        const form = document.getElementById("transactionForm");
        if (form) form.style.display = "block";

        const accessLinks = document.getElementById("accessLinks");
        if (accessLinks) accessLinks.style.display = "block";

        const transactionlists = document.getElementById("transactionsList");
        if (transactionlists) transactionlists.style.display = "block";

    } catch (err) {
        console.error("Errore connectMetaMask:", err);
        alert("Errore durante la connessione a MetaMask. Controlla console.");
    }
};
// === FUNZIONE PER AGGIUNGERE TRANSAZIONE (addTransaction.html) ===
window.submitTransaction = async function() {
    if (!contract) {
        alert("Collega prima MetaMask");
        return;
    }

    // Prendi valori dal form
    const operationHash = document.getElementById("operation").value.trim();
    const signature = document.getElementById("signature").value.trim();

    if (!operationHash || !signature) {
        alert("Inserisci sia operationHash che signature");
        return;
    }

    try {
        // Invia la transazione al contratto
        await contract.insertTransaction(operationHash, signature, { value: ethers.parseEther("0.01") });

        alert("Transazione registrata correttamente!");

        // Pulisci form
        document.getElementById("operation").value = "";
        document.getElementById("signature").value = "";

    } catch (err) {
        console.error("Errore submitTransaction:", err);
        alert("Errore durante la transazione. Controlla console.");
    }
};


// === FUNZIONE PER CARICARE TRANSAZIONI (viewTransactions.html) ===
window.loadTransactions = async function() {
    if (!signer) {
        console.log("Collega MetaMask per vedere le transazioni");
        return;
    }

    const txList = document.getElementById("txList");
    if (!txList) return;

    // Pulisce lista
    txList.innerHTML = "";

};