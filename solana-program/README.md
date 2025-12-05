# 🏋️ FitFreak Solana Program

Solana smart contract program for FitFreak fitness contests, staking, and rewards.

## 📋 Prerequisites

1. **Install Solana CLI**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
   solana --version
   ```

2. **Install Anchor Framework**
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install latest
   avm use latest
   anchor --version
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

## 🔑 Setup Wallet

1. **Generate a new keypair** (or use existing)
   ```bash
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

2. **Set cluster to devnet**
   ```bash
   solana config set --url devnet
   ```

3. **Airdrop SOL for testing** (devnet only)
   ```bash
   solana airdrop 2
   solana balance
   ```

## 🏗️ Build

```bash
# Build the program
anchor build

# This will:
# - Compile the Rust program
# - Generate TypeScript types
# - Create the program IDL (Interface Definition Language)
```

## 🧪 Test

```bash
# Run tests
anchor test

# Or with custom test command
npm test
```

## 🚀 Deploy

### Deploy to Devnet

```bash
# Build first
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Or use the npm script
npm run deploy:devnet
```

After deployment, you'll get a program ID. Update `Anchor.toml` and `programs/fitfreak/src/lib.rs` with the actual program ID.

### Deploy to Mainnet

⚠️ **Warning**: Only deploy to mainnet after thorough testing!

```bash
# Switch to mainnet
solana config set --url mainnet

# Build for mainnet
anchor build

# Deploy (requires sufficient SOL for fees)
anchor deploy --provider.cluster mainnet

# Or use the npm script
npm run deploy:mainnet
```

## 📝 Program Instructions

### 1. `create_contest`
Creates a new fitness contest.

**Parameters:**
- `contest_id`: Unique identifier for the contest
- `stake_amount`: Amount of SOL required to join (in lamports)
- `max_participants`: Maximum number of participants
- `duration_seconds`: Contest duration in seconds

### 2. `join_contest`
Allows a user to join a contest by staking SOL.

**Parameters:**
- `contest_id`: The contest to join

### 3. `distribute_rewards`
Distributes rewards to contest winners (authority only).

**Parameters:**
- `contest_id`: The contest ID
- `winner`: Public key of the winner
- `reward_amount`: Amount to distribute (in lamports)

### 4. `close_contest`
Closes a contest (authority only).

**Parameters:**
- `contest_id`: The contest to close

## 🔧 Configuration

### Update Program ID

After first deployment:

1. Get your program ID:
   ```bash
   solana address -k target/deploy/fitfreak-keypair.json
   ```

2. Update `Anchor.toml`:
   ```toml
   [programs.devnet]
   fitfreak = "YOUR_PROGRAM_ID_HERE"
   ```

3. Update `programs/fitfreak/src/lib.rs`:
   ```rust
   declare_id!("YOUR_PROGRAM_ID_HERE");
   ```

4. Rebuild:
   ```bash
   anchor build
   ```

## 📚 Integration with Frontend

After deployment, update your frontend configuration:

```javascript
// frontend/src/config/api.js
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  PROGRAM_ADDRESS: 'YOUR_PROGRAM_ID_HERE', // Update this!
  NETWORK: 'devnet',
  RPC_URL: 'https://api.devnet.solana.com',
};
```

## 🐛 Troubleshooting

### Build Errors

- **"Program ID mismatch"**: Update the program ID in both `Anchor.toml` and `lib.rs`
- **"Account not found"**: Make sure you've deployed the program first

### Deployment Errors

- **"Insufficient funds"**: Airdrop more SOL: `solana airdrop 2`
- **"Program account not found"**: Build the program first: `anchor build`

### Network Issues

- Check your Solana cluster: `solana config get`
- Verify RPC endpoint is accessible
- For devnet, use: `https://api.devnet.solana.com`

## 📖 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)

## 📄 License

MIT

