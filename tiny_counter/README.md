# Tiny Counter - Beginner's Solana Anchor Program

A super simple counter program for learning Anchor on Solana!

## 📁 Folder Structure

```
tiny_counter/
├── Anchor.toml           # Anchor configuration
├── Cargo.toml            # Workspace Cargo config
├── package.json          # Node dependencies
├── tsconfig.json         # TypeScript config
├── programs/
│   └── tiny_counter/
│       ├── Cargo.toml    # Program dependencies
│       └── src/
│           └── lib.rs    # Your counter program!
└── tests/
    └── tiny_counter.ts   # TypeScript tests
```

## 🚀 What This Program Does

Two simple instructions:
1. **initialize** - Creates a counter account (PDA) and sets count to 0
2. **bump** - Increases the counter by 1

## 📦 Setup

First, install dependencies:

```bash
cd tiny_counter
npm install
```

## 🔨 Build and Deploy Commands

### Build the program:
```bash
anchor build
```

### Deploy to devnet:
```bash
# Make sure you have Solana CLI installed and devnet configured
solana config set --url devnet

# Make sure you have some SOL (get from faucet if needed)
solana airdrop 2

# Deploy!
anchor deploy
```

### Run tests:
```bash
anchor test
```

## 💻 TypeScript Example

Here's a quick example to call initialize and bump twice:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TinyCounter } from "../target/types/tiny_counter";

// Setup
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.TinyCounter as Program<TinyCounter>;

// Derive the counter PDA
const [counterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  program.programId
);

// Initialize the counter
await program.methods
  .initialize()
  .accounts({
    counter: counterPDA,
    user: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

console.log("Counter initialized!");

// Bump #1
await program.methods
  .bump()
  .accounts({ counter: counterPDA })
  .rpc();

console.log("Bumped once!");

// Bump #2
await program.methods
  .bump()
  .accounts({ counter: counterPDA })
  .rpc();

console.log("Bumped twice!");

// Fetch and display the counter value
const counter = await program.account.counter.fetch(counterPDA);
console.log("Final counter value:", counter.count.toString()); // Should be 2
```

## 🎓 Key Concepts for Beginners

- **PDA (Program Derived Address)**: A special account controlled by the program, derived from seeds ("counter" in our case)
- **#[program]**: Marks the module containing your program instructions
- **#[account]**: Marks data structures stored on-chain
- **#[derive(Accounts)]**: Validates accounts passed to instructions
- **Signer**: The account paying for and signing transactions
- **msg!()**: Logs messages you can see in transaction logs

## 📝 Understanding the Code

### The Counter Account
```rust
#[account]
pub struct Counter {
    pub count: u64,  // Just one number!
}
```

### Initialize Instruction
Creates a new counter PDA with value 0.

### Bump Instruction
Increases the counter by 1 and logs the new value.

## 🛠 Troubleshooting

- **"anchor: command not found"**: Install Anchor framework: `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`
- **Need SOL**: Get devnet SOL from `solana airdrop 2`
- **Program ID mismatch**: After building, update the program ID in `Anchor.toml` and `lib.rs` with the output from `anchor keys list`

Happy coding! 🎉
