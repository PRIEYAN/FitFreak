import { motion } from "framer-motion";
import { Wallet, Zap, AlertCircle } from "lucide-react";
import GlassCard from "./GlassCard";
import NeonButton from "./NeonButton";

interface WalletConnectStepProps {
  isConnecting: boolean;
  onConnect: () => void;
  onBack: () => void;
}

const WalletConnectStep = ({
  isConnecting,
  onConnect,
  onBack,
}: WalletConnectStepProps) => {
  return (
    <GlassCard className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-sky-blue/20 to-sky-light/20 rounded-full border-2 border-sky-blue mx-auto mb-4 flex items-center justify-center">
          <Wallet className="w-10 h-10 text-sky-blue" />
        </div>
      </motion.div>

      <h2 className="font-display text-2xl font-bold mb-2 text-gradient">
        Wallet Connection
      </h2>
      <p className="text-slate-600 text-sm mb-6">
        Connect your MetaMask wallet to access the FitFreak ecosystem
      </p>

      {/* Wallet Info */}
      <div className="bg-sky-bg border border-sky-light rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGNjY1MkEiLz4KPHBhdGggZD0iTTI0IDEzTDE2IDIxTDggMTNIMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4="
            alt="MetaMask"
            className="w-6 h-6"
          />
          <span className="text-slate-800 font-semibold">MetaMask</span>
        </div>
        <p className="text-xs text-slate-500">Industry standard Web3 wallet</p>
      </div>

      <div className="flex items-start space-x-2 mb-6 text-left bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          Make sure MetaMask is installed and unlocked before connecting.
        </div>
      </div>

      <NeonButton
        onClick={onConnect}
        className="w-full mb-4"
        size="lg"
        disabled={isConnecting}
      >
        {isConnecting ? (
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 animate-spin" />
            <span>Connecting Wallet...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Connect MetaMask</span>
          </div>
        )}
      </NeonButton>

      <motion.button
        className="text-slate-500 hover:text-sky-blue transition-colors text-sm"
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        disabled={isConnecting}
      >
        ← Back to Authentication
      </motion.button>
    </GlassCard>
  );
};

export default WalletConnectStep;
