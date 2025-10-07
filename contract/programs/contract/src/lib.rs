use anchor_lang::prelude::*;

declare_id!("3nR3mRJm7TaWPeA7rScQ8Mbo1eNMpJcE8KdbNQidq2rh");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 456 + 8 )]
    pub donation_message: Account<'info, DonationMessage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DonationMessage {
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub mint: Pubkey,   
    pub amount: u64,
    pub ts: i64,
    pub sender_name: String,
    pub message: String,
}
