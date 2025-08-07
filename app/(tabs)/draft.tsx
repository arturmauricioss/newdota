import React, { useMemo, useState } from "react";
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
import synergyMatrix from "../../public/data/synergyMatrix.json";
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
};

type PlayerProfile = {
  preferences?: string[];
};

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


const availablePlayers: string[] = ["Any", ...Object.values(playerNames)];
const getSortedHeroImages = (
  allyTeam: (string | null)[],
  enemyTeam: (string | null)[],
  bans: (string | null)[]
): RankedHero[] => {
  const maxScore = Math.max(...heroMeta.map((h) => h.pro_pick ?? 0 + h.pro_ban ?? 0));
  const minScore = Math.min(...heroMeta.map((h) => h.pro_pick ?? 0 + h.pro_ban ?? 0));
  const rawHeroes = (heroMeta as HeroMeta[]).map((hero) => {
    const heroId = hero.id;
    const synergyWithAlly = getSynergyScore(heroId, allyTeam, "with");
    const synergyVsEnemy = getSynergyScore(heroId, enemyTeam, "vs");
    const synergyVsBans = -getSynergyScore(heroId, bans, "vs");
    const synergyFromBans = synergyVsBans;
    const totalSynergy = synergyWithAlly + synergyVsEnemy + synergyFromBans;
    const rawMetaScore = (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0);
    const normalizedMeta = parseFloat(normalizeMetaScore(rawMetaScore, minScore, maxScore));
    const finalScore = normalizedMeta + totalSynergy;

    return {
      name: hero.name,
      img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
      winRate: hero.pub_pick > 0 ? hero.pub_win / hero.pub_pick : 0,
      metaScore: rawMetaScore,
      synergyWithAlly,
      synergyVsEnemy,
      synergyFromBans,
      totalSynergy,
      finalScore,
      displayScore: normalizeMetaScore(rawMetaScore, minScore, maxScore),
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
const normalized = ((((((score - min) * 100) / (max - min)) )) / 10 ) - 10;
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
const baseRankedHeroes = useMemo(() => {
  return getSortedHeroImages(allyTeam, enemyTeam, bans);
}, [allyTeam, enemyTeam, bans]);


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

  {/* ScrollView horizontal para as colunas extras */}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.tableContainer}
  >
    <View>
      {/* Cabeçalho */}
<View style={styles.tableHeader}>
  <View style={styles.tableHeaderCell} /> {/* célula vazia para imagem */}

  <Text
    style={styles.tableHeaderCell}
    onPress={() => {
      setSortKey("name");
      setSortAsc((prev) => sortKey === "name" ? !prev : false);
    }}
  >
    Nome {sortKey === "name" ? (sortAsc ? "↑" : "↓") : ""}
  </Text>

  <Text
    style={styles.tableHeaderCell}
    onPress={() => {
      setSortKey("metaScore");
      setSortAsc((prev) => sortKey === "metaScore" ? !prev : false);
    }}
  >
    Meta {sortKey === "metaScore" ? (sortAsc ? "↑" : "↓") : ""}
  </Text>

  <Text
    style={styles.tableHeaderCell}
    onPress={() => {
      setSortKey("synergyWithAlly");
      setSortAsc((prev) => sortKey === "synergyWithAlly" ? !prev : false);
    }}
  >
    Ally {sortKey === "synergyWithAlly" ? (sortAsc ? "↑" : "↓") : ""}
  </Text>

  <Text
    style={styles.tableHeaderCell}
    onPress={() => {
      setSortKey("synergyVsEnemy");
      setSortAsc((prev) => sortKey === "synergyVsEnemy" ? !prev : false);
    }}
  >
    Enemy {sortKey === "synergyVsEnemy" ? (sortAsc ? "↑" : "↓") : ""}
  </Text>

  <Text
    style={styles.tableHeaderCell}
    onPress={() => {
      setSortKey("synergyFromBans");
      setSortAsc((prev) => sortKey === "synergyFromBans" ? !prev : false);
    }}
  >
    Ban {sortKey === "synergyFromBans" ? (sortAsc ? "↑" : "↓") : ""}
  </Text>

  <Text
    style={styles.tableHeaderCell}
    onPress={() => {
      setSortKey("totalSynergy");
      setSortAsc((prev) => sortKey === "totalSynergy" ? !prev : false);
    }}
  >
    Sin {sortKey === "totalSynergy" ? (sortAsc ? "↑" : "↓") : ""}
  </Text>

  <Text
    style={styles.tableHeaderCell}
    onPress={() => {
      setSortKey("finalScore");
      setSortAsc((prev) => sortKey === "finalScore" ? !prev : false);
    }}
  >
    Final {sortKey === "finalScore" ? (sortAsc ? "↑" : "↓") : ""}
  </Text>
</View>


      {/* Linhas */}
      {baseRankedHeroes
        .filter((h) => ![...allyTeam, ...enemyTeam, ...bans].includes(h.img))
        .map((hero: RankedHero) => (
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
            <Text style={styles.tableCell}>
              {getHeroDisplayName(hero.name)}
            </Text>
            <Text style={styles.tableCell}>
              {hero.displayScore}
            </Text>
            <Text style={styles.tableCell}>
              {hero.synergyWithAlly.toFixed(1)}
            </Text>
            <Text style={styles.tableCell}>
              {hero.synergyVsEnemy.toFixed(1)}
            </Text>
            <Text style={styles.tableCell}>
              {hero.synergyFromBans.toFixed(1)}
            </Text>
            <Text style={styles.tableCell}>
              {hero.totalSynergy.toFixed(1)}
            </Text>
            <Text style={styles.tableCell}>
              {hero.finalScore.toFixed(1)}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  </ScrollView>
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
    backgroundColor: "#222",
    paddingVertical: 6,
    marginBottom: 8,
  },
  tableHeaderCell: {
    width: 80,
    fontWeight: "bold",
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    // NÃO usar flexWrap aqui
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
  },
   tableContainer: {
    minWidth: 8 * 80,
  },
});
