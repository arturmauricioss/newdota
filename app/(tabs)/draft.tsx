import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
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
import synergyMatrix from "../../public/data/synergyMatrix.json";
import { calculateRP } from "../../public/data/utils/calculateRP";
import { getHeroSuggestions } from "../../public/data/utils/draftLogic";
import { playerNames } from "../../public/data/utils/playerNames";
type SlotSelection = {
  type: "ally" | "enemy" | "ban";
  index: number;
  playerId?: number;
};
type HeroMeta = {
  id: number;
  name: string;
  img: string;
  pub_pick: number;
  pub_win: number;
  pro_pick?: number;
  pro_ban?: number;
};
type SynergyEntry = {
  heroId2: number;
  synergy: number;
};
type PlayerStatEntry = {
  hero_id: number;
  games: number;
  win: number;
};
type SynergyMatrixEntry = {
  heroId: number;
  vs: SynergyEntry[];
  with: SynergyEntry[];
};

type SynergyMatrix = {
  [heroId: string]: SynergyMatrixEntry;
};

type RankedHero = {
  name: string;
  img: string;
  winRate: number;
  metaScore: number;
  synergyWithAlly: number;
  synergyVsEnemy: number;
  synergyFromBans: number;
  totalSynergy: number;
  finalScore: number;
  displayScore: string;
  playerRP: number;
};

type PlayerProfile = {
  name: string;
  preferences: string[];
  stats?: Record<number, number>; // ← adiciona isso
};
const availablePlayers: string[] = ["Any", ...Object.values(playerNames) as string[]];

const getSynergyScore = (
  heroId: number,
  otherHeroes: (string | null)[],
  type: "with" | "vs"
): number => {
  // pega matriz de sinergia do herói
  const heroData = (synergyMatrix as SynergyMatrix)[String(heroId)];
  if (!heroData) return 0;

  // soma sinergias com cada outro herói
  return otherHeroes.reduce((sum, otherImg) => {
    if (!otherImg) return sum;
    const otherId = extractHeroIdFromImg(otherImg);
    const synergyList = heroData[type];
    const match = synergyList.find(
      (s: SynergyEntry) => s.heroId2 === otherId
    );
    return sum + (match?.synergy ?? 0);
  }, 0);
};
const extractHeroIdFromImg = (imgUrl: string): number => {
  // remove domínio pra casar com hero.img do JSON
  const relPath = imgUrl.replace(
    "https://cdn.cloudflare.steamstatic.com",
    ""
  );
  // busca entrada pelo campo img
  const heroEntry = (heroMeta as HeroMeta[]).find(
    (h) => h.img === relPath
  );
  return heroEntry?.id ?? 0;
};
export const calculateRPOnly = (games: number, win: number): number => {
  const winRate = games > 0 ? win / games : 0.5;
  const RP = (winRate - 1 / (games + 1) + 1) / 2;
  return RP * 10; // ajuste o peso conforme necessário
};


  const getSortedHeroImages = (
  allyTeam: (string | null)[],
  enemyTeam: (string | null)[],
  bans: (string | null)[],
  players: PlayerProfile[],
  selectedSlot: SlotSelection | null
): RankedHero[] => {
  const maxScore = Math.max(...heroMeta.map((h) => (h.pro_pick ?? 0) + (h.pro_ban ?? 0)));
  const minScore = Math.min(...heroMeta.map((h) => (h.pro_pick ?? 0) + (h.pro_ban ?? 0)));

  const rawHeroes = (heroMeta as HeroMeta[]).map((hero) => {
    const heroId = hero.id;
    const synergyWithAlly = getSynergyScore(heroId, allyTeam, "with");
    const synergyVsEnemy = getSynergyScore(heroId, enemyTeam, "vs");
    const synergyVsBans = -getSynergyScore(heroId, bans, "vs");
    const synergyFromBans = synergyVsBans;
    const totalSynergy = synergyWithAlly + synergyVsEnemy + synergyFromBans;
    const rawMetaScore = (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0);
    const adjustedMetaScore = rawMetaScore / 100 - 10;
    const normalizedMeta = parseFloat(normalizeMetaScore(rawMetaScore, minScore, maxScore));

let playerRP = 0;
if (
  selectedSlot?.type === "ally" &&
  selectedSlot.playerId !== undefined &&
  players[selectedSlot.playerId]?.preferences?.[0] !== "Any"
) {
  const rawRP = players[selectedSlot.playerId]?.stats?.[heroId];
  playerRP = typeof rawRP === "number" ? rawRP : 0;
}


    const finalScore = normalizedMeta + totalSynergy + playerRP;

    return {
      name: hero.name,
      img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
      winRate: hero.pub_pick > 0 ? hero.pub_win / hero.pub_pick : 0,
  metaScore: adjustedMetaScore, // ← aqui
      synergyWithAlly,
      synergyVsEnemy,
      synergyFromBans,
      totalSynergy,
  finalScore: adjustedMetaScore/2 + totalSynergy + playerRP, // ← aqui
  displayScore: adjustedMetaScore.toFixed(1), // ← aqui
      playerRP,
    };
  });

  return rawHeroes.sort((a, b) => b.finalScore - a.finalScore);
};

