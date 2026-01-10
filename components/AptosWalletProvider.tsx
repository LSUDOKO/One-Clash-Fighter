"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getAptosWallets, AptosWallet } from "@aptos-labs/wallet-standard";
import { MOVEMENT_CONFIG } from "@/lib/movement-config";

// Movement Network configuration
const MOVEMENT_NETWORK_INFO = {
    chainId: 250, // Movement Testnet (Bardock)
    name: "Movement Testnet",
    url: MOVEMENT_CONFIG.RPC_URL,
};

interface WalletContextType {
    account: { address: string } | null;
    connected: boolean;
    connecting: boolean;
    wallets: AptosWallet[];
    wallet: AptosWallet | null;
    connect: (walletName: string) => Promise<void>;
    disconnect: () => Promise<void>;
    signAndSubmitTransaction: (transaction: any) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}

export function AptosWalletProvider({ children }: { children: ReactNode }) {
    const [wallets, setWallets] = useState<AptosWallet[]>([]);
    const [wallet, setWallet] = useState<AptosWallet | null>(null);
    const [account, setAccount] = useState<{ address: string } | null>(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);

    // Detect available wallets
    useEffect(() => {
        if (typeof window === "undefined") return;

        const detectWallets = () => {
            try {
                const { aptosWallets, on } = getAptosWallets();

                // Filter to only include wallets that support Movement-compatible features
                const compatibleWallets = aptosWallets.filter((w) => {
                    const name = w.name.toLowerCase();
                    // Exclude wallets that don't work well with custom networks
                    return !name.includes("petra") &&
                        !name.includes("google") &&
                        !name.includes("apple");
                });

                setWallets(compatibleWallets);

                // Listen for new wallets
                const unsubscribeRegister = on("register", () => {
                    const { aptosWallets: updated } = getAptosWallets();
                    const filtered = updated.filter((w) => {
                        const name = w.name.toLowerCase();
                        return !name.includes("petra") &&
                            !name.includes("google") &&
                            !name.includes("apple");
                    });
                    setWallets(filtered);
                });

                return () => {
                    unsubscribeRegister();
                };
            } catch (error) {
                console.error("Error detecting wallets:", error);
            }
        };

        // Delay detection to let browser extensions initialize
        const timeoutId = setTimeout(detectWallets, 500);
        return () => clearTimeout(timeoutId);
    }, []);

    const connect = useCallback(async (walletName: string) => {
        if (typeof window === "undefined") return;

        setConnecting(true);
        try {
            const { aptosWallets } = getAptosWallets();
            const selectedWallet = aptosWallets.find((w) => w.name === walletName);

            if (!selectedWallet) {
                throw new Error(`Wallet ${walletName} not found`);
            }

            // Check if wallet supports aptos:connect
            const connectFeature = selectedWallet.features["aptos:connect"];
            if (!connectFeature) {
                throw new Error(`Wallet ${walletName} does not support aptos:connect`);
            }

            // Connect with Movement network info
            console.log("Connecting to wallet with Movement network:", MOVEMENT_NETWORK_INFO);
            const result = await connectFeature.connect(false, MOVEMENT_NETWORK_INFO as any);

            if (result.status === "Approved") {
                const accountInfo = result.args;
                setAccount({ address: accountInfo.address.toString() });
                setWallet(selectedWallet);
                setConnected(true);
                console.log("Connected to wallet:", walletName, "Address:", accountInfo.address.toString());
            } else {
                throw new Error("Connection rejected by user");
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            throw error;
        } finally {
            setConnecting(false);
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (wallet) {
            try {
                const disconnectFeature = wallet.features["aptos:disconnect"];
                if (disconnectFeature) {
                    await disconnectFeature.disconnect();
                }
            } catch (error) {
                console.error("Error disconnecting:", error);
            }
        }
        setWallet(null);
        setAccount(null);
        setConnected(false);
    }, [wallet]);

    const signAndSubmitTransaction = useCallback(async (transaction: any) => {
        if (!wallet || !account) {
            throw new Error("Wallet not connected");
        }

        const signAndSubmitFeature = wallet.features["aptos:signAndSubmitTransaction"];
        if (!signAndSubmitFeature) {
            throw new Error("Wallet does not support signAndSubmitTransaction");
        }

        try {
            // Extract the transaction data
            const txData = transaction.data || transaction;

            // Build the payload in the format expected by wallet standard
            const payload = {
                function: txData.function,
                typeArguments: txData.typeArguments || [],
                functionArguments: txData.functionArguments || txData.arguments || [],
            };

            console.log("Submitting transaction via wallet standard:", payload);

            const result = await signAndSubmitFeature.signAndSubmitTransaction({
                payload,
            } as any);

            console.log("Transaction result:", result);

            // Handle both approval and rejection cases
            if (result.status === "Approved") {
                return {
                    hash: (result as any).args?.hash || (result as any).hash,
                    ...result,
                };
            } else {
                throw new Error("Transaction rejected by user");
            }
        } catch (error) {
            console.error("Transaction failed:", error);
            throw error;
        }
    }, [wallet, account]);

    return (
        <WalletContext.Provider
            value={{
                account,
                connected,
                connecting,
                wallets,
                wallet,
                connect,
                disconnect,
                signAndSubmitTransaction,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

// Also export CustomWalletProvider for backward compatibility
export const CustomWalletProvider = AptosWalletProvider;
