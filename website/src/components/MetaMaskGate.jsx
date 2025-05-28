"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Download, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useMetaMask } from "./MetaMaskProvider";

export default function MetaMaskGate({ onClose }) {
  const {
    isMetaMaskInstalled,
    isConnected,
    isLoading,
    account,
    connectWallet,
    error,
  } = useMetaMask();
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const uploadMetaMaskAddressToBackend = async () => {
      try {
        const res = await fetch("/api/user/metamask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ metamaskAddress: account }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to upload MetaMask address.");
        }
        setHasUploaded(true);
      } catch (err) {
        setUploadError(err.message);
        console.error("Upload failed:", err);
      }
    };

    if (isConnected && account && !hasUploaded) {
      uploadMetaMaskAddressToBackend();
    }
  }, [isConnected, account, hasUploaded]);

  const handleConnectWallet = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setUploadError(null);
    try {
      await connectWallet();
    } catch (err) {
      console.error("Connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  // If already connected and address uploaded, close the modal
  useEffect(() => {
    if (isConnected && hasUploaded) {
      setTimeout(() => {
        onClose();
      }, 1500); // Show success state briefly before closing
    }
  }, [isConnected, hasUploaded, onClose]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="flex flex-col items-center space-y-4">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <div className="text-lg font-medium text-gray-700">
              Checking MetaMask status...
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="mt-[50vh] relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <motion.button
            onClick={onClose}
            className="z-[999] absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-12 w-12" />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">MetaMask Wallet</h2>
              <p className="text-blue-100 text-sm">Secure blockchain connection</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success State */}
          {isConnected && hasUploaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Successfully Connected!</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Wallet: {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Error States */}
          {(error || uploadError) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                {error?.message || uploadError}
              </div>
            </motion.div>
          )}

          {/* MetaMask Not Installed */}
          {!isMetaMaskInstalled && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Install MetaMask</h3>
                <p className="text-gray-600">
                  MetaMask is required to connect your wallet and access blockchain features.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                  <span>Install MetaMask browser extension</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 mt-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                  <span>Create or import your wallet</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 mt-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                  <span>Return here to connect</span>
                </div>
              </div>

              <motion.a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-5 w-5" />
                <span>Install MetaMask</span>
              </motion.a>
            </div>
          )}

          {/* MetaMask Installed but Not Connected */}
          {isMetaMaskInstalled && !isConnected && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Connect Your Wallet</h3>
                <p className="text-gray-600">
                  Connect your MetaMask wallet to access all features and start your blockchain journey.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm font-medium">Secure • Encrypted • Private</span>
                </div>
              </div>

              <motion.button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className={`w-full inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                  isConnecting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
                whileHover={!isConnecting ? { scale: 1.02 } : {}}
                whileTap={!isConnecting ? { scale: 0.98 } : {}}
              >
                {isConnecting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Connected but Upload in Progress */}
          {isConnected && !hasUploaded && !uploadError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Securing Connection</h3>
                <p className="text-gray-600 text-sm">
                  Saving your wallet address securely...
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            Your wallet information is encrypted and secure
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}