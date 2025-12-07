import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Web3AuthStep from "../components/Web3AuthStep";
import WalletConnectStep from "../components/WalletConnectStep";
import VerificationStep from "../components/VerificationStep";
import ProgressIndicator from "../components/ProgressIndicator";
import aiWorkflow from "../api/ai/aiCoach";
import { useWeb3 } from "../hooks/useWeb3";
type UserInfo = { wallet?: string; goal?: string; nickname?: string };

const AuthPage = () => {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const navigate = useNavigate();
  const { connectWallet, account, isConnecting, isWalletInstalled } = useWeb3();

  const handleWalletConnect = async () => {
    try {
      const walletAddress = await connectWallet();
      setUserInfo((prev) => ({ ...prev, wallet: walletAddress }));
      setStep(2);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      if (!isWalletInstalled) {
        alert("MetaMask not found. Please install MetaMask to continue.");
      }
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal = formData.get("goal") as string;
    const level = formData.get("level") as string;

    setUserInfo((prev) => ({ ...prev, goal, level }));

    const response = await aiWorkflow("18-25", "Male", "Body fit", "Noob");
    console.log(response);
    // Store user info in localStorage or send to backend
    localStorage.setItem(
      "cyberfit_user",
      JSON.stringify({
        ...userInfo,
        goal,
        level,
        timestamp: Date.now(),
      })
    );

    navigate("/dashboard");
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        ></motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <WalletConnectStep
              isConnecting={isConnecting}
              onConnect={handleWalletConnect}
              onBack={handleBack}
            />
          )}

          {step === 2 && (
            <VerificationStep
              wallet={userInfo.wallet}
              onSubmit={handleVerificationSubmit}
            />
          )}
        </motion.div>

        <ProgressIndicator currentStep={step} totalSteps={2} />
      </div>
    </div>
  );
};

export default AuthPage;
