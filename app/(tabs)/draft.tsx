import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BanSlot from "../../components/BanSlot";
import HeroSlot from "../../components/HeroSlot";
import PlayerSelect from "../../components/PlayerSelect";
import heroMeta from "../../public/data/meta.json"; // ← ajusta o path se necessário
import { getHeroSuggestions } from "../../public/data/utils/draftLogic";
import { playerNames } from "../../public/data/utils/playerNames";

type SlotSelection = {
  type: "ally" | "enemy" | "ban";
  index: number;
  playerId?: number;
};
type HeroMeta = {
  name: string;
  img: string;
  pub_pick: number;
  pub_win: number;
  pro_pick?: number;
  pro_ban?: number;
};

type PlayerProfile = {
  preferences?: string[];
};
const availablePlayers: string[] = ["Any", ...Object.values(playerNames)];
const getSortedHeroImages = (): {
  name: string;
  img: string;
  winRate: number;
  metaScore: number;
  displayScore: string;
}[] => {
  const rawHeroes = heroMeta.map((hero: HeroMeta) => ({
    name: hero.name,
    img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
    winRate: hero.pub_pick > 0 ? hero.pub_win / hero.pub_pick : 0,
    metaScore: (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0),
  }));

  const maxScore = Math.max(...rawHeroes.map((h) => h.metaScore));
  const minScore = Math.min(...rawHeroes.map((h) => h.metaScore));

  return rawHeroes
    .map((hero) => ({
      ...hero,
      displayScore: normalizeMetaScore(hero.metaScore, minScore, maxScore),
    }))
    .sort((a, b) => b.metaScore - a.metaScore);
};

const normalizeMetaScore = (
  score: number,
  min: number,
  max: number
): string => {
  if (max === min) return "50.0%";
const normalized = ((((score - min) * 100) / (max - min)) / 5) - 10;
  return `${normalized.toFixed(1)}`; // sempre exibe 1 casa decimal
};

const getHeroDisplayName = (rawName: string) => {
  return rawName.replace("npc_dota_hero_", "").replace(/_/g, " ");
};

// Estado inicial para 5 jogadores sem preferências
const defaultPlayers: PlayerProfile[] = Array(5).fill({ preferences: [] });
const defaultNullArray = (length: number) => Array(length).fill(null);

export default function DraftPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>(defaultPlayers);
  const [allyTeam, setAllyTeam] = useState<(string | null)[]>(
    defaultNullArray(5)
  );
  const [enemyTeam, setEnemyTeam] = useState<(string | null)[]>(
    defaultNullArray(5)
  );
  const [bans, setBans] = useState<(string | null)[]>(defaultNullArray(10));
  const [selectedSlot, setSelectedSlot] = useState<SlotSelection | null>(null);
  const [metaRankedHeroes] = useState(getSortedHeroImages());
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
                onSelect={() => {
                  if (allyTeam[i]) {
                    // Remove o herói do slot
                    setAllyTeam((prev) =>
                      prev.map((h, idx) => (idx === i ? null : h))
                    );
                  } else {
                    // Seleciona o slot para atribuir herói
                    setSelectedSlot({ type: "ally", index: i, playerId: i });
                  }
                }}
              />
            ))}
          </View>

          <Text style={styles.subTitle}>Time Inimigo</Text>
          <View style={styles.teamRow}>
            {enemyTeam.map((hero, i) => (
              <HeroSlot
                key={`enemy-${i}`}
                hero={hero}
                onSelect={() => {
                  if (enemyTeam[i]) {
                    setEnemyTeam((prev) =>
                      prev.map((h, idx) => (idx === i ? null : h))
                    );
                  } else {
                    setSelectedSlot({ type: "enemy", index: i });
                  }
                }}
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
              onSelect={() => {
                if (bans[i]) {
                  setBans((prev) =>
                    prev.map((h, idx) => (idx === i ? null : h))
                  );
                } else {
                  setSelectedSlot({ type: "ban", index: i });
                }
              }}
            />
          ))}
        </View>

        {/* 🔮 Sugestões */}
        <View style={styles.tableSection}>
          <Text style={styles.subTitle}>Sugestões de Heróis</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Imagem</Text>
            <Text style={styles.tableHeaderCell}>Nome</Text>
            <Text style={styles.tableHeaderCell}>Meta Score</Text>
          </View>

          {metaRankedHeroes
            .filter(
              (hero) => ![...allyTeam, ...enemyTeam, ...bans].includes(hero.img)
            )
            .map((hero) => (
              <TouchableOpacity
                key={hero.name}
                onPress={() => {
                  if (!selectedSlot) return;

                  const heroName = hero.name;

                  if (selectedSlot.type === "ally") {
                    setAllyTeam((prev) =>
                      prev.map((h, i) =>
                        i === selectedSlot.index ? hero.img : h
                      )
                    );
                  } else if (selectedSlot.type === "enemy") {
                    setEnemyTeam((prev) =>
                      prev.map((h, i) =>
                        i === selectedSlot.index ? hero.img : h
                      )
                    );
                  } else if (selectedSlot.type === "ban") {
                    setBans((prev) =>
                      prev.map((h, i) =>
                        i === selectedSlot.index ? hero.img : h
                      )
                    );
                  }

                  setSelectedSlot(null);
                }}
              >
                <View style={styles.tableRow}>
                  <Image source={{ uri: hero.img }} style={styles.tableImage} />
                  <Text style={styles.tableCell}>
                    {getHeroDisplayName(hero.name)}
                  </Text>
                  <Text style={styles.tableCell}>{hero.displayScore}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
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
  heroGridSection: {
    marginVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  heroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  heroImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    resizeMode: "cover",
  },
  tableSection: {
    marginVertical: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    color: "#cccccc",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#1e1e1e",
    padding: 6,
    borderRadius: 6,
  },
  tableImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
  tableCell: {
    flex: 1,
    color: "#f0f0f0",
    fontSize: 13,
  },
});
