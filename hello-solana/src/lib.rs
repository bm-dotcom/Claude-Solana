// A minimal Solana program that logs "Hello from my first Solana program!"
// when called. This demonstrates the basic structure of a native Solana program.

use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

// Declare the program entrypoint
entrypoint!(process_instruction);

// Program entrypoint implementation
fn process_instruction(
    _program_id: &Pubkey,      // Public key of the program account
    _accounts: &[AccountInfo], // Accounts passed to the program (none needed here)
    _instruction_data: &[u8],  // Instruction data (none needed here)
) -> ProgramResult {
    // Log the message to the Solana logs
    msg!("Hello from my first Solana program!");
    
    Ok(())
}