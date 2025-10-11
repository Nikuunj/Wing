use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer as sol_transfer, Transfer as SolTransfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{transfer, Token, TokenAccount, Mint, Transfer, spl_token};
#[cfg(not(feature = "no-entrypoint"))]
use solana_security_txt::security_txt;

declare_id!("HKvDpbKfjDmyAwKayc4hewRZdMBgdLKVXgNpLFzfjEn9");

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name:  "Wing Contract",
    project_url:  "https://github.com/Nikuunj/Wing",
    contacts: "email:mnikunj2622@gmail.com, twitter:@IsNikunj",
    policy: "https://github.com/Nikuunj/Wing/blob/main/SECURITY.md",
    preferred_languages: "en",
    source_code:  "https://github.com/Nikuunj/Wing"
}

#[program]
pub mod contract {

    use super::*;

    pub fn initialize(ctx: Context<InitProfile>, name: String, about: String) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;   
        user_profile.name = name;
        user_profile.about = about;
        Ok(())
    }

    pub fn donate_sol(ctx: Context<DonateSol>, amount: u64, sender_name: String, message: String, timestamp: i64) -> Result<()> {
        require!(amount > 0, CustomError::InvalidAmount);

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            SolTransfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.sol_vault.to_account_info()
            }
        );

        sol_transfer(cpi_context, amount)?;
        let sol_vault_data = &mut ctx.accounts.sol_vault_data;
        if sol_vault_data.bump == 0 {
            sol_vault_data.bump = ctx.bumps.sol_vault;
            sol_vault_data.owner = ctx.accounts.receiver.key(); 
        }
        sol_vault_data.amount += amount;
        msg!("Tip {} lamports. Total staked: {}.", 
             amount, sol_vault_data.amount);

        let donate_msg = &mut ctx.accounts.donate_msg;

        donate_msg.amount = amount;
        donate_msg.sender_pubkey = ctx.accounts.donor.key();
        donate_msg.receiver_pubkey = ctx.accounts.receiver.key();
        donate_msg.ts = timestamp;
        donate_msg.sender_name = sender_name;
        donate_msg.message = message;
        donate_msg.mint = spl_token::native_mint::ID;

        Ok(())
    }

    pub fn donate_spl(ctx: Context<DonateSpl>, amount: u64, sender_name: String, message: String, timestamp: i64) -> Result<()> {
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
        ctx.accounts.user_vault.amount += amount;

        let donate_msg = &mut ctx.accounts.donate_msg;

        donate_msg.amount = amount;
        donate_msg.sender_pubkey = ctx.accounts.donor.key();
        donate_msg.receiver_pubkey = ctx.accounts.receiver.key();
        donate_msg.ts = timestamp;
        donate_msg.sender_name = sender_name;
        donate_msg.message = message;
        donate_msg.mint = spl_token::native_mint::ID;

        Ok(())
    }

    pub fn claim_sol(ctx: Context<WithdrawSol>, amount: u64) -> Result<()> {
        let balance = ctx.accounts.sol_vault_data.amount;
        require!(amount <= balance, CustomError::InsufficientBalance);


        let seed = ctx.accounts.signer.key();
        let bump_seed = ctx.bumps.sol_vault;
        let signer_seeds: &[&[&[u8]]] = &[&[b"sol-vault", seed.as_ref(), &[bump_seed]]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            SolTransfer {
                from: ctx.accounts.sol_vault.to_account_info(),
                to: ctx.accounts.signer.to_account_info(),
            },
            signer_seeds,
        );
        sol_transfer(cpi_context, amount)?;

        ctx.accounts.sol_vault_data.amount -= amount;
        msg!("Withdrawn {} lamports. Remaining: {}", amount, ctx.accounts.sol_vault_data.amount);
        Ok(())
    }

    pub fn clain_spl(ctx: Context<WithdrawSpl>, amount: u64) -> Result<()> {
        let balance = ctx.accounts.vault_token_account.amount;
        require!(amount <= balance, CustomError::InsufficientBalance);

        let bump = ctx.bumps.vault;
        let signer_seed: &[&[&[u8]]] = &[&[
            b"vault",
            ctx.accounts.signer.key.as_ref(),
            ctx.accounts.mint.to_account_info().key.as_ref(),
            &[bump]
        ]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.signer_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info()
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seed);

        transfer(cpi_ctx, amount)?;

        ctx.accounts.user_vault.amount -= amount;
        Ok(())
    }
}

#[account]
pub struct DonationMessage {
    pub sender_pubkey: Pubkey,
    pub receiver_pubkey: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub ts: i64,
    pub sender_name: String,
    pub message: String,
}

impl DonationMessage {
    pub fn calculate_space(sender_name: &str, message: &str) -> usize {
        8 +
        32 +
        32 +
        32 +
        8 +
        8 + 
        4 + 
        sender_name.len() +
        4 + message.len()
    }
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
pub struct SolVaultData {
    pub bump: u8,
    pub owner: Pubkey,
    pub amount: u64
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
#[instruction(amount: u64, sender_name: String, message: String, timestamp: i64)]
pub struct DonateSol<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(mut)]
    pub receiver: SystemAccount<'info>,


    #[account(
        mut,
        seeds = [b"sol-vault", receiver.key().as_ref()],
        bump
    )]
    pub sol_vault: SystemAccount<'info>,


    #[account(
        init_if_needed,
        payer = donor,
        space = 8 + 1 + 32 + 8,
        seeds = [b"sol-vault-data", receiver.key().as_ref()],
        bump
    )]
    pub sol_vault_data: Account<'info, SolVaultData>,

    #[account(
        init,
        payer = donor,
        space = DonationMessage::calculate_space(&sender_name, &message),
        seeds = [
            b"donor-msg", 
            receiver.key().as_ref(), 
            donor.key().as_ref(),
            &timestamp.to_le_bytes()
        ],
        bump
    )]
    pub donate_msg: Account<'info, DonationMessage>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, sender_name: String, message: String, timestamp: i64)]
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

    #[account(
        init,
        payer = donor,
        space = DonationMessage::calculate_space(&sender_name, &message),
        seeds = [
            b"donor-msg", 
            receiver.key().as_ref(), 
            donor.key().as_ref(),
            &timestamp.to_le_bytes()
        ],
        bump
    )]
    pub donate_msg: Account<'info, DonationMessage>,


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
    pub sol_vault: SystemAccount<'info>,


    #[account(
        mut,
        seeds = [b"sol-vault-data", signer.key().as_ref()],
        bump
    )]
    pub sol_vault_data: Account<'info, SolVaultData>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub  struct  WithdrawSpl<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, 
        seeds = [b"spl-vault", signer.key().as_ref(), mint.key().as_ref()], 
        bump,
        token::mint = mint,
        token::authority = vault
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    pub signer_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"user-vault", signer.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub user_vault: Account<'info, UserVault>,

    #[account(seeds = [b"vault", signer.key().as_ref(), mint.key().as_ref()], bump)]
    /// CHECK: This is the PDA that acts as authority for `vault_token_account`. 
    /// It is safe because we derive it with the same seeds and bump as used in `vault_token_account`. 
    pub vault: UncheckedAccount<'info>,

    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[error_code]
pub enum CustomError {
    #[msg("Insufficient balance in vault")]
    InsufficientBalance,

    #[msg("Invalid Amount")]
    InvalidAmount
}
