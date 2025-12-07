import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { Fitfreak } from "../target/types/fitfreak";
import IDL from "../target/idl/fitfreak.json";

export class FitFreakClient {
  private program: Program<Fitfreak>;
  private connection: Connection;
  private wallet: Wallet;

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(IDL as any, provider);
  }

  async createContest(
    name: string,
    stakeAmount: number,
    startTime: number,
    endTime: number,
    maxParticipants: number,
    minParticipants: number
  ): Promise<{ tx: string; contestAddress: PublicKey; contestId: number }> {
    const stakeAmountLamports = stakeAmount * 1e9;
    
    // Get contest counter PDA
    const [contestCounter] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("contest_counter"),
        this.wallet.publicKey.toBuffer(),
      ],
      this.program.programId
    );

    // Get current count from counter (will be 0 if doesn't exist)
    let currentCount = 0;
    try {
      const counterAccount = await this.program.account.contestCounter.fetch(contestCounter);
      currentCount = counterAccount.count.toNumber();
    } catch (e) {
      // Counter doesn't exist yet, will be initialized with count 0
      currentCount = 0;
    }

    // Derive contest PDA using current count (before increment)
    // The program will use this count for contest_id, then increment
    const [contest] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("contest"),
        this.wallet.publicKey.toBuffer(),
        Buffer.from(new Uint8Array(new anchor.BN(currentCount).toArray("le", 8))),
      ],
      this.program.programId
    );

    const tx = await this.program.methods
      .createContest(
        name,
        new anchor.BN(stakeAmountLamports),
        new anchor.BN(startTime),
        new anchor.BN(endTime),
        maxParticipants,
        minParticipants
      )
      .accounts({
        contestCounter: contestCounter,
        contest: contest,
        owner: this.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { tx, contestAddress: contest, contestId: currentCount };
  }

  async getContestAddress(owner: PublicKey, contestId: number): Promise<PublicKey> {
    const [contest] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("contest"),
        owner.toBuffer(),
        Buffer.from(new Uint8Array(new anchor.BN(contestId).toArray("le", 8))),
      ],
      this.program.programId
    );
    return contest;
  }

  async joinContest(contestAddress: PublicKey): Promise<string> {
    const [participantAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("participant"),
        contestAddress.toBuffer(),
        this.wallet.publicKey.toBuffer(),
      ],
      this.program.programId
    );

    const tx = await this.program.methods
      .joinContest()
      .accounts({
        contest: contestAddress,
        participantAccount: participantAccount,
        participant: this.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async distributeRewards(
    contestAddress: PublicKey,
    winner1: PublicKey,
    winner2: PublicKey,
    winner3: PublicKey
  ): Promise<string> {
    const contest = await this.program.account.contest.fetch(contestAddress);
    const owner = contest.owner;

    const tx = await this.program.methods
      .distributeRewards(winner1, winner2, winner3)
      .accounts({
        contest: contestAddress,
        winner1Account: winner1,
        winner2Account: winner2,
        winner3Account: winner3,
        ownerAccount: owner,
        owner: this.wallet.publicKey,
      })
      .rpc();

    return tx;
  }

  async getContestInfo(contestAddress: PublicKey) {
    return await this.program.methods
      .getContestInfo()
      .accounts({
        contest: contestAddress,
      })
      .view();
  }

  async getContest(contestAddress: PublicKey) {
    return await this.program.account.contest.fetch(contestAddress);
  }
}

