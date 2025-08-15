import React from "react";
import { View } from "react-native";
import { PlayerProfile } from "../types";
import PlayerSelect from "./PlayerSelect";

export const PlayersSection = ({
  players,
  setPlayers,
  availablePlayers,
  styles,
  calculateRP,
  playersData,
}: {
  players: PlayerProfile[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerProfile[]>>;
  availablePlayers: { id: number; name: string }[];
  styles: any;
  calculateRP: (games: number, win: number) => number;
  playersData: {
    [playerId: string]: {
      hero_id: number;
      games: number;
      win: number;
    }[];
  };
}) => (
  <View style={styles.playersRow}>
    {players.map((player, i) => (
      <View key={i} style={styles.playerSelectWrapper}>
        <PlayerSelect
          value={player.preferences?.[0] ? Number(player.preferences[0]) : null}
          onChange={(playerId) => {
            const rawStats = playersData[playerId];
            const stats: Record<number, number> = {};

            if (rawStats) {
              rawStats.forEach((entry) => {
                stats[entry.hero_id] = calculateRP(entry.games, entry.win);
              });
            }

            setPlayers((prev) =>
              prev.map((p, idx) =>
                idx === i ? { ...p, preferences: [String(playerId)], stats } : p
              )
            );
          }}
          options={availablePlayers}
        />
      </View>
    ))}
  </View>
);
