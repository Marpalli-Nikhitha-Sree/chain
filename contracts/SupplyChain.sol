// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {

    struct Batch {
        string batchId;
        string productName;
        address manufacturer;
        string origin;
        address[] expectedRoute;
        uint256 createdAt;
        string metadata;
        string category;
        uint256 price;
        int256 latitude;
        int256 longitude;
        address currentHolder;
        uint8 stage;
        address pendingBuyer;
        uint256 pendingAmount;
        bool exists;
    }

    struct TransferRecord {
        address from;
        address to;
        uint256 timestamp;
        string location;
        string metadata;
    }

    struct ConditionRecord {
        string conditionType;
        string value;
        uint256 observedAt;
        uint256 recordedAt;
    }

    mapping(string => Batch) private batches;
    mapping(string => TransferRecord[]) private transfers;
    mapping(string => ConditionRecord[]) private conditions;
    string[] private batchIds;

    event BatchCreated(
        string batchId,
        address indexed manufacturer,
        string productName,
        string origin,
        address[] expectedRoute,
        uint256 createdAt,
        string metadata
    );

    event TransferRecorded(
        string batchId,
        address indexed from,
        address indexed to,
        uint256 timestamp,
        string location,
        string metadata
    );

    event ConditionRecorded(
        string batchId,
        string conditionType,
        string value,
        uint256 observedAt,
        uint256 recordedAt
    );

    event PurchaseRequested(string batchId, address indexed buyer, uint256 amount);
    event PurchaseAccepted(
        string batchId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        string location,
        string metadata
    );
    event ReceiptRecorded(string batchId, address indexed holder, int256 latitude, int256 longitude);

    error InvalidTransferStage(string batchId, uint8 stage);
    error InvalidTransferActor(string batchId, address actor);
    error NoPendingBuyer(string batchId);
    error InvalidPayment(string batchId, uint256 amount);

    error BatchAlreadyExists(string batchId);
    error BatchNotFound(string batchId);

    constructor() {}

    function createBatch(
        string calldata batchId,
        string calldata productName,
        string calldata origin,
        address[] calldata expectedRoute,
        string calldata metadata,
        string calldata category,
        uint256 price,
        int256 latitude,
        int256 longitude
    ) external {
        if (batches[batchId].exists) {
            revert BatchAlreadyExists(batchId);
        }

        batches[batchId] = Batch({
            batchId: batchId,
            productName: productName,
            manufacturer: msg.sender,
            origin: origin,
            expectedRoute: expectedRoute,
            createdAt: block.timestamp,
            metadata: metadata,
            category: category,
            price: price,
            latitude: latitude,
            longitude: longitude,
            currentHolder: msg.sender,
            stage: 0,
            pendingBuyer: address(0),
            pendingAmount: 0,
            exists: true
        });

        batchIds.push(batchId);

        emit BatchCreated(
            batchId,
            msg.sender,
            productName,
            origin,
            expectedRoute,
            block.timestamp,
            metadata
        );
    }

    function recordTransfer(
        string calldata batchId,
        address to,
        string calldata location,
        string calldata metadata
    ) external {
        _requireBatch(batchId);

        Batch storage batch = batches[batchId];
        if (batch.currentHolder != msg.sender) {
            revert InvalidTransferActor(batchId, msg.sender);
        }

        if (batch.stage > 2) {
            revert InvalidTransferStage(batchId, batch.stage);
        }

        transfers[batchId].push(
            TransferRecord({
                from: msg.sender,
                to: to,
                timestamp: block.timestamp,
                location: location,
                metadata: metadata
            })
        );

        batch.currentHolder = to;
        batch.stage += 1;

        emit TransferRecorded(batchId, msg.sender, to, block.timestamp, location, metadata);
    }

    function buyProduct(string calldata batchId) external payable {
        _requireBatch(batchId);
        Batch storage batch = batches[batchId];

        if (msg.value != batch.price) {
            revert InvalidPayment(batchId, msg.value);
        }

        if (batch.pendingBuyer != address(0)) {
            revert NoPendingBuyer(batchId);
        }

        if (batch.stage > 2) {
            revert InvalidTransferStage(batchId, batch.stage);
        }

        batch.pendingBuyer = msg.sender;
        batch.pendingAmount = msg.value;

        emit PurchaseRequested(batchId, msg.sender, msg.value);
    }

    function shipProduct(
        string calldata batchId,
        string calldata location,
        string calldata metadata,
        int256 latitude,
        int256 longitude
    ) external {
        _requireBatch(batchId);
        Batch storage batch = batches[batchId];

        if (batch.currentHolder != msg.sender) {
            revert InvalidTransferActor(batchId, msg.sender);
        }
        if (batch.pendingBuyer == address(0)) {
            revert NoPendingBuyer(batchId);
        }

        if (batch.stage > 2) {
            revert InvalidTransferStage(batchId, batch.stage);
        }

        uint256 amount = batch.pendingAmount;
        address buyer = batch.pendingBuyer;
        batch.pendingBuyer = address(0);
        batch.pendingAmount = 0;

        batch.currentHolder = buyer;
        batch.stage += 1;
        batch.latitude = latitude;
        batch.longitude = longitude;

        transfers[batchId].push(
            TransferRecord({
                from: msg.sender,
                to: buyer,
                timestamp: block.timestamp,
                location: location,
                metadata: metadata
            })
        );

        emit TransferRecorded(batchId, msg.sender, buyer, block.timestamp, location, metadata);
        emit PurchaseAccepted(batchId, msg.sender, buyer, amount, location, metadata);

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Payment transfer failed");
    }

    function receiveProduct(
        string calldata batchId,
        int256 latitude,
        int256 longitude
    ) external {
        _requireBatch(batchId);
        Batch storage batch = batches[batchId];
        require(batch.currentHolder == msg.sender, "Only holder can receive");

        batch.latitude = latitude;
        batch.longitude = longitude;

        emit ReceiptRecorded(batchId, msg.sender, latitude, longitude);
    }

    function recordCondition(
        string calldata batchId,
        string calldata conditionType,
        string calldata value,
        uint256 observedAt
    ) external {
        _requireBatch(batchId);

        conditions[batchId].push(
            ConditionRecord({
                conditionType: conditionType,
                value: value,
                observedAt: observedAt,
                recordedAt: block.timestamp
            })
        );

        emit ConditionRecorded(batchId, conditionType, value, observedAt, block.timestamp);
    }

    function getBatch(string calldata batchId) external view returns (Batch memory) {
        _requireBatch(batchId);
        return batches[batchId];
    }

    function getBatchIds() external view returns (string[] memory) {
        return batchIds;
    }

    function getTransfers(string calldata batchId) external view returns (TransferRecord[] memory) {
        _requireBatch(batchId);
        return transfers[batchId];
    }

    function getConditions(string calldata batchId) external view returns (ConditionRecord[] memory) {
        _requireBatch(batchId);
        return conditions[batchId];
    }

    function _requireBatch(string calldata batchId) internal view {
        if (!batches[batchId].exists) {
            revert BatchNotFound(batchId);
        }
    }

}
