# 🚀 Quick Start Guide

## 📁 Folder Structure (After `anchor init`)

```
tiny_counter/
├── Anchor.toml                    # Anchor configuration
├── Cargo.toml                     # Rust workspace config
├── package.json                   # Node.js dependencies
├── tsconfig.json                  # TypeScript configuration
├── .gitignore                     # Git ignore rules
├── programs/
│   └── tiny_counter/
│       ├── Cargo.toml             # Program dependencies
│       └── src/
│           └── lib.rs             # ⭐ YOUR COUNTER PROGRAM
└── tests/
    └── tiny_counter.ts            # TypeScript test file
```

## 🔨 Build and Deploy Commands

```bash
# 1. Navigate to the project
cd tiny_counter

# 2. Install dependencies (one time)
npm install

# 3. Build the program
anchor build

# 4. Update program ID (after first build)
# Copy the program ID from `anchor keys list`
# Update it in: Anchor.toml and lib.rs (declare_id!)

# 5. Build again with correct ID
anchor build

# 6. Configure devnet
solana config set --url devnet

# 7. Get some SOL (if needed)
solana airdrop 2

# 8. Deploy to devnet
anchor deploy

# 9. Run tests (optional)
anchor test
```

## 💻 TypeScript Example (Short Version)

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TinyCounter } from "../target/types/tiny_counter";

// Setup provider and program
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.TinyCounter as Program<TinyCounter>;

// Find the counter PDA
const [counterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  program.programId
);

// Initialize
await program.methods
  .initialize()
  .accounts({
    counter: counterPDA,
    user: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

// Bump #1
await program.methods
  .bump()
  .accounts({ counter: counterPDA })
  .rpc();

// Bump #2
await program.methods
  .bump()
  .accounts({ counter: counterPDA })
  .rpc();

// Check the value
const counter = await program.account.counter.fetch(counterPDA);
console.log("Counter is now:", counter.count.toString()); // 2
```

## 📝 The Program (lib.rs)

Two simple instructions:

1. **initialize** - Creates a counter PDA and sets count to 0
2. **bump** - Increments counter by 1

Key features:
- ✅ Uses PDA with seed "counter"
- ✅ Counter account stores one u64
- ✅ Includes msg!() logs
- ✅ No authority checks (beginner-friendly)
- ✅ Minimal error handling

That's it! You're ready to go! 🎉
