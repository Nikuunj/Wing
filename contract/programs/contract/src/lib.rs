use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer as sol_transfer, Transfer as SolTransfer};
use anchor_spl::token::{transfer, Token, TokenAccount, Mint, Transfer};
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};

declare_id!("3nR3mRJm7TaWPeA7rScQ8Mbo1eNMpJcE8KdbNQidq2rh");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<InitProfile>, name: String, about: String) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;   
        user_profile.name = name;
        user_profile.about = about;
        Ok(())
    }

    pub fn donate_sol(ctx: Context<DonateSol>, amount: u64) -> Result<()> {
        require!(amount > 0, CustomError::InvalidAmount);
        let sol_vault = &mut ctx.accounts.sol_vault;
        if sol_vault.bump == 0 {
            sol_vault.bump = ctx.bumps.sol_vault;
            sol_vault.receiver = ctx.accounts.receiver.key(); 
        }

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            SolTransfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.sol_vault.to_account_info()
            }
        );

        sol_transfer(cpi_context, amount)?;
        Ok(())
    }

    pub fn donate_spl(ctx: Context<DonateSpl>, amount: u64) -> Result<()> {
        require!(amount > 0, CustomError::InvalidAmount);
        let cpi_accounts = Transfer {
            from: ctx.accounts.donor_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.donor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, amount)?;
        ctx.accounts.user_vault.owner = ctx.accounts.receiver.key();
        ctx.accounts.user_vault.mint = ctx.accounts.mint.key();
        ctx.accounts.user_vault.amount = ctx.accounts.vault_token_account.amount;
        Ok(())
    }

    pub fn claim_sol(ctx: Context<WithdrawSol>, amount: u64) -> Result<()> {
        let balance = ctx.accounts.sol_vault.get_lamports();
        require!(amount <= balance, CustomError::InsufficientBalance);

        let to_account = ctx.accounts.signer.to_account_info();
        let sol_vault = ctx.accounts.sol_vault.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let seed = to_account.key();
        let bump_seed = ctx.bumps.sol_vault;
        let signer_seed: &[&[&[u8]]] = &[&[b"sol-vault", seed.as_ref(), &[bump_seed]]];

        let instruction = system_instruction::transfer(&sol_vault.key(), &to_account.key(), amount);

        invoke_signed(&instruction, &[sol_vault, to_account, program_id], signer_seed)?;

        Ok(())
    }

    // pub fn clain_spl() -> Result<()> {
        // Ok(())
    // }
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
pub struct UserProfile {
    pub name: String,
    pub about: String
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
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 456 + 8 )]
    pub donation_message: Account<'info, DonationMessage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitProfile<'info> {
    #[account(
        init, 
        payer = signer, 
        space = 8 + 24 + 256,
        seeds = [b"user-profile", signer.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
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
        space = 8 + 1 + 32,
        seeds = [b"sol-vault", receiver.key().as_ref()],
        bump
    )]
    pub sol_vault: Account<'info, SolVault>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DonateSpl<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(mut)]
    pub receiver: SystemAccount<'info>,

    #[account(mut, 
        constraint = donor_token_account.mint == mint.key(),
        constraint = donor_token_account.owner == donor.key()
    )] 
    pub donor_token_account: Account<'info, TokenAccount>,

    #[account(init_if_needed, 
        payer = donor,
        seeds = [b"spl-vault", receiver.key().as_ref(), mint.key().as_ref()], 
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

    #[account(seeds = [b"vault", receiver.key().as_ref(), mint.key().as_ref()], bump)]
    /// CHECK: This is the PDA that acts as authority for `vault_token_account`. 
    /// It is safe because we derive it with the same seeds and bump as used in `vault_token_account`. 
    pub vault: UncheckedAccount<'info>,

    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct  WithdrawSol<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"sol-vault", signer.key().as_ref()],
        bump
    )]
    pub sol_vault: Account<'info, SolVault>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum CustomError {
    #[msg("Insufficient balance in vault")]
    InsufficientBalance,

    #[msg("Invalid Amount")]
    InvalidAmount
}
