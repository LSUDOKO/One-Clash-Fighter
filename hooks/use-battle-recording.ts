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

export function useBattleRecording() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Record battle result on-chain
  const recordBattle = async (
    loserAddress: string,
    winnerPower: number,
    loserPower: number
  ) => {
    if (!account) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      // Transaction format for wallet standard
      const transaction = {
        data: {
          function: `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${MOVEMENT_CONFIG.MODULES.BATTLE_SYSTEM}::record_battle`,
          functionArguments: [
            loserAddress,
            winnerPower.toString(), // u64
            loserPower.toString(),  // u64
          ],
        },
      };

      console.log("Recording battle:", JSON.stringify(transaction, null, 2));

      const response = await signAndSubmitTransaction(transaction);

      console.log("Battle recorded:", response.hash);
      return response.hash;
    } catch (error: any) {
      console.error("Error recording battle:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to wait for indexer
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Get leaderboard from blockchain events
  const getLeaderboard = async () => {
    try {
      console.log("Fetching leaderboard events (Direct REST) from:", MOVEMENT_CONFIG.PACKAGE_ADDRESS);

      // Use direct fetch to bypass SDK indexer requirement and potential CORS issues
      const response = await fetch(
        `${MOVEMENT_CONFIG.RPC_URL}/accounts/${MOVEMENT_CONFIG.PACKAGE_ADDRESS}/events/4`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const events = await response.json();
      console.log("Leaderboard events found:", events.length);

      // Process events to create leaderboard
      const playerStats = new Map<string, {
        address: string;
        wins: number;
        totalPower: number;
        lastBattle: number;
      }>();

      events.forEach((event: any) => {
        const { winner, winner_power, battle_time } = event.data;

        if (!playerStats.has(winner)) {
          playerStats.set(winner, {
            address: winner,
            wins: 0,
            totalPower: 0,
            lastBattle: 0,
          });
        }

        const stats = playerStats.get(winner)!;
        stats.wins += 1;
        stats.totalPower += Number(winner_power);
        stats.lastBattle = Math.max(stats.lastBattle, Number(battle_time));
      });

      const result = Array.from(playerStats.values())
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);

      console.log("Processed leaderboard:", result);
      return result;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  };

  // Get player's battle history
  const getPlayerBattles = async (playerAddress?: string) => {
    const address = playerAddress || account?.address;
    if (!address) return [];

    try {
      console.log("Fetching player battles (Direct REST) for:", address);

      // Small delay to allow REST API to catch up
      await delay(1000);

      const response = await fetch(
        `${MOVEMENT_CONFIG.RPC_URL}/accounts/${MOVEMENT_CONFIG.PACKAGE_ADDRESS}/events/4`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const events = await response.json();
      console.log("Total battle events found:", events.length);

      // Filter events for this player and map to a consistent format
      const history = events
        .filter((event: any) => event.data.winner === address)
        .map((event: any) => ({
          won: true,
          damage: event.data.winner_power,
          prize: 0,
          timestamp: Number(event.data.battle_time) * 1000,
          opponent: event.data.loser,
        }))
        .reverse();

      console.log("Player battle history:", history);
      return history;
    } catch (error) {
      console.error("Error fetching player battles:", error);
      return [];
    }
  };

  // Get total battles count
  const getTotalBattles = async () => {
    try {
      const response = await fetch(
        `${MOVEMENT_CONFIG.RPC_URL}/accounts/${MOVEMENT_CONFIG.PACKAGE_ADDRESS}/events/4`
      );
      if (!response.ok) return 0;
      const events = await response.json();
      return events.length;
    } catch (error) {
      console.error("Error fetching total battles:", error);
      return 0;
    }
  };

  return {
    recordBattle,
    getLeaderboard,
    getPlayerBattles,
    getTotalBattles,
    isLoading,
  };
}