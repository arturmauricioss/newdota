import React from "react";
import { View } from "react-native";
import PlayerSelect from "./PlayerSelect";
import { PlayerProfile } from "../types";

export const PlayersSection = ({
  players,
  setPlayers,
  availablePlayers,
  styles,
  calculateRP,
}: {
  players: PlayerProfile[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerProfile[]>>;
  availablePlayers: { id: number; name: string }[];
  styles: any;
  calculateRP: (games: number, win: number) => number;
}) => (
  <View style={styles.playersRow}>
    {players.map((player, i) => (
      <View key={i} style={styles.playerSelectWrapper}>
        <PlayerSelect
          value={player.preferences?.[0] ? Number(player.preferences[0]) : null}
          onChange={async (playerId) => {
            let stats: Record<number, number> = {};
            try {
              const res = await fetch(`/data/players/${playerId}.json`);
              const data = await res.json();
              data.forEach((entry: any) => {
                stats[entry.hero_id] = calculateRP(entry.games, entry.win);
              });
            } catch (err) {
              console.error("Erro ao carregar stats do jogador:", err);
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
