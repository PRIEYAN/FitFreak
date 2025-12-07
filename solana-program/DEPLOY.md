# FitFreak Solana Program Deployment Guide

## Prerequisites

1. **Install Solana CLI**
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana --version
```

2. **Install Anchor Framework**
```bash
# Install Rust if needed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Anchor Version Manager
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor
avm install latest
avm use latest
anchor --version
```

3. **Install Node.js Dependencies**
```bash
cd solana-program
npm install
```

## Setup Wallet

```bash
# Generate keypair (if needed)
solana-keygen new --outfile ~/.config/solana/id.json

# Set to devnet
solana config set --url devnet

# Get test SOL (devnet only)
solana airdrop 2
solana balance
```

## Build Program

```bash
cd solana-program
anchor build
```

This will:
- Compile the Rust program
- Generate TypeScript types
- Create program IDL
- Generate keypair if needed

## Deploy to Devnet

```bash
# Option 1: Use deployment script
./scripts/deploy.sh devnet

# Option 2: Use Anchor directly
anchor deploy --provider.cluster devnet
```

After deployment, you'll get a Program ID. Update it in:
1. `Anchor.toml` - Update the program ID
2. `programs/fitfreak/src/lib.rs` - Update `declare_id!()`
3. Rebuild: `anchor build`
4. Redeploy: `anchor deploy --provider.cluster devnet`

## Deploy to Mainnet

⚠️ **WARNING**: Only deploy to mainnet after thorough testing!

```bash
# Switch to mainnet
solana config set --url mainnet

# Ensure sufficient SOL balance (need ~2-5 SOL)
solana balance

# Update Anchor.toml for mainnet
# Then deploy
anchor deploy --provider.cluster mainnet
```

## Verify Deployment

```bash
# Get program ID
solana address -k target/deploy/fitfreak-keypair.json

# Check program account
solana account <PROGRAM_ID>

# View on Solana Explorer
# Devnet: https://explorer.solana.com/?cluster=devnet
# Mainnet: https://explorer.solana.com/
```

## Program Instructions

1. **create_contest** - Create a new fitness contest
   - Parameters: name, stake_amount, start_time, end_time, max_participants, min_participants
   
2. **join_contest** - Join a contest by staking SOL
   - Requires: contest address
   
3. **distribute_rewards** - Distribute rewards to winners
   - Requires: contest address, winner1, winner2, winner3 addresses
   
4. **get_contest_info** - Get contest information
   - Returns: ContestInfo struct

## Using the Client

```typescript
import { FitFreakClient } from './client';
import { Connection, Keypair } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const wallet = // Your wallet (Keypair or Wallet adapter)

const client = new FitFreakClient(connection, wallet);

// Create contest
const { tx, contestAddress } = await client.createContest(
  "Weekly Challenge",
  0.1, // 0.1 SOL stake
  Math.floor(Date.now() / 1000),
  Math.floor(Date.now() / 1000) + 86400,
  10, // max participants
  2  // min participants
);

// Join contest
await client.joinContest(contestAddress);

// Get contest info
const info = await client.getContestInfo(contestAddress);
```

## Troubleshooting

**Build fails:**
```bash
anchor clean
anchor build
```

**Insufficient funds:**
```bash
# Devnet
solana airdrop 2

# Mainnet - transfer SOL to your wallet
```

**Program ID mismatch:**
1. Get actual program ID: `solana address -k target/deploy/fitfreak-keypair.json`
2. Update `Anchor.toml` and `lib.rs`
3. Rebuild and redeploy

## Next Steps

1. ✅ Program deployed
2. Update frontend configuration with program ID
3. Test contest creation and joining
4. Test reward distribution
5. Deploy to mainnet when ready

