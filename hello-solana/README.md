# Hello Solana - Minimal Program

A minimal Solana program that logs "Hello from my first Solana program!" when called.

## Build and Deploy Instructions

### 1. Build the Program

```bash
cd hello-solana
cargo build-bpf
```

This will compile the program to BPF bytecode and output the `.so` file location.

### 2. Configure Solana CLI for Devnet

```bash
solana config set --url https://api.devnet.solana.com
```

### 3. Create a Keypair (if you don't have one)

```bash
solana-keygen new
```

### 4. Airdrop SOL to Your Wallet (for deployment fees)

```bash
solana airdrop 2
```

### 5. Deploy the Program

```bash
solana program deploy target/deploy/hello_solana.so
```

The command will output your program ID. Save this for the next step!

### 6. Test the Program

Create a simple invoke script or use the Solana CLI:

```bash
# Replace <PROGRAM_ID> with your deployed program ID
solana program invoke <PROGRAM_ID>
```

Or use the program show-logs command to watch for your message:

```bash
solana logs <PROGRAM_ID>
```

Then in another terminal, invoke the program. You should see "Hello from my first Solana program!" in the logs!

## Program Structure

- **Entrypoint**: Defined with `entrypoint!(process_instruction)`
- **Process Instruction**: The main function that runs when the program is called
- **msg!()**: Logs messages that can be viewed in transaction logs

## Notes

- No accounts are required for this minimal program
- The program accepts any instruction data (but ignores it)
- Returns `Ok(())` to indicate successful execution
