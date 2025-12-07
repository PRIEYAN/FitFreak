#!/bin/bash

set -e

CLUSTER=${1:-devnet}

echo "🚀 Deploying FitFreak program to $CLUSTER..."

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install Anchor first."
    echo "Run: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install Solana CLI first."
    exit 1
fi

# Set cluster
solana config set --url $CLUSTER

# Check balance
BALANCE=$(solana balance --output json | jq -r '.balance')
echo "💰 Current balance: $BALANCE SOL"

if [ "$CLUSTER" = "devnet" ]; then
    # Airdrop if balance is low
    if (( $(echo "$BALANCE < 2" | bc -l) )); then
        echo "💧 Airdropping SOL..."
        solana airdrop 2
    fi
fi

# Build the program
echo "🔨 Building program..."
anchor build

# Deploy
echo "📦 Deploying program..."
anchor deploy --provider.cluster $CLUSTER

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/fitfreak-keypair.json)
echo "✅ Program deployed!"
echo "📍 Program ID: $PROGRAM_ID"

# Update Anchor.toml with program ID
if [ "$CLUSTER" = "devnet" ]; then
    sed -i "s/fitfreak = \".*\"/fitfreak = \"$PROGRAM_ID\"/" Anchor.toml
    echo "📝 Updated Anchor.toml with program ID"
fi

echo "🎉 Deployment complete!"

