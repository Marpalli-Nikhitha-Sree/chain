const SUPPLYCHAIN_CONFIG = {
  CONTRACT_ADDRESS: "0x487Aa38f22Ebf6DF2602a780BA00377D4b4CA618",
  STORAGE_KEY: "supplychain.walletAddress",
  ABI: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": false, "internalType": "string", "name": "batchId", "type": "string" },
        { "indexed": true, "internalType": "address", "name": "manufacturer", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "productName", "type": "string" },
        { "indexed": false, "internalType": "string", "name": "origin", "type": "string" },
        { "indexed": false, "internalType": "address[]", "name": "expectedRoute", "type": "address[]" },
        { "indexed": false, "internalType": "uint256", "name": "createdAt", "type": "uint256" },
        { "indexed": false, "internalType": "string", "name": "metadata", "type": "string" }
      ],
      "name": "BatchCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": false, "internalType": "string", "name": "batchId", "type": "string" },
        { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "indexed": false, "internalType": "string", "name": "location", "type": "string" },
        { "indexed": false, "internalType": "string", "name": "metadata", "type": "string" }
      ],
      "name": "TransferRecorded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": false, "internalType": "string", "name": "batchId", "type": "string" },
        { "indexed": false, "internalType": "string", "name": "conditionType", "type": "string" },
        { "indexed": false, "internalType": "string", "name": "value", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "observedAt", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "recordedAt", "type": "uint256" }
      ],
      "name": "ConditionRecorded",
      "type": "event"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "batchId", "type": "string" },
        { "internalType": "string", "name": "productName", "type": "string" },
        { "internalType": "string", "name": "origin", "type": "string" },
        { "internalType": "address[]", "name": "expectedRoute", "type": "address[]" },
        { "internalType": "string", "name": "metadata", "type": "string" },
        { "internalType": "string", "name": "category", "type": "string" },
        { "internalType": "uint256", "name": "price", "type": "uint256" },
        { "internalType": "int256", "name": "latitude", "type": "int256" },
        { "internalType": "int256", "name": "longitude", "type": "int256" }
      ],
      "name": "createBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "string", "name": "batchId", "type": "string" }],
      "name": "buyProduct",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "batchId", "type": "string" },
        { "internalType": "string", "name": "location", "type": "string" },
        { "internalType": "string", "name": "metadata", "type": "string" },
        { "internalType": "int256", "name": "latitude", "type": "int256" },
        { "internalType": "int256", "name": "longitude", "type": "int256" }
      ],
      "name": "shipProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "batchId", "type": "string" },
        { "internalType": "int256", "name": "latitude", "type": "int256" },
        { "internalType": "int256", "name": "longitude", "type": "int256" }
      ],
      "name": "receiveProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "batchId", "type": "string" },
        { "internalType": "string", "name": "conditionType", "type": "string" },
        { "internalType": "string", "name": "value", "type": "string" },
        { "internalType": "uint256", "name": "observedAt", "type": "uint256" }
      ],
      "name": "recordCondition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "batchId", "type": "string" },
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "string", "name": "location", "type": "string" },
        { "internalType": "string", "name": "metadata", "type": "string" }
      ],
      "name": "recordTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "string", "name": "batchId", "type": "string" }],
      "name": "getBatch",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "batchId", "type": "string" },
            { "internalType": "string", "name": "productName", "type": "string" },
            { "internalType": "address", "name": "manufacturer", "type": "address" },
            { "internalType": "string", "name": "origin", "type": "string" },
            { "internalType": "address[]", "name": "expectedRoute", "type": "address[]" },
            { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
            { "internalType": "string", "name": "metadata", "type": "string" },
            { "internalType": "string", "name": "category", "type": "string" },
            { "internalType": "uint256", "name": "price", "type": "uint256" },
            { "internalType": "int256", "name": "latitude", "type": "int256" },
            { "internalType": "int256", "name": "longitude", "type": "int256" },
            { "internalType": "address", "name": "currentHolder", "type": "address" },
            { "internalType": "uint8", "name": "stage", "type": "uint8" },
            { "internalType": "address", "name": "pendingBuyer", "type": "address" },
            { "internalType": "uint256", "name": "pendingAmount", "type": "uint256" },
            { "internalType": "bool", "name": "exists", "type": "bool" }
          ],
          "internalType": "struct SupplyChain.Batch",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBatchIds",
      "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "string", "name": "batchId", "type": "string" }],
      "name": "getTransfers",
      "outputs": [
        {
          "components": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
            { "internalType": "string", "name": "location", "type": "string" },
            { "internalType": "string", "name": "metadata", "type": "string" }
          ],
          "internalType": "struct SupplyChain.TransferRecord[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "string", "name": "batchId", "type": "string" }],
      "name": "getConditions",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "conditionType", "type": "string" },
            { "internalType": "string", "name": "value", "type": "string" },
            { "internalType": "uint256", "name": "observedAt", "type": "uint256" },
            { "internalType": "uint256", "name": "recordedAt", "type": "uint256" }
          ],
          "internalType": "struct SupplyChain.ConditionRecord[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};
