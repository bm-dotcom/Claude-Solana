import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TinyCounter } from "../target/types/tiny_counter";

describe("tiny_counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TinyCounter as Program<TinyCounter>;

  // Derive the PDA for the counter
  const [counterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    program.programId
  );

  it("Initialize the counter", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        counter: counterPDA,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize transaction signature", tx);

    // Fetch the counter account
    const counter = await program.account.counter.fetch(counterPDA);
    console.log("Counter value:", counter.count.toString());
  });

  it("Bump the counter twice", async () => {
    // First bump
    const tx1 = await program.methods
      .bump()
      .accounts({
        counter: counterPDA,
      })
      .rpc();

    console.log("First bump transaction signature", tx1);

    let counter = await program.account.counter.fetch(counterPDA);
    console.log("Counter after first bump:", counter.count.toString());

    // Second bump
    const tx2 = await program.methods
      .bump()
      .accounts({
        counter: counterPDA,
      })
      .rpc();

    console.log("Second bump transaction signature", tx2);

    counter = await program.account.counter.fetch(counterPDA);
    console.log("Counter after second bump:", counter.count.toString());
  });
});