# 🚀 FitFreak Solana Program Deployment Guide

Complete step-by-step guide to deploy the FitFreak Solana program.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Build the Program](#build-the-program)
4. [Deploy to Devnet](#deploy-to-devnet)
5. [Update Configuration](#update-configuration)
6. [Deploy to Mainnet](#deploy-to-mainnet)
7. [Verify Deployment](#verify-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Install Solana CLI

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Verify installation
solana --version
# Should output: solana-cli 1.x.x
```

### 2. Install Anchor Framework

```bash
# Install Rust if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Anchor Version Manager (AVM)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor version
avm install latest
avm use latest

# Verify installation
anchor --version
# Should output: anchor-cli 0.x.x
```

### 3. Install Node.js Dependencies

```bash
cd solana-program
npm install
```

---

## Initial Setup

### 1. Generate or Use Existing Wallet

```bash
# Generate new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# Or use existing
# Your keypair should be at: ~/.config/solana/id.json
```

### 2. Configure Solana CLI

```bash
# Set to devnet (for testing)
solana config set --url devnet

# Verify configuration
solana config get
# Should show:
# Config File: /home/youruser/.config/solana/cli/config.yml
# RPC URL: https://api.devnet.solana.com
# WebSocket URL: wss://api.devnet.solana.com/...
# Keypair Path: /home/youruser/.config/solana/id.json
```

### 3. Get Test SOL (Devnet Only)

```bash
# Check current balance
solana balance

# Airdrop SOL (devnet only, up to 2 SOL per request)
solana airdrop 2

# Verify balance
solana balance
# Should show: 2 SOL (or more)
```

---

## Build the Program

### 1. Navigate to Program Directory

```bash
cd /home/prieyan/weeb/FitFreak/solana-program
```

### 2. Build the Program

```bash
# Build the Anchor program
anchor build

# This will:
# ✅ Compile Rust code
# ✅ Generate TypeScript types
# ✅ Create program IDL
# ✅ Generate keypair if needed
```

**Expected Output:**
```
Building program...
Program Id: FitFreak1111111111111111111111111111111111
```

### 3. Verify Build Artifacts

```bash
# Check build output
ls -la target/deploy/

# Should see:
# - fitfreak.so (the compiled program)
# - fitfreak-keypair.json (program keypair)
```

---

## Deploy to Devnet

### 1. First Deployment

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Or use npm script
npm run deploy:devnet
```

**Expected Output:**
```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: YOUR_WALLET_ADDRESS
Deploying program "fitfreak"...
Program Id: YOUR_PROGRAM_ID_HERE
```

### 2. Get Your Program ID

```bash
# Get the program ID from keypair
solana address -k target/deploy/fitfreak-keypair.json

# Or check Anchor.toml after deployment
cat Anchor.toml | grep "fitfreak ="
```

### 3. Update Program ID

After first deployment, you need to update the program ID in two places:

**a) Update `Anchor.toml`:**
```toml
[programs.devnet]
fitfreak = "YOUR_ACTUAL_PROGRAM_ID_HERE"  # Replace with actual ID
```

**b) Update `programs/fitfreak/src/lib.rs`:**
```rust
declare_id!("YOUR_ACTUAL_PROGRAM_ID_HERE");  // Replace with actual ID
```

**c) Rebuild:**
```bash
anchor build
```

**d) Redeploy:**
```bash
anchor deploy --provider.cluster devnet
```

---

## Update Configuration

### 1. Update Frontend Configuration

After deployment, update your frontend to use the deployed program:

```bash
# Edit frontend/src/config/api.js
```

Update the `PROGRAM_ADDRESS`:

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  PROGRAM_ADDRESS: 'YOUR_PROGRAM_ID_HERE', // ← Update this!
  NETWORK: 'devnet',
  RPC_URL: 'https://api.devnet.solana.com',
};
```

### 2. Update Environment Variables (Optional)

Create `frontend/.env`:

```env
VITE_PROGRAM_ADDRESS=YOUR_PROGRAM_ID_HERE
VITE_NETWORK=devnet
VITE_RPC_URL=https://api.devnet.solana.com
```

### 3. Update Backend (if needed)

If your backend interacts with Solana, update the program address there as well.

---

## Deploy to Mainnet

⚠️ **WARNING**: Only deploy to mainnet after thorough testing on devnet!

### 1. Switch to Mainnet

```bash
# Switch cluster
solana config set --url mainnet

