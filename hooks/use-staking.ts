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

export function useStaking() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Stake MOVE tokens for tournament entry
  const stakeForTournament = async () => {
    if (!account) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.STAKING_POOL}::stake_entry`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      console.log("Staked for tournament:", response.hash);
      return response.hash;
    } catch (error) {
      console.error("Error staking:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get tournament pool stats using view functions
  const getPoolStats = async () => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.STAKING_POOL}::get_pool_info`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      console.log("Pool stats result:", result);

      // result is [total_staked, prize_pool, entry_fee, active, participant_count]
      return {
        totalStaked: Number(result[0]),
        prizePool: Number(result[1]),
        entryFee: Number(result[2]),
        active: Boolean(result[3]),
        participantCount: Number(result[4]),
      };
    } catch (error) {
      console.error("Error fetching pool stats:", error);
      return null;
    }
  };

  // Check if player has staked
  const hasPlayerStaked = async (playerAddress?: string) => {
    const address = playerAddress || account?.address;
    if (!address) return false;

    try {
      const result = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.STAKING_POOL}::has_staked`,
          typeArguments: [],
          functionArguments: [address],
        },
      });

      return Boolean(result[0]);
    } catch (error) {
      console.error("Error checking stake:", error);
      return false;
    }
  };

  return {
    stakeForTournament,
    getPoolStats,
    hasPlayerStaked,
    isLoading,
  };
}