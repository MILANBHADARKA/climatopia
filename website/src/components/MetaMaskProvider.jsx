"use client";

import { createContext, useContext, useEffect, useState } from "react";

const MetaMaskContext = createContext(null);

export const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // 👈 added

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === "undefined") return;

      const { ethereum } = window;
      if (!ethereum) {
        setIsMetaMaskInstalled(false);
        setIsLoading(false); // done loading
        return;
      }

      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Failed to get accounts", err);
      } finally {
        setIsLoading(false); // ✅ done loading
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <MetaMaskContext.Provider
      value={{
        account,
        isConnected,
        isMetaMaskInstalled,
        isLoading,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => useContext(MetaMaskContext);
