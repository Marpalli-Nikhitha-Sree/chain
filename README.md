Supply-Chain Tracking System

Overview
- On-chain model for batches, transfers, and environmental conditions.
- Participant app for manufacturers, distributors, and retailers.
- Consumer-facing verification interface with anomaly detection rules.
- Enforced flow: Manufacturer → Distributor → Retailer → Consumer.

Local development (Hardhat)
1) Install dependencies with npm.
2) Start a local Hardhat node.
3) Deploy the contract to localhost.
4) Update frontend/config.js with the deployed contract address.
5) Open frontend/dashboard.html to select a role.

Deploy to Sepolia
1) Copy .env.example to .env and set SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY locally.
2) Deploy: npx hardhat run scripts/deploy.js --network sepolia
3) Update frontend/config.js with the Sepolia contract address.
4) Switch MetaMask to Sepolia and refresh the app.

Role workspace
- Main dashboard: frontend/dashboard.html
- Unified role workspace: frontend/role.html?role=manufacturer|distributor|retailer|customer
- Customer details are encoded into a QR code for verification.

Security and privacy
- Only public wallet addresses are stored locally for identification.
- MetaMask remains the authority for network selection and signing.
- Read-only interactions by default; write actions require explicit opt-in.
# chain
