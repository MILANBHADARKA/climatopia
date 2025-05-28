"use client";

import { useEffect, useState } from "react";
import { useMetaMask } from "./MetaMaskProvider";

export default function MetaMaskGate({ children }) {
  const {
    isMetaMaskInstalled,
    isConnected,
    isLoading,
    account,
    connectWallet,
  } = useMetaMask();
  const [hasUploaded, setHasUploaded] = useState(false);

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
          throw new Error(data.error || "Failed to upload MetaMask address.");
        }
        setHasUploaded(true); // prevent re-uploading
      } catch (err) {
        alert("Failed to save MetaMask address. Please try again.");
        console.error("Upload failed:", err);
      }
    };

    if (isConnected && account && !hasUploaded) {
      uploadMetaMaskAddressToBackend();
    }
  }, [isConnected, account, hasUploaded]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-lg text-gray-700">Checking MetaMask status...</div>
      </div>
    );
  }

  if (!isMetaMaskInstalled || !isConnected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">MetaMask Required</h2>
          {!isMetaMaskInstalled ? (
            <>
              <p className="mb-4">Please install MetaMask to use this app.</p>
              <a
                href="https://metamask.io/download/"
                className="bg-red-600 text-white py-2 px-4 rounded inline-block"
              >
                Install MetaMask
              </a>
            </>
          ) : (
            <>
              <p className="mb-4">Please connect your wallet to proceed.</p>
              <button
                onClick={connectWallet}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Connect Wallet
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return children;
}