# Verify
solana config get
```

### 2. Ensure Sufficient SOL

```bash
# Check balance (need SOL for deployment fees ~2-5 SOL)
solana balance

# If needed, transfer SOL to your wallet
# Mainnet SOL must be purchased from an exchange
```

### 3. Update Anchor.toml for Mainnet

```toml
[provider]
cluster = "mainnet"
wallet = "~/.config/solana/id.json"

[programs.mainnet]
fitfreak = "YOUR_PROGRAM_ID_HERE"
```

### 4. Build for Mainnet

```bash
anchor build
```

### 5. Deploy to Mainnet

```bash
anchor deploy --provider.cluster mainnet

# Or use npm script
npm run deploy:mainnet
```

---

## Verify Deployment

### 1. Check Program on Solana Explorer

Visit: `https://explorer.solana.com/address/YOUR_PROGRAM_ID`

Or for devnet: `https://explorer.solana.com/?cluster=devnet`

### 2. Verify Program Account

```bash
# Get program info
solana account YOUR_PROGRAM_ID

# Should show:
# Public Key: YOUR_PROGRAM_ID
# Balance: X SOL
# Executable: true
# Owner: BPFLoaderUpgradeab1e11111111111111111111111
```

### 3. Test Program Interaction

Use the frontend or write a test script to interact with the deployed program.

---

## Troubleshooting

### Issue: "Program ID mismatch"

**Solution:**
1. Get actual program ID: `solana address -k target/deploy/fitfreak-keypair.json`
2. Update `Anchor.toml` and `lib.rs` with the actual ID
3. Rebuild: `anchor build`
4. Redeploy: `anchor deploy`

### Issue: "Insufficient funds"

**Solution:**
```bash
# Devnet: Airdrop more SOL
solana airdrop 2

# Mainnet: Transfer SOL to your wallet
```

### Issue: "Account not found"

**Solution:**
- Make sure you've built the program: `anchor build`
- Check you're on the correct cluster: `solana config get`
- Verify RPC endpoint is accessible

### Issue: "Build fails"

**Solution:**
```bash
# Clean and rebuild
anchor clean
anchor build

# Check Rust version
rustc --version  # Should be 1.70.0 or later

# Update Anchor
avm install latest
avm use latest
```

### Issue: "Deployment hangs"

**Solution:**
- Check network connection
- Try a different RPC endpoint
- Increase timeout in `Anchor.toml`:
  ```toml
  [provider]
  commitment = "confirmed"
  ```

---

## Quick Reference Commands

```bash
# Build
anchor build

# Test
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Check program account
solana account YOUR_PROGRAM_ID

# View logs
solana logs

# Get program ID
solana address -k target/deploy/fitfreak-keypair.json

# Airdrop SOL (devnet only)
solana airdrop 2

# Check balance
solana balance

# Check config
solana config get
```

---

## Next Steps

1. ✅ Program deployed to devnet
2. ✅ Frontend configured with program ID
3. ✅ Test contest creation and joining
4. ✅ Test reward distribution
5. ⏭️ Deploy to mainnet (when ready)

---

## Support

For issues or questions:
- Check [Solana Documentation](https://docs.solana.com/)
- Check [Anchor Documentation](https://www.anchor-lang.com/)
- Review program logs: `solana logs`

---

**Happy Deploying! 🚀**

