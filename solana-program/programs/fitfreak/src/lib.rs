use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("FitFreak1111111111111111111111111111111111");

#[program]
pub mod fitfreak {
    use super::*;

    pub fn create_contest(
        ctx: Context<CreateContest>,
        name: String,
        stake_amount: u64,
        start_time: i64,
        end_time: i64,
        max_participants: u8,
        min_participants: u8,
    ) -> Result<()> {
        let contest = &mut ctx.accounts.contest;
        let contest_counter = &mut ctx.accounts.contest_counter;

        // The PDA was derived using the current count (before increment)
        // So contest_id should match the count used in PDA derivation
        // Then we increment the counter for the next contest
        let contest_id = contest_counter.count;
        contest_counter.count += 1;

        // Initialize contest
        contest.owner = ctx.accounts.owner.key();
        contest.contest_id = contest_id;
        contest.name = name;
        contest.stake_amount = stake_amount;
        contest.start_time = start_time;
        contest.end_time = end_time;
        contest.max_participants = max_participants;
        contest.min_participants = min_participants;
        contest.participant_count = 0;
        contest.rewards_distributed = false;
        contest.bump = ctx.bumps.contest;

        emit!(ContestCreated {
            contest_id: contest.key(),
            name: contest.name.clone(),
        });

        Ok(())
    }

    pub fn join_contest(ctx: Context<JoinContest>) -> Result<()> {
        let contest = &mut ctx.accounts.contest;
        let clock = Clock::get()?;

        require!(
            clock.unix_timestamp >= contest.start_time,
            FitFreakError::ContestNotStarted
        );
        require!(
            clock.unix_timestamp < contest.end_time,
            FitFreakError::ContestEnded
        );
        require!(
            contest.participant_count < contest.max_participants as u8,
            FitFreakError::ContestFull
        );

        // Transfer SOL stake to contest account
        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_program::transfer(
                &ctx.accounts.participant.key(),
                &contest.key(),
                contest.stake_amount,
            ),
            &[
                ctx.accounts.participant.to_account_info(),
                ctx.accounts.contest.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Create participant PDA
        let participant_account = &mut ctx.accounts.participant_account;
        participant_account.contest = contest.key();
        participant_account.participant = ctx.accounts.participant.key();
        participant_account.joined_at = clock.unix_timestamp;
        participant_account.bump = ctx.bumps.participant_account;

        contest.participant_count += 1;

        emit!(ParticipantJoined {
            contest_id: contest.key(),
            participant: ctx.accounts.participant.key(),
        });

        Ok(())
    }

    pub fn distribute_rewards(
        ctx: Context<DistributeRewards>,
        winner1: Pubkey,
        winner2: Pubkey,
        winner3: Pubkey,
    ) -> Result<()> {
        let contest = &mut ctx.accounts.contest;
        let clock = Clock::get()?;

        require!(
            clock.unix_timestamp > contest.end_time,
            FitFreakError::ContestStillActive
        );
        require!(
            !contest.rewards_distributed,
            FitFreakError::RewardsAlreadyDistributed
        );
        require!(
            contest.participant_count >= contest.min_participants,
            FitFreakError::NotEnoughParticipants
        );

        let total_pool = contest.participant_count as u64 * contest.stake_amount;
        let first_prize = total_pool * 40 / 100;
        let second_prize = total_pool * 30 / 100;
        let third_prize = total_pool * 20 / 100;
        let admin_cut = total_pool - (first_prize + second_prize + third_prize);

        // Transfer rewards
        **ctx.accounts.contest.to_account_info().try_borrow_mut_lamports()? -= first_prize;
        **ctx.accounts.winner1_account.to_account_info().try_borrow_mut_lamports()? += first_prize;

        **ctx.accounts.contest.to_account_info().try_borrow_mut_lamports()? -= second_prize;
        **ctx.accounts.winner2_account.to_account_info().try_borrow_mut_lamports()? += second_prize;

        **ctx.accounts.contest.to_account_info().try_borrow_mut_lamports()? -= third_prize;
        **ctx.accounts.winner3_account.to_account_info().try_borrow_mut_lamports()? += third_prize;

        **ctx.accounts.contest.to_account_info().try_borrow_mut_lamports()? -= admin_cut;
        **ctx.accounts.owner_account.to_account_info().try_borrow_mut_lamports()? += admin_cut;

        contest.rewards_distributed = true;

        emit!(RewardsDistributed {
            contest_id: contest.key(),
        });

        Ok(())
    }

    pub fn get_contest_info(ctx: Context<GetContestInfo>) -> Result<ContestInfo> {
        let contest = &ctx.accounts.contest;
        Ok(ContestInfo {
            owner: contest.owner,
            contest_id: contest.contest_id,
            name: contest.name.clone(),
            stake_amount: contest.stake_amount,
            start_time: contest.start_time,
            end_time: contest.end_time,
            max_participants: contest.max_participants,
            min_participants: contest.min_participants,
            participant_count: contest.participant_count,
            rewards_distributed: contest.rewards_distributed,
        })
    }
}

#[derive(Accounts)]
pub struct CreateContest<'info> {
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + ContestCounter::LEN,
        seeds = [b"contest_counter", owner.key().as_ref()],
        bump
    )]
    pub contest_counter: Account<'info, ContestCounter>,
    #[account(
        init,
        payer = owner,
        space = 8 + Contest::LEN,
        seeds = [b"contest", owner.key().as_ref(), &contest_counter.count.to_le_bytes()],
        bump
    )]
    pub contest: Account<'info, Contest>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinContest<'info> {
    #[account(mut)]
    pub contest: Account<'info, Contest>,
    #[account(
        init,
        payer = participant,
        space = 8 + ParticipantAccount::LEN,
        seeds = [b"participant", contest.key().as_ref(), participant.key().as_ref()],
        bump
    )]
    pub participant_account: Account<'info, ParticipantAccount>,
    #[account(mut)]
    pub participant: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(
        mut,
        has_one = owner @ FitFreakError::Unauthorized
    )]
    pub contest: Account<'info, Contest>,
    /// CHECK: Winner accounts validated in instruction
    #[account(mut)]
    pub winner1_account: AccountInfo<'info>,
    /// CHECK: Winner accounts validated in instruction
    #[account(mut)]
    pub winner2_account: AccountInfo<'info>,
    /// CHECK: Winner accounts validated in instruction
    #[account(mut)]
    pub winner3_account: AccountInfo<'info>,
    /// CHECK: Owner account validated by has_one
    #[account(mut)]
    pub owner_account: AccountInfo<'info>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetContestInfo<'info> {
    pub contest: Account<'info, Contest>,
}

