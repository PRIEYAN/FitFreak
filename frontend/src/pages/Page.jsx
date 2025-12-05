"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  countries,
  getUniversalLink,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";

export default function Web3AuthQR() {
  const navigate = useNavigate();

  const [linkCopied, setLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selfApp, setSelfApp] = useState("");
  const [universalLink, setUniversalLink] = useState("");
  const [initError, setInitError] = useState(null);

  const excludedCountries = useMemo(() => [countries.PAKISTAN], []);

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Initialize Self app
  useEffect(() => {
    try {
      const endpoint = import.meta.env.VITE_SELF_ENDPOINT;
      if (!endpoint) {
        throw new Error("VITE_SELF_ENDPOINT environment variable is not set");
      }

      const app = new SelfAppBuilder({
        version: 2,
        appName: import.meta.env.VITE_SELF_APP_NAME || "Fitness Web3",
        scope: import.meta.env.VITE_SELF_SCOPE || "self-workshop",
        endpoint,
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: ethers.ZeroAddress,
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: "Fitness Web3!!!",
        disclosures: {
          minimumAge: 18,
          excludedCountries,
          name: true,
          nationality: true,
          date_of_birth: true,
          gender: true,
        },
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
      setInitError(null);
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
      setInitError(error.message);
      displayToast(`Initialization error: ${error.message}`);
    }
  }, [excludedCountries]);

  const copyToClipboard = () => {
    if (!universalLink) return;

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true);
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => displayToast("Failed to copy link"));
  };

  const openSelfApp = () => {
    if (!universalLink) return;
    window.open(universalLink, "_blank");
    displayToast("Opening Self App...");
  };

  const handleSuccessfulVerification = (data) => {
    try {
      console.log("Verified Data:", data);
      displayToast("Verification successful! Redirecting...");
    } catch (error) {
      console.error("Error processing verification data:", error);
      displayToast("Error processing verification data");
      return;
    }
    
    setTimeout(() => {
      navigate("/auth");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <GlassCard className="max-w-md w-full text-center p-6">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-cyber-green bg-opacity-20 rounded-full border-2 border-cyber-green mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-cyber-green" />
          </div>
        </motion.div>

        <h2 className="font-orbitron text-2xl font-bold mb-2 text-cyber-green">
          Self Authentication
        </h2>
        <p className="text-gray-300 text-sm mb-6">
          Scan the QR code with Self Protocol App to verify your identity
        </p>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          {initError ? (
            <div className="w-[256px] h-[256px] bg-red-900/20 border-2 border-red-500 flex items-center justify-center rounded-lg p-4">
              <p className="text-red-400 text-sm text-center">{initError}</p>
            </div>
          ) : selfApp ? (
            <SelfQRcodeWrapper
              selfApp={selfApp}
              onSuccess={handleSuccessfulVerification}
              onError={(error) => {
                console.error("Verification error:", error);
                displayToast("Error: Failed to verify identity");
              }}
            />
          ) : (
            <div className="w-[256px] h-[256px] bg-gray-800 animate-pulse flex items-center justify-center rounded-lg">
              <p className="text-gray-400 text-sm">Loading QR Code...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <NeonButton 
            onClick={copyToClipboard} 
            className="flex-1" 
            size="md"
            disabled={!universalLink}
            aria-label={linkCopied ? "Link copied" : "Copy universal link to clipboard"}
          >
            {linkCopied ? "Copied!" : "Copy Link"}
          </NeonButton>
          <NeonButton 
            onClick={openSelfApp} 
            className="flex-1" 
            size="md"
            disabled={!universalLink}
            aria-label="Open Self App in new window"
          >
            Open Self App
          </NeonButton>
        </div>

        {/* Toast */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg text-sm z-50 max-w-xs"
            role="alert"
            aria-live="polite"
          >
            {toastMessage}
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}
