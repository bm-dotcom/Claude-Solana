# Quick Command Reference

## Build and Deploy

```bash
cd message_wall

# 1. Build the program
anchor build

# 2. Get your program ID
solana-keygen pubkey target/deploy/message_wall-keypair.json

# 3. Update the program ID in these files:
#    - programs/message_wall/src/lib.rs (line 3: declare_id!)
#    - Anchor.toml (programs.devnet.message_wall and programs.localnet.message_wall)

# 4. Rebuild after updating IDs
anchor build

# 5. Configure for devnet
solana config set --url https://api.devnet.solana.com

# 6. Check your wallet balance (airdrop if needed)
solana balance
solana airdrop 2

# 7. Deploy to devnet
anchor deploy
```

## Read the Message from Chain

### Calculate the PDA Address (in Node.js/TypeScript):
```javascript
import * as anchor from "@coral-xyz/anchor";

const programId = new anchor.web3.PublicKey("YOUR_PROGRAM_ID");
const [wallPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("wall")],
  programId
);
console.log("Wall PDA:", wallPda.toString());
```

### Using Solana CLI:
```bash
# View raw account data
solana account <PDA_ADDRESS>

# View as JSON
solana account <PDA_ADDRESS> --output json
```

### Using Anchor (after posting a message):
```javascript
const wallAccount = await program.account.wall.fetch(wallPda);
console.log("Message:", wallAccount.message);
```

## Testing

```bash
# Run anchor tests (if test files exist)
anchor test --skip-local-validator
```

## Program Overview

**Single Instruction:**
- `post_message(message: String)` - Max 280 characters

**Account:**
- PDA with seed `["wall"]`
- Stores one message (overwrites on each call)
- Size: 292 bytes (8 + 4 + 280)

**Features:**
- First call initializes the account
- Subsequent calls overwrite the message
- Logs first 50 chars of each new message