# FitFreak Solana Program - Conversion Summary

## Overview

Successfully converted the Ethereum smart contract (`contest.sol`) to a Solana program using the Anchor framework.

## What Was Converted

### Original Solidity Contract
- **File**: `contract/solidity/contest.sol`
- **Functions**:
  - `createContest()` - Create a new contest
  - `joinContest()` - Join a contest by staking ETH
  - `distributeRewards()` - Distribute rewards to winners
  - `getParticipants()` - Get contest participants
  - `isParticipant()` - Check if user is participant

### Solana Program
- **File**: `solana-program/programs/fitfreak/src/lib.rs`
- **Instructions**:
  - `create_contest` - Create a new fitness contest
  - `join_contest` - Join a contest by staking SOL
  - `distribute_rewards` - Distribute rewards to winners
  - `get_contest_info` - Get contest information

## Key Differences

### Account Model
- **Ethereum**: Single contract stores all contests in a mapping
- **Solana**: Each contest is a separate Program Derived Address (PDA)

### State Management
- **Ethereum**: Uses mappings and arrays stored in contract storage
- **Solana**: Uses separate accounts for each contest and participant

### Currency
- **Ethereum**: Uses ETH (wei)
- **Solana**: Uses SOL (lamports)

### Transaction Model
- **Ethereum**: Gas fees paid by sender
- **Solana**: Transaction fees paid by signer, rent for account storage

## Program Structure

```
solana-program/
├── Anchor.toml              # Anchor configuration
├── Cargo.toml              # Rust workspace config
├── Xargo.toml              # Cross-compilation config
├── package.json            # Node.js dependencies
├── tsconfig.json          # TypeScript config
├── programs/
│   └── fitfreak/
│       ├── Cargo.toml     # Program dependencies
│       └── src/
│           └── lib.rs      # Main program logic
├── tests/
│   └── fitfreak.ts        # Integration tests
├── client/
│   └── index.ts           # TypeScript client
└── scripts/
    └── deploy.sh          # Deployment script
```

## Accounts

### Contest Account
- Stores contest information
- PDA derived from: `["contest", owner, count]`
- Fields: owner, contest_id, name, stake_amount, times, participants, etc.

### ContestCounter Account
- Tracks number of contests created by an owner
- PDA derived from: `["contest_counter", owner]`
- Used to generate unique contest PDAs

### ParticipantAccount
- Tracks individual participant information
- PDA derived from: `["participant", contest, participant]`
- Fields: contest, participant, joined_at

## Deployment

### Prerequisites
1. Solana CLI installed
2. Anchor framework installed
3. Rust toolchain installed
4. Node.js and npm installed

### Quick Deploy

```bash
cd solana-program
npm install
anchor build
./scripts/deploy.sh devnet
```

### Manual Deploy

```bash
# Build
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get program ID
solana address -k target/deploy/fitfreak-keypair.json

# Update program ID in:
# 1. Anchor.toml
# 2. programs/fitfreak/src/lib.rs (declare_id!)

# Rebuild and redeploy
anchor build
anchor deploy --provider.cluster devnet
```

## Usage

### Using the TypeScript Client

```typescript
import { FitFreakClient } from './client';
import { Connection, Keypair } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const wallet = // Your wallet

const client = new FitFreakClient(connection, wallet);

// Create contest
const { tx, contestAddress, contestId } = await client.createContest(
  "Weekly Challenge",
  0.1, // 0.1 SOL
  Math.floor(Date.now() / 1000),
  Math.floor(Date.now() / 1000) + 86400,
  10, // max participants
  2   // min participants
);

// Join contest
await client.joinContest(contestAddress);

// Get contest info
const info = await client.getContestInfo(contestAddress);

// Distribute rewards
await client.distributeRewards(
  contestAddress,
  winner1Pubkey,
  winner2Pubkey,
  winner3Pubkey
);
```

## Testing

```bash
# Run tests
anchor test

# Or use npm
npm test
```

## Next Steps

1. ✅ Program converted and ready
2. Deploy to devnet for testing
3. Update frontend to use Solana program
4. Test all functionality
5. Deploy to mainnet when ready

## Notes

- Contest IDs start at 0 (first contest has ID 0)
- Each owner can create multiple contests
- Contest PDAs are unique per owner and contest ID
- SOL amounts are in lamports (1 SOL = 1e9 lamports)
- Account rent is required for storage (handled automatically by Anchor)

