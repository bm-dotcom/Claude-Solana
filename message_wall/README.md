# Message Wall - Simple Anchor Solana Program

A minimal Anchor program that stores a single changeable message on-chain.

## Features
- Single PDA account with seed "wall"
- Stores one message (max 280 characters)
- Overwrites previous message on each call
- Logs first 50 characters of new messages

## Setup & Build

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Build the Program
```bash
cd message_wall

# Build the program
anchor build

# Get the program ID
solana-keygen pubkey target/deploy/message_wall-keypair.json

# Update the program ID in lib.rs (replace the declare_id! line)
# Also update Anchor.toml with the new program ID

# Rebuild after updating IDs
anchor build
```

## Deploy to Devnet

```bash
# Configure Solana CLI for devnet
solana config set --url https://api.devnet.solana.com

# Create a wallet if you don't have one
solana-keygen new

# Airdrop some SOL for testing
solana airdrop 2

# Deploy the program
anchor deploy
```

## Testing the Program

### Using Anchor Test (if you have test files)
```bash
anchor test --skip-local-validator
```

### Manual Testing with Solana CLI

After deployment, find the PDA address:
```bash
# The PDA is derived from seeds ["wall"] and your program ID
# Calculate it programmatically or use anchor to derive it
```

### Read the Message

Once a message is posted, read the account data:
```bash
# Get the PDA address (replace PROGRAM_ID with your actual program ID)
solana account <PDA_ADDRESS> --output json

# Or decode using anchor
anchor idl init -f target/idl/message_wall.json <PROGRAM_ID>
```

### Post a Message via TypeScript/JavaScript

```typescript
import * as anchor from "@coral-xyz/anchor";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.MessageWall;

const [wallPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("wall")],
  program.programId
);

await program.methods
  .postMessage("Hello, Solana!")
  .accounts({
    wall: wallPda,
    user: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

// Read the message
const wallAccount = await program.account.wall.fetch(wallPda);
console.log("Current message:", wallAccount.message);
```

## Account Structure

- **Wall Account (PDA)**
  - Seeds: `["wall"]`
  - Size: 8 (discriminator) + 4 (string length) + 280 (max message) = 292 bytes
  - Fields:
    - `message`: String (max 280 characters)

## Instructions

### `post_message`
- **Parameters**: `message: String` (max 280 chars)
- **Accounts**:
  - `wall`: The PDA account (init_if_needed)
  - `user`: Signer and payer
  - `system_program`: System program
- **Behavior**: 
  - First call: Initializes the account and sets the message
  - Subsequent calls: Overwrites the previous message

## Notes

- The program uses `init_if_needed` so the first call automatically initializes the account
- Message length is validated to be max 280 characters
- Each new message overwrites the previous one (no history)
- The program logs the first 50 characters of each new message