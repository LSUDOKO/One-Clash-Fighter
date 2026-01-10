"use client";

import { useWallet } from "@/components/custom-wallet-provider";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { MOVEMENT_CONFIG, getModuleAddress } from "@/lib/movement-config";
import { useState } from "react";

const aptosConfig = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: MOVEMENT_CONFIG.RPC_URL,
});
const aptos = new Aptos(aptosConfig);

export function useFighterNFT() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Mint a new fighter NFT
  const mintFighter = async (
    name: string,
    fighterType: number,
    power: number,
    speed: number,
    defense: number
  ) => {
    if (!account) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      // Transaction format for wallet standard
      const transaction = {
        data: {
          function: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.FIGHTER_NFT}::create_fighter`,
          functionArguments: [
            name,
            // fighterType is not in the contract
            power.toString(),    // u64 should be passed as string
            speed.toString(),    // u64 should be passed as string
            defense.toString(),  // u64 should be passed as string
          ],
        },
      };

      console.log("Minting fighter with transaction:", JSON.stringify(transaction, null, 2));

      const response = await signAndSubmitTransaction(transaction);

      // Wait for transaction confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });

      console.log("Fighter minted:", response.hash);
      return response.hash;
    } catch (error) {
      console.error("Error minting fighter:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if account has a fighter
  const hasFighter = async () => {
    if (!account) return false;

    try {
      const result = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.FIGHTER_NFT}::has_fighter`,
          typeArguments: [],
          functionArguments: [account.address],
        },
      });

      return Boolean(result[0]);
    } catch (error) {
      console.error("Error checking fighter:", error);
      return false;
    }
  };

  // Get fighter details for current account
  const getMyFighter = async () => {
    if (!account) return null;

    try {
      const resource = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.FIGHTER_NFT}::Fighter`,
      });

      return resource;
    } catch (error: any) {
      // Don't log 404 as an error, it just means no fighter minted
      if (error?.status !== 404) {
        console.error("Error fetching fighter:", error);
      }
      return null;
    }
  };

  // Legacy compatibility - returns array with single fighter
  const getMyFighters = async () => {
    const fighter = await getMyFighter();
    return fighter ? [fighter] : [];
  };

  // Get fighter details by address
  const getFighterDetails = async (fighterAddress: string) => {
    try {
      const resource = await aptos.getAccountResource({
        accountAddress: fighterAddress,
        resourceType: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.FIGHTER_NFT}::Fighter`,
      });

      return resource;
    } catch (error: any) {
      if (error?.status !== 404) {
        console.error("Error fetching fighter details:", error);
      }
      return null;
    }
  };

  // Get fighter stats using view function
  const getFighterStats = async (fighterAddress: string) => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.FIGHTER_NFT}::get_fighter_stats`,
          typeArguments: [],
          functionArguments: [fighterAddress],
        },
      });

      return result;
    } catch (error) {
      console.error("Error fetching fighter stats:", error);
      return null;
    }
  };

  return {
    mintFighter,
    hasFighter,
    getMyFighter,
    getMyFighters,
    getFighterDetails,
    getFighterStats,
    isLoading,
  };
}