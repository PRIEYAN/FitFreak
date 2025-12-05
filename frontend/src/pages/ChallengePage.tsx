import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Play, Activity, Camera, Wallet, Trophy, Zap, Crown, Star } from "lucide-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import outputSquatGif from "../gifs/output_squat.gif";
import { HARDCODED_CONTESTS, getTimeRemaining } from "../data/contests";
import { API_CONFIG } from "../config/api";
import { useWeb3 } from "../hooks/useWeb3";

const ChallengePage = () => {
  const [showContestModal, setShowContestModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isStaking, setIsStaking] = useState(false);
  const [stakingStatus, setStakingStatus] = useState("");
  const [contests, setContests] = useState(HARDCODED_CONTESTS);

  // Use Solana Web3 hook
  const {
    account,
    publicKey,
    balance,
    isConnecting,
    isWalletInstalled,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    error: walletError
  } = useWeb3();

  const isConnected = !!account;

  // Stake in contest (Solana version)
  const stakeInContest = async (contest) => {
    if (!isConnected || !publicKey) {
      alert("Please connect your Solana wallet first!");
      return;
    }

    try {
      setIsStaking(true);
      setStakingStatus("Preparing transaction...");
      
      // Convert stake amount to SOL (assuming contest.stakeAmount is in lamports or SOL)
      const stakeAmount = parseFloat(contest.stakeAmount) / 1e9; // Convert from lamports if needed
      
      setStakingStatus("Please confirm transaction in your wallet...");

      // For now, we'll use a simple transfer
      // In production, you'd call your Solana program here
      // TODO: Replace with actual program call when program is deployed
      const programAddress = API_CONFIG.PROGRAM_ADDRESS;
      
      if (!programAddress) {
        // Fallback: Just show success for demo
        setStakingStatus("Success! You've joined the contest!");
        
        setContests(prevContests => 
          prevContests.map(c => 
            c.id === contest.id 
              ? { ...c, participantCount: c.participantCount + 1 }
              : c
          )
        );

        setTimeout(() => {
          setShowContestModal(false);
          setStakingStatus("");
        }, 2000);
        return;
      }

      // Send transaction to Solana program
      // This is a placeholder - replace with actual program interaction
      setStakingStatus("Transaction submitted, waiting for confirmation...");

      // Simulate transaction confirmation
      setTimeout(() => {
        setStakingStatus("Success! You've joined the contest!");
        
        setContests(prevContests => 
          prevContests.map(c => 
            c.id === contest.id 
              ? { ...c, participantCount: c.participantCount + 1 }
              : c
          )
        );

        setTimeout(() => {
          setShowContestModal(false);
          setStakingStatus("");
        }, 2000);
      }, 2000);

    } catch (error) {
      console.error("Error staking:", error);
      setStakingStatus(`Error: ${error.message}`);
    } finally {
      setIsStaking(false);
    }
  };

  // Open contest modal
  const openContestModal = (contest) => {
    setSelectedContest(contest);
    setShowContestModal(true);
    setStakingStatus("");
  };

  // Get contest icon
  const getContestIcon = (contest) => {
    switch (contest.id) {
      case 1: return <Zap className="w-6 h-6 text-green-500" />;
      case 2: return <Activity className="w-6 h-6 text-blue-500" />;
      case 3: return <Trophy className="w-6 h-6 text-purple-500" />;
      case 4: return <Crown className="w-6 h-6 text-yellow-500" />;
      default: return <Star className="w-6 h-6 text-sky-blue" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-bg via-sky-lightest to-sky-bg-light">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold text-gradient mb-4"
          >
            🏆 Fitness Challenges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 mb-8"
          >
            Join contests, stake SOL, and win rewards!
          </motion.p>

          {/* Wallet Connection */}
          <div className="flex justify-center gap-4 mb-8">
            {!isConnected ? (
              <NeonButton
                onClick={connectWallet}
                disabled={isConnecting || !isWalletInstalled}
                className="px-8 py-3"
              >
                {isConnecting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    {isWalletInstalled ? "Connect Solana Wallet" : "Install Solana Wallet"}
                  </div>
                )}
              </NeonButton>
            ) : (
              <div className="flex items-center gap-4 glass-card rounded-lg px-6 py-3">
                <div className="flex items-center gap-2 text-sky-blue">
                  <div className="w-2 h-2 bg-sky-blue rounded-full animate-pulse" />
                  Connected
                </div>
                <div className="text-slate-800 font-semibold">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                <div className="text-slate-600">
                  {balance.toFixed(4)} SOL
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="h-full flex flex-col">
                  {/* Contest Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-blue/20 to-sky-light/20 rounded-lg flex items-center justify-center">
                      {getContestIcon(contest)}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Difficulty</div>
                      <div className="font-semibold text-sky-blue">{contest.difficulty}</div>
                    </div>
                  </div>

                  {/* Contest Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gradient mb-2">
                    {contest.name}
                  </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      {contest.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center">
                          <Wallet className="w-4 h-4 mr-1" />
                          Stake:
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {contest.stakeAmountDisplay} SOL
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Participants:
                        </span>
                        <span className="text-slate-800">
                          {contest.participantCount}/{contest.maxParticipants}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Duration:
                        </span>
                        <span className="text-slate-800">{contest.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          Prize Pool:
                    </span>
                        <span className="text-sky-blue font-semibold">
                          {contest.prizePool}
                    </span>
                  </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          Time Left:
                        </span>
                        <span className="text-slate-800">
                          {getTimeRemaining(contest.endTime)}
                    </span>
                  </div>
                </div>
                  </div>

                  {/* Action Button */}
                  <NeonButton
                    onClick={() => openContestModal(contest)}
                    className="w-full mt-auto"
                    disabled={!isConnected}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      {isConnected ? "Join Contest" : "Connect to Join"}
                    </div>
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
              </div>
      </div>

      {/* Contest Modal */}
      {showContestModal && selectedContest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <GlassCard className="max-w-xl w-full max-h-[70vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="font-display text-2xl font-bold text-gradient mb-2">
                {selectedContest.name}
              </h3>
              <p className="text-slate-600 mb-4">
                {selectedContest.description}
              </p>
            </div>

            <div className="relative mb-6">
              <div className="aspect-video bg-slate-100 rounded-lg border-2 border-sky-blue relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-dashed border-sky-blue/50 rounded-lg" />
                <div className="flex items-center justify-center h-full">
                  <img
                    src={outputSquatGif}
                    alt="contest demo"
                    className="max-w-full h-auto object-contain"
                  />
                </div>

                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-sky-blue opacity-60" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-sky-blue opacity-60" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-sky-blue opacity-60" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-sky-blue opacity-60" />
              </div>
            </div>

            {selectedContest && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="glass-card rounded-lg p-3">
                    <div className="text-slate-500">Stake Amount</div>
                    <div className="text-sky-blue font-semibold">
                      {selectedContest.stakeAmountDisplay} SOL
                    </div>
                  </div>
                  <div className="glass-card rounded-lg p-3">
                    <div className="text-slate-500">Prize Pool</div>
                    <div className="text-sky-blue font-semibold">
                      {selectedContest.prizePool}
                    </div>
                  </div>
                  <div className="glass-card rounded-lg p-3">
                    <div className="text-slate-500">Participants</div>
                    <div className="text-slate-800 font-semibold">
                      {selectedContest.participantCount}/{selectedContest.maxParticipants}
                    </div>
                  </div>
                  <div className="glass-card rounded-lg p-3">
                    <div className="text-slate-500">Duration</div>
                    <div className="text-slate-800 font-semibold">{selectedContest.duration}</div>
                  </div>
                </div>

                {/* Staking Status */}
                {stakingStatus && (
                  <div className={`glass-card rounded-lg p-3 mb-4 ${
                    stakingStatus.includes("Success") 
                      ? "border-sky-blue" 
                      : stakingStatus.includes("failed") || stakingStatus.includes("Error")
                      ? "border-red-500"
                      : "border-sky-light"
                  }`}>
                    <div className={`text-center ${
                      stakingStatus.includes("Success") 
                        ? "text-sky-blue" 
                        : stakingStatus.includes("failed") || stakingStatus.includes("Error")
                        ? "text-red-500"
                        : "text-sky-light"
                    }`}>
                      {stakingStatus}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                <NeonButton
                    onClick={() => setShowContestModal(false)}
                    variant="secondary"
                    className="flex-1"
                >
                  Cancel
                </NeonButton>
                  <NeonButton
                    onClick={() => stakeInContest(selectedContest)}
                    disabled={isStaking || !isConnected}
                    className="flex-1"
                  >
                    {isStaking ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Staking...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Stake {selectedContest.stakeAmountDisplay} SOL
                      </div>
                    )}
                  </NeonButton>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default ChallengePage;