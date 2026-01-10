"use client";

import { useWallet } from "@/components/custom-wallet-provider";
import { useState } from "react";

export function WalletConnect() {
  const { account, connected, disconnect, connect, connecting, wallets } = useWallet();
  const [showWallets, setShowWallets] = useState(false);

  if (connected && account) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-white text-sm px-3 py-2 bg-gray-800 rounded">
          {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWallets(!showWallets)}
        disabled={connecting}
        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold transition-colors disabled:opacity-50"
      >
        {connecting ? "Connecting..." : "🔗 Connect Wallet"}
      </button>
      
      {showWallets && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowWallets(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-gray-900 border-2 border-orange-600 rounded-lg shadow-xl z-50 min-w-[200px]">
            <div className="p-2">
              <div className="text-white text-sm font-bold mb-2 px-2">Select Wallet</div>
              {wallets.filter(wallet => !wallet.name.includes("AptosConnect")).map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => {
                    connect(wallet.name);
                    setShowWallets(false);
                  }}
                  className="w-full px-3 py-2 text-left text-white hover:bg-orange-600 rounded transition-colors flex items-center gap-2"
                >
                  {wallet.icon && (
                    <img src={wallet.icon} alt={wallet.name} className="w-5 h-5" />
                  )}
                  <span>{wallet.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}