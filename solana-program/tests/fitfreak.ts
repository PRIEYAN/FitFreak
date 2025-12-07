import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Fitfreak } from "../target/types/fitfreak";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";

describe("fitfreak", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Fitfreak as Program<Fitfreak>;
  const owner = provider.wallet;
  const participant = anchor.web3.Keypair.generate();

  let contestPda: PublicKey;
  let contestBump: number;

  before(async () => {
    // Airdrop SOL to participant
    const signature = await provider.connection.requestAirdrop(
      participant.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  });

  it("Creates a contest", async () => {
    const name = "Test Contest";
    const stakeAmount = new anchor.BN(0.1 * LAMPORTS_PER_SOL);
    const startTime = new anchor.BN(Math.floor(Date.now() / 1000));
    const endTime = new anchor.BN(Math.floor(Date.now() / 1000) + 86400);
    const maxParticipants = 10;
    const minParticipants = 2;

    const [contestCounter] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("contest_counter"),
        owner.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [contest] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("contest"),
        owner.publicKey.toBuffer(),
        Buffer.from(new Uint8Array(new anchor.BN(0).toArray("le", 8))),
      ],
      program.programId
    );

    contestPda = contest;

    const tx = await program.methods
      .createContest(
        name,
        stakeAmount,
        startTime,
        endTime,
        maxParticipants,
        minParticipants
      )
      .accounts({
        contest: contest,
        contestCounter: contestCounter,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Contest created:", tx);

    const contestAccount = await program.account.contest.fetch(contest);
    expect(contestAccount.name).to.equal(name);
    expect(contestAccount.stakeAmount.toNumber()).to.equal(stakeAmount.toNumber());
  });

  it("Joins a contest", async () => {
    const [participantAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("participant"),
        contestPda.toBuffer(),
        participant.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .joinContest()
      .accounts({
        contest: contestPda,
        participantAccount: participantAccount,
        participant: participant.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([participant])
      .rpc();

    console.log("Joined contest:", tx);

    const contestAccount = await program.account.contest.fetch(contestPda);
    expect(contestAccount.participantCount).to.equal(1);
  });

  it("Gets contest info", async () => {
    const contestInfo = await program.methods
      .getContestInfo()
      .accounts({
        contest: contestPda,
      })
      .view();

    expect(contestInfo.name).to.equal("Test Contest");
    expect(contestInfo.participantCount).to.equal(1);
  });
});

