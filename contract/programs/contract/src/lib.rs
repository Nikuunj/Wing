use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};

declare_id!("3nR3mRJm7TaWPeA7rScQ8Mbo1eNMpJcE8KdbNQidq2rh");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn init_receiver_state() -> Result<()> {
        Ok(())
    }

    pub fn donate_sol(ctx: Context<DonateSol>) -> Result<()> {
        let sol_vault = &mut ctx.accounts.sol_vault;

        if sol_vault.bump == 0 {
            sol_vault.bump = *ctx.bumps.get("sol_vault").unwrap();
            sol_vault.receiver = ctx.accounts.receiver.key(); 
        }
        Ok(())
    }

    pub fn donate_spl(ctx: Context<DonateSpl>) -> Result<()> {
        Ok(())
    }

    pub fn claim_sol() -> Result<()> {
        Ok(())
    }

    pub fn clain_spl() -> Result<()> {
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

#[account]
pub struct UserVault {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub amount: u64
}

#[account]
pub struct SolVault {
    pub bump: u8,
    pub receiver: Pubkey,
}

#[derive(Accounts)]
pub struct InitReceiverState<'info> {
    #[account(init, payer = signer, space = 8 + 32 + 32 + 8)]
    pub receiver_state: Account<'info, UserVault>,
    pub receiver: SystemAccount<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DonateSol<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(mut)]
    pub receiver: SystemAccount<'info>,

    #[account(
        init_if_needed,
        payer = donor,
        space = 0,
        seeds = [b"sol-vault", receiver.key().as_ref()],
        bump
    )]
    pub sol_vault: Account<'info, SolVault>,

    #[account(
        init_if_needed,
        payer = donor,
        space = 8 + 32 + 32 + 8,
        seeds = [b"user-vault", receiver.key().as_ref()],
        bump
    )]
    pub user_vault: Account<'info, UserVault>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DonateSpl<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(mut)]
    pub receiver: SystemAccount<'info>,

    #[account(mut)] 
    pub user_token_account: Account<'info, TokenAccount>, 

    #[account(init_if_needed, 
        payer = donor, 
        seeds = [b"spl-vault", mint.key().as_ref(), receiver.key().as_ref()], 
        bump, 
        token::mint = mint, 
        token::authority = vault
    )] 
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = donor,
        space = 8 + 32 + 32 + 8,
        seeds = [b"user-vault", receiver.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub user_vault: Account<'info, UserVault>,

    pub vault: UncheckedAccount<'info>,
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
