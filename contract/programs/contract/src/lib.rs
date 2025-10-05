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
pub struct Initialize {}
