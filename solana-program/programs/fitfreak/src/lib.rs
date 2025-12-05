use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("FitFreak1111111111111111111111111111111111");

#[program]
pub mod fitfreak {
    use super::*;

    /// Initialize a new fitness contest
    pub fn create_contest(
        ctx: Context<CreateContest>,
        contest_id: u64,
        stake_amount: u64,
        max_participants: u8,
        duration_seconds: i64,
    ) -> Result<()> {
        let contest = &mut ctx.accounts.contest;
        contest.authority = ctx.accounts.authority.key();
        contest.contest_id = contest_id;
        contest.stake_amount = stake_amount;
        contest.max_participants = max_participants;
        contest.participant_count = 0;
        contest.prize_pool = 0;
        contest.duration_seconds = duration_seconds;
        contest.start_time = Clock::get()?.unix_timestamp;
        contest.end_time = contest.start_time + duration_seconds;
        contest.is_active = true;

        // Contest vault will be initialized by Anchor's init constraint

        msg!("Contest {} created by {}", contest_id, ctx.accounts.authority.key());
        Ok(())
    }

    /// Join a contest by staking SOL
    pub fn join_contest(ctx: Context<JoinContest>, contest_id: u64) -> Result<()> {
        let contest = &mut ctx.accounts.contest;
        
        require!(contest.is_active, ContestError::ContestNotActive);
        require!(
            contest.participant_count < contest.max_participants,
            ContestError::ContestFull
        );
        require!(
            Clock::get()?.unix_timestamp < contest.end_time,
            ContestError::ContestEnded
        );

        // Transfer native SOL from participant to contest vault
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.participant.to_account_info(),
            to: ctx.accounts.contest_vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        system_program::transfer(cpi_ctx, contest.stake_amount)?;

        contest.participant_count += 1;
        contest.prize_pool += contest.stake_amount;

        msg!(
            "Participant {} joined contest {}. Total participants: {}",
            ctx.accounts.participant.key(),
            contest_id,
            contest.participant_count
        );

        Ok(())
    }

    /// Distribute rewards to winners (called by authority)
    pub fn distribute_rewards(
        ctx: Context<DistributeRewards>,
        contest_id: u64,
        reward_amount: u64,
    ) -> Result<()> {
        let contest = &ctx.accounts.contest;
        
        require!(
            ctx.accounts.authority.key() == contest.authority,
            ContestError::Unauthorized
        );
        require!(
            Clock::get()?.unix_timestamp >= contest.end_time,
            ContestError::ContestNotEnded
        );
        require!(reward_amount <= contest.prize_pool, ContestError::InsufficientFunds);

        // Transfer native SOL from contest vault to winner
        let seeds = &[
            b"contest_vault",
            &contest.contest_id.to_le_bytes(),
            &[ctx.bumps.contest_vault],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.contest_vault.to_account_info(),
            to: ctx.accounts.winner.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        system_program::transfer(cpi_ctx, reward_amount)?;

        msg!(
            "Reward of {} lamports distributed to {} for contest {}",
            reward_amount,
            ctx.accounts.winner.key(),
            contest_id
        );

        Ok(())
    }

    /// Close contest and refund remaining funds
    pub fn close_contest(ctx: Context<CloseContest>, contest_id: u64) -> Result<()> {
        let contest = &mut ctx.accounts.contest;
        
        require!(
            ctx.accounts.authority.key() == contest.authority,
            ContestError::Unauthorized
        );

        contest.is_active = false;

        msg!("Contest {} closed", contest_id);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(contest_id: u64)]
pub struct CreateContest<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Contest::LEN,
        seeds = [b"contest", &contest_id.to_le_bytes()],
        bump
    )]
    pub contest: Account<'info, Contest>,
    
    #[account(
        init,
        payer = authority,
        space = 8,
        seeds = [b"contest_vault", &contest_id.to_le_bytes()],
        bump
    )]
    pub contest_vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(contest_id: u64)]
pub struct JoinContest<'info> {
    #[account(
        mut,
        seeds = [b"contest", &contest_id.to_le_bytes()],
        bump
    )]
    pub contest: Account<'info, Contest>,
    
    #[account(mut)]
    pub participant: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"contest_vault", &contest_id.to_le_bytes()],
        bump
    )]
    pub contest_vault: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(contest_id: u64)]
pub struct DistributeRewards<'info> {
    #[account(
        mut,
        seeds = [b"contest", &contest_id.to_le_bytes()],
        bump
    )]
    pub contest: Account<'info, Contest>,
    
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"contest_vault", &contest_id.to_le_bytes()],
        bump
    )]
    pub contest_vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub winner: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(contest_id: u64)]
pub struct CloseContest<'info> {
    #[account(
        mut,
        seeds = [b"contest", &contest_id.to_le_bytes()],
        bump
    )]
    pub contest: Account<'info, Contest>,
    
    pub authority: Signer<'info>,
}

#[account]
pub struct Contest {
    pub authority: Pubkey,
    pub contest_id: u64,
    pub stake_amount: u64,
    pub max_participants: u8,
    pub participant_count: u8,
    pub prize_pool: u64,
    pub duration_seconds: i64,
    pub start_time: i64,
    pub end_time: i64,
    pub is_active: bool,
}

impl Contest {
    pub const LEN: usize = 32 + 8 + 8 + 1 + 1 + 8 + 8 + 8 + 8 + 1;
}

#[error_code]
pub enum ContestError {
    #[msg("Contest is not active")]
    ContestNotActive,
    #[msg("Contest is full")]
    ContestFull,
    #[msg("Contest has ended")]
    ContestEnded,
    #[msg("Contest has not ended yet")]
    ContestNotEnded,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}

