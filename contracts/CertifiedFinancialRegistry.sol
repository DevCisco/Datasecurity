// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CertifiedFinancialRegistry {
    using ECDSA for bytes32;

    // =======================
    // COSTANTI E PARAMETRI
    // =======================
    uint64 public constant TRANSACTION_FEE = 0.01 ether;

    address public immutable trustedSigner; // indirizzo del trusted signer
    address payable public immutable owner;

    // =======================
    // STRUTTURA DATI
    // =======================
    struct TransactionRecord {
        bytes32 operationHash; // hash dell’operazione completa off-chain
        uint256 timestamp;     // momento di registrazione
    }

    // =======================
    // STORAGE
    // =======================
    mapping(address => TransactionRecord[]) private userTransactions;
    mapping(bytes32 => bool) private usedOperations; // protezione replay

    // =======================
    // EVENTI
    // =======================
    event TransactionInserted(
        address indexed user,
        bytes32 indexed operationHash,
        uint256 timestamp
    );

    // =======================
    // COSTRUTTORE
    // =======================
    constructor(address _trustedSigner) {
        trustedSigner = _trustedSigner;
        owner = payable(msg.sender);
    }

    // =======================
    // MODIFIER (GUARD CHECK)
    // =======================
    modifier validFee() {
        require(msg.value == TRANSACTION_FEE, "Invalid transaction fee");
        _;
    }

    modifier unusedOperation(bytes32 operationHash) {
        require(!usedOperations[operationHash], "Operation already used");
        _;
    }

    // =======================
    // FUNZIONE PRINCIPALE
    // =======================
    function insertTransaction(
    bytes32 operationHash,
    bytes calldata signature
)
    external
    payable
    unusedOperation(operationHash)
{
    require(operationHash != bytes32(0), "Invalid operation hash");

    // Hash manuale come toEthSignedMessageHash
    bytes32 ethSignedMessageHash = keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32", operationHash)
    );

    address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
    require(recoveredSigner == trustedSigner, "Invalid signature");

    // Check-Effects-Interaction
    usedOperations[operationHash] = true;
    userTransactions[msg.sender].push(
        TransactionRecord({
            operationHash: operationHash,
            timestamp: block.timestamp
        })
    );

    emit TransactionInserted(msg.sender, operationHash, block.timestamp);

    // Secure Ether Transfer
    owner.transfer(msg.value);
}



    // =======================
    // LETTURA (SOLO PROPRIE)
    // =======================
    function getMyTransactions()
        external
        view
        returns (TransactionRecord[] memory)
    {
        return userTransactions[msg.sender];
    }
}