import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, User, Target, Zap, Crown } from "lucide-react";
import GlassCard from "./GlassCard";
import NeonButton from "./NeonButton";

interface VerificationStepProps {
  wallet?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const VerificationStep = ({ wallet, onSubmit }: VerificationStepProps) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("noob");
  const navigate = useNavigate();

  const levels = [
    { id: "noob", name: "Noob", icon: Zap },
    { id: "mid", name: "Mid", icon: Target },
    { id: "god", name: "God", icon: Crown },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    navigate("/dashboard");
  };

  return (
    <GlassCard className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-sky-blue/20 to-sky-light/20 rounded-full border-2 border-sky-blue mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-sky-blue" />
        </div>
      </motion.div>

      <h2 className="font-display text-2xl font-bold mb-2 text-gradient">
        Verify Your Details
      </h2>
      <p className="text-slate-600 text-sm mb-6">
        Confirm your wallet and answer a couple of quick questions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Wallet Verification */}
        <div className="bg-sky-bg border border-sky-light rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-sky-blue" />
            <span className="text-sky-blue font-semibold text-sm">
              Wallet Connected
            </span>
          </div>
          <p className="text-slate-700 font-mono text-xs break-all">{wallet}</p>
        </div>

        {/* Level Selection */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <User className="w-4 h-4 text-sky-blue" />
            <span className="text-slate-700 text-sm font-medium">
              Select Your Fitness Level
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {levels.map((level) => (
              <motion.div
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-300 text-center ${
                  selectedLevel === level.id
                    ? "border-sky-blue bg-gradient-to-br from-sky-blue/20 to-sky-light/20"
                    : "border-slate-200 bg-white hover:border-sky-blue hover:border-opacity-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <level.icon className={`w-6 h-6 ${selectedLevel === level.id ? 'text-sky-blue' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold uppercase ${selectedLevel === level.id ? 'text-sky-blue' : 'text-slate-600'}`}>
                    {level.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Goal Input */}
        <div>
          <label className="block">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-sky-blue" />
              <span className="text-slate-700 text-sm font-medium">
                Your Fitness Goal
              </span>
            </div>
            <input
              name="goal"
              type="text"
              placeholder="e.g., Build strength, lose weight, run marathon..."
              className="w-full bg-white border border-sky-light rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-sky-blue focus:outline-none transition-colors"
              required
              maxLength={100}
            />
          </label>
        </div>

        {/* Hidden input for selected level */}
        <input type="hidden" name="level" value={selectedLevel} />

        <NeonButton type="submit" className="w-full" size="md">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Complete Setup & Enter</span>
          </div>
        </NeonButton>
      </form>

      <div className="mt-4 text-xs text-slate-500">
        Your data is encrypted and stored securely on-chain
      </div>
    </GlassCard>
  );
};

export default VerificationStep;
