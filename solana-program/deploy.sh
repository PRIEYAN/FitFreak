#!/bin/bash

# FitFreak Solana Program Deployment Script
# This script helps deploy the FitFreak program to Solana

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLUSTER="${1:-devnet}"  # devnet or mainnet
PROGRAM_NAME="fitfreak"

echo -e "${BLUE}🚀 FitFreak Solana Program Deployment${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI not found!${NC}"
    echo "Install it with: sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    exit 1
fi

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor CLI not found!${NC}"
    echo "Install it with: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    exit 1
fi

echo -e "${GREEN}✅ Solana CLI: $(solana --version)${NC}"
echo -e "${GREEN}✅ Anchor CLI: $(anchor --version)${NC}\n"

# Set cluster
echo -e "${YELLOW}📡 Setting cluster to: ${CLUSTER}${NC}"
solana config set --url $CLUSTER

# Check balance
BALANCE=$(solana balance --output json | jq -r '.balance')
echo -e "${BLUE}💰 Current balance: ${BALANCE} SOL${NC}"

if [ "$CLUSTER" == "devnet" ]; then
    # Check if balance is low
    BALANCE_NUM=$(echo $BALANCE | sed 's/ SOL//')
    if (( $(echo "$BALANCE_NUM < 1" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Low balance. Airdropping 2 SOL...${NC}"
        solana airdrop 2 || echo -e "${YELLOW}⚠️  Airdrop failed, continuing anyway...${NC}"
    fi
fi

# Build the program
echo -e "\n${BLUE}🔨 Building program...${NC}"
anchor build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}\n"

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/${PROGRAM_NAME}-keypair.json)
echo -e "${BLUE}📝 Program ID: ${PROGRAM_ID}${NC}"

# Check if program ID matches Anchor.toml
ANCHOR_PROGRAM_ID=$(grep -A 1 "\[programs.${CLUSTER}\]" Anchor.toml | grep "fitfreak" | cut -d '"' -f 2)

if [ "$PROGRAM_ID" != "$ANCHOR_PROGRAM_ID" ] && [ "$ANCHOR_PROGRAM_ID" != "FitFreak1111111111111111111111111111111111" ]; then
    echo -e "${YELLOW}⚠️  Program ID mismatch!${NC}"
    echo -e "   Anchor.toml has: ${ANCHOR_PROGRAM_ID}"
    echo -e "   Keypair has: ${PROGRAM_ID}"
    echo -e "\n${YELLOW}Updating Anchor.toml...${NC}"
    
    # Update Anchor.toml
    sed -i "s/fitfreak = \".*\"/fitfreak = \"${PROGRAM_ID}\"/" Anchor.toml
    
    # Update lib.rs
    sed -i "s/declare_id!(\".*\");/declare_id!(\"${PROGRAM_ID}\");/" programs/${PROGRAM_NAME}/src/lib.rs
    
    echo -e "${GREEN}✅ Updated program ID. Rebuilding...${NC}"
    anchor build
fi

# Deploy
echo -e "\n${BLUE}🚀 Deploying to ${CLUSTER}...${NC}"
anchor deploy --provider.cluster $CLUSTER

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Deployment successful!${NC}\n"

# Verify deployment
echo -e "${BLUE}🔍 Verifying deployment...${NC}"
solana account $PROGRAM_ID --output json > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Program verified on-chain!${NC}"
    echo -e "\n${BLUE}📋 Deployment Summary:${NC}"
    echo -e "   Program ID: ${PROGRAM_ID}"
    echo -e "   Cluster: ${CLUSTER}"
    echo -e "   Explorer: https://explorer.solana.com/address/${PROGRAM_ID}?cluster=${CLUSTER}"
else
    echo -e "${YELLOW}⚠️  Could not verify program on-chain${NC}"
fi

echo -e "\n${GREEN}🎉 Done!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Update frontend/src/config/api.js with program ID: ${PROGRAM_ID}"
echo -e "2. Test the program using the frontend or Anchor tests"
echo -e "3. Run: anchor test (to run tests)"

