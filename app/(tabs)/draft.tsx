import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import BanSlot from "../../components/BanSlot";
import HeroSlot from "../../components/HeroSlot";
import PlayerSelect from "../../components/PlayerSelect";
import SuggestedHeroes from "../../components/SugestedHeroes";
import { getHeroSuggestions } from "../../public/data/utils/draftLogic";
import { playerNames } from "../../public/data/utils/playerNames";

type SlotSelection = {
  type: "ally" | "enemy" | "ban";
  index: number;
  playerId?: number;
};

type PlayerProfile = {
  preferences?: string[];
};
const availablePlayers: string[] = ["Any", ...Object.values(playerNames)];


// Estado inicial para 5 jogadores sem preferências
const defaultPlayers: PlayerProfile[] = Array(5).fill({ preferences: [] });
const defaultNullArray = (length: number) => Array(length).fill(null);

export default function DraftPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>(defaultPlayers);
  const [allyTeam, setAllyTeam] = useState<(string | null)[]>(defaultNullArray(5));
  const [enemyTeam, setEnemyTeam] = useState<(string | null)[]>(defaultNullArray(5));
  const [bans, setBans] = useState<(string | null)[]>(defaultNullArray(10));
  const [selectedSlot, setSelectedSlot] = useState<SlotSelection | null>(null);

  const suggestions = getHeroSuggestions({
    allyTeam,
    enemyTeam,
    bans,
    slotIndex: selectedSlot,
    players,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Draft Personalizado</Text>

        {/* 🎮 Players */}
        <View style={styles.playersRow}>
          {players.map((player, i) => (
            <PlayerSelect
              key={i}
            value={player.preferences?.[0] ?? "Any"}
            onChange={(newVal) =>
                setPlayers((prev) =>
                prev.map((p, idx) =>
                    idx === i ? { ...p, preferences: [newVal] } : p
                )
                )
            }
            options={availablePlayers}
            />
          ))}
        </View>

        {/* 🛡️ Ally & Enemy Teams */}
        <View style={styles.teamSection}>
          <Text style={styles.subTitle}>Time Aliado</Text>
          <View style={styles.teamRow}>
            {allyTeam.map((hero, i) => (
              <HeroSlot
                key={`ally-${i}`}
                hero={hero}
                onSelect={() => setSelectedSlot({ type: "ally", index: i, playerId: i })}
              />
            ))}
          </View>

          <Text style={styles.subTitle}>Time Inimigo</Text>
          <View style={styles.teamRow}>
            {enemyTeam.map((hero, i) => (
              <HeroSlot
                key={`enemy-${i}`}
                hero={hero}
                onSelect={() => setSelectedSlot({ type: "enemy", index: i })}
              />
            ))}
          </View>
        </View>

        {/* 🚫 Ban Slots */}
        <Text style={styles.subTitle}>Banimentos</Text>
        <View style={styles.banSection}>
          {bans.map((ban, i) => (
            <BanSlot
              key={`ban-${i}`}
              hero={ban}
              onSelect={() => setSelectedSlot({ type: "ban", index: i })}
            />
          ))}
        </View>

        {/* 🔮 Sugestões */}
        <SuggestedHeroes heroes={suggestions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  container: {
    padding: 16,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f5f5f5",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    color: "#f0f0f0",
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  playersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  teamSection: {
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  banSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
});
