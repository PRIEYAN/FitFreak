# FitFreak Solana Program

Solana smart contract for the FitFreak fitness contest platform.

## Overview

This Anchor program implements a contest system where users can:
- Create fitness contests with stake amounts
- Join contests by staking SOL
- Distribute rewards to winners

## Program Structure

- `programs/fitfreak/src/lib.rs` - Main program logic
- `tests/` - Integration tests
- `scripts/` - Deployment scripts

## Quick Start

### Prerequisites

- Rust (latest stable)
- Solana CLI
- Anchor Framework

### Build

```bash
anchor build
```

### Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

### Deploy to Mainnet

```bash
anchor deploy --provider.cluster mainnet
```

## Program Instructions

1. `create_contest` - Create a new contest
2. `join_contest` - Join a contest by staking SOL
3. `distribute_rewards` - Distribute rewards to winners
4. `get_contest_info` - Get contest information

## Accounts

- `Contest` - Stores contest information
- `ParticipantAccount` - Tracks participant information

## Error Codes

- `ContestNotStarted` - Contest has not started yet
- `ContestEnded` - Contest has ended
- `ContestFull` - Contest is full
- `ContestStillActive` - Contest is still active
- `RewardsAlreadyDistributed` - Rewards have already been distributed
- `NotEnoughParticipants` - Not enough participants
- `Unauthorized` - Unauthorized access

