#!/bin/bash
set -e

# Load .env variables
export $(grep -v '^#' .env | xargs)

if [[ -z "$PRIVATE_KEY" || "$PRIVATE_KEY" == *"your"* || "$PRIVATE_KEY" == "0xacf3"* || ${#PRIVATE_KEY} -lt 64 ]]; then
    echo "❌ Error: Please put a valid PRIVATE_KEY with Sepolia ETH in your .env file."
    echo "   (Open .env in your editor, replace the PRIVATE_KEY value, and run this again)"
    exit 1
fi

echo "🚀 Deploying contracts to Sepolia..."
# We run without --verify for speed, but you can add it if needed on Etherscan
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com \
  --private-key "$PRIVATE_KEY" \
  --broadcast

echo "🔍 Extracting addresses from broadcast JSON..."
BROADCAST_FILE="broadcast/Deploy.s.sol/11155111/run-latest.json"

if [ ! -f "$BROADCAST_FILE" ]; then
    echo "❌ Error: Deployment broadcast file not found for Sepolia (chain 11155111)."
    exit 1
fi

VERIFIER_ADDR=$(jq -r '.transactions[] | select(.contractName == "DummyVerifier") | .contractAddress' "$BROADCAST_FILE")
REGISTRY_ADDR=$(jq -r '.transactions[] | select(.contractName == "ProductRegistry") | .contractAddress' "$BROADCAST_FILE")

if [[ -z "$VERIFIER_ADDR" || -z "$REGISTRY_ADDR" || "$VERIFIER_ADDR" == "null" || "$REGISTRY_ADDR" == "null" ]]; then
    echo "❌ Error: Could not parse contract addresses from broadcast."
    exit 1
fi

echo "✅ DummyVerifier deployed to: $VERIFIER_ADDR"
echo "✅ ProductRegistry deployed to: $REGISTRY_ADDR"

echo "📝 Updating .env file..."
sed -i '' "s/^CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=$REGISTRY_ADDR/" .env
sed -i '' "s/^VITE_CONTRACT_ADDRESS=.*/VITE_CONTRACT_ADDRESS=$REGISTRY_ADDR/" .env
sed -i '' "s/^VITE_VERIFIER_ADDRESS=.*/VITE_VERIFIER_ADDRESS=$VERIFIER_ADDR/" .env

echo "🎉 All done! Your .env has been automatically updated."
echo "🔄 If your frontend dev server is running, you must restart it manually to load the new addresses."