#[account]
pub struct Contest {
    pub owner: Pubkey,
    pub contest_id: u64,
    pub name: String,
    pub stake_amount: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub max_participants: u8,
    pub min_participants: u8,
    pub participant_count: u8,
    pub rewards_distributed: bool,
    pub bump: u8,
}

impl Contest {
    pub const LEN: usize = 32 + 8 + 4 + 32 + 8 + 8 + 8 + 1 + 1 + 1 + 1 + 1;
}

#[account]
pub struct ContestCounter {
    pub count: u64,
}

impl ContestCounter {
    pub const LEN: usize = 8;
}

#[account]
pub struct ParticipantAccount {
    pub contest: Pubkey,
    pub participant: Pubkey,
    pub joined_at: i64,
    pub bump: u8,
}

impl ParticipantAccount {
    pub const LEN: usize = 32 + 32 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ContestInfo {
    pub owner: Pubkey,
    pub contest_id: u64,
    pub name: String,
    pub stake_amount: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub max_participants: u8,
    pub min_participants: u8,
    pub participant_count: u8,
    pub rewards_distributed: bool,
}

#[error_code]
pub enum FitFreakError {
    #[msg("Contest has not started yet")]
    ContestNotStarted,
    #[msg("Contest has ended")]
    ContestEnded,
    #[msg("Contest is full")]
    ContestFull,
    #[msg("Contest is still active")]
    ContestStillActive,
    #[msg("Rewards have already been distributed")]
    RewardsAlreadyDistributed,
    #[msg("Not enough participants")]
    NotEnoughParticipants,
    #[msg("Unauthorized")]
    Unauthorized,
}

#[event]
pub struct ContestCreated {
    pub contest_id: Pubkey,
    pub name: String,
}

#[event]
pub struct ParticipantJoined {
    pub contest_id: Pubkey,
    pub participant: Pubkey,
}

#[event]
pub struct RewardsDistributed {
    pub contest_id: Pubkey,
}