const normalizeMetaScore = (
  score: number,
  min: number,
  max: number
): string => {
  if (max === min) return "50.0%";
const normalized = (((((((score - min) * 100) / (max - min)) )) / 10 )-5) ;
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
const [baseRankedHeroes, setBaseRankedHeroes] = useState<RankedHero[]>([]);
const availablePlayers = Object.entries(playerNames).map(([id, name]) => ({
  id: Number(id),
  name,
}));
useEffect(() => {
  const ranked = getSortedHeroImages(allyTeam, enemyTeam, bans, players, selectedSlot);
  setBaseRankedHeroes(ranked);
}, [allyTeam, enemyTeam, bans, players, selectedSlot]);



  const suggestions = getHeroSuggestions({
    allyTeam,
    enemyTeam,
    bans,
    slotIndex: selectedSlot,
    players,
  });


const [sortKey, setSortKey] = useState<keyof RankedHero>("finalScore");
const [sortAsc, setSortAsc] = useState(false);
const sortedHeroes = useMemo<RankedHero[]>(() => {
  const sorted = [...baseRankedHeroes].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortAsc
      ? Number(valA) - Number(valB)
      : Number(valB) - Number(valA);
  });
  return sorted;
}, [baseRankedHeroes, sortKey, sortAsc]);
  return (
       <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Draft Personalizado</Text>

        {/* 🎮 Players */}
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
                    data.forEach((entry: PlayerStatEntry) => {
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

        {/* 🛡️ Ally & Enemy Teams */}
        <View style={styles.teamSection}>
          <Text style={styles.subTitle}>Time Aliado</Text>
          <View style={styles.teamRow}>
            {allyTeam.map((hero, i) => (
              <View key={`ally-${i}`} style={styles.slotWrapper}>
                <HeroSlot
                  hero={hero}
                  onSelect={() => {
                    if (allyTeam[i]) {
                      setAllyTeam((prev) =>
                        prev.map((h, idx) => (idx === i ? null : h))
                      );
                    } else {
                      setSelectedSlot({ type: "ally", index: i, playerId: i });
                    }
                  }}
                />
              </View>
            ))}
          </View>

          <Text style={styles.subTitle}>Time Inimigo</Text>
          <View style={styles.teamRow}>
            {enemyTeam.map((hero, i) => (
              <View key={`enemy-${i}`} style={styles.slotWrapper}>
                <HeroSlot
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
              </View>
            ))}
          </View>
        </View>

        {/* 🚫 Ban Slots */}
        <Text style={styles.subTitle}>Banimentos</Text>
        <View style={styles.banSection}>
          {bans.map((ban, i) => (
            <View key={`ban-${i}`} style={styles.slotWrapper}>
              <BanSlot
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
            </View>
          ))}
        </View>

        {/* 🔮 Sugestões */}
        <View style={styles.tableSection}>
          <Text style={styles.subTitle}>Sugestões de Heróis</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tableContainer}
          >
            <View>
              {/* Cabeçalho */}
              <View style={styles.tableHeader}>
                {[
                  { key: "name", label: "Nome" },
                  { key: "metaScore", label: "Meta" },
                  { key: "synergyWithAlly", label: "Ally" },
                  { key: "synergyVsEnemy", label: "Enemy" },
                  { key: "synergyFromBans", label: "Ban" },
                  { key: "totalSynergy", label: "Sin" },
                  { key: "playerRP", label: "RP" },
                  { key: "finalScore", label: "Final" },
                ].map(({ key, label }) => (
                  <Text
                    key={key}
                    style={styles.tableHeaderCell}
                    onPress={() => {
                      setSortKey(key as keyof RankedHero);

                      setSortAsc((prev) => sortKey === key ? !prev : false);
                    }}
                  >
                    {label} {sortKey === key ? (sortAsc ? "↑" : "↓") : ""}
                  </Text>
                ))}
              </View>

              {/* Linhas */}
              {sortedHeroes
                .filter(
                  (h) =>
                    ![...allyTeam, ...enemyTeam, ...bans].includes(h.img)
                )
                .map((hero) => (
                  <TouchableOpacity
                    key={hero.name}
                    style={styles.tableRow}
                    onPress={() => {
                      if (!selectedSlot) return;
                      const img = hero.img;
                      if (selectedSlot.type === "ally")
                        setAllyTeam((a) =>
                          a.map((h, i) => (i === selectedSlot.index ? img : h))
                        );
                      if (selectedSlot.type === "enemy")
                        setEnemyTeam((e) =>
                          e.map((h, i) => (i === selectedSlot.index ? img : h))
                        );
                      if (selectedSlot.type === "ban")
                        setBans((b) =>
                          b.map((h, i) => (i === selectedSlot.index ? img : h))
                        );
                      setSelectedSlot(null);
                    }}
                  >
                    <Image source={{ uri: hero.img }} style={styles.tableImage} />
                    <Text style={styles.tableCell}>{getHeroDisplayName(hero.name)}</Text>
                    <Text style={styles.tableCell}>{hero.displayScore}</Text>
                    <Text style={styles.tableCell}>{hero.synergyWithAlly.toFixed(1)}</Text>
                    <Text style={styles.tableCell}>{hero.synergyVsEnemy.toFixed(1)}</Text>
                    <Text style={styles.tableCell}>{hero.synergyFromBans.toFixed(1)}</Text>
                    <Text style={styles.tableCell}>{hero.totalSynergy.toFixed(1)}</Text>
                    <Text style={styles.tableCell}>{hero.playerRP.toFixed(1)}</Text>
                    <Text style={styles.tableCell}>{hero.finalScore.toFixed(1)}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Correto
const DraftScreen = () => { /* ... */ };

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
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

  // 🎮 Players
  playersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  playerSelectWrapper: {
    margin: 4,
    minWidth: 140,
  },

  // 🛡️ Ally & Enemy Teams
  teamSection: {
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  teamRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  slotWrapper: {
    margin: 4,
  },

  // 🚫 Ban Slots
  banSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },

  // 🔮 Sugestões
  tableSection: {
    marginVertical: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
  tableContainer: {
    minWidth: screenWidth > 800 ? screenWidth : 960,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#222",
    paddingVertical: 6,
    marginBottom: 8,
  },
  tableHeaderCell: {
    width: 120,
    fontWeight: "bold",
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    backgroundColor: "#1e1e1e",
    paddingVertical: 6,
    borderRadius: 4,
  },
  tableImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  tableCell: {
    width: 120,
    fontSize: 13,
    color: "#f0f0f0",
    textAlign: "left",
    paddingHorizontal: 4,
  },
});