import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text } from "react-native";
import { draftStyles as styles } from "../style/draftstyle";

import playersData from "../../assets/data/players/players.json";
import synergyMatrix from "../../assets/synergyMatrix.json";
import { loadHeroMeta } from "../../public/data/utils/loadHeroMeta";

import { BanSelector } from "../../components/BanSelector";
import { HeroSuggestions } from "../../components/HeroSuggestions";
import { PlayersSection } from "../../components/PlayersSection";
import { TeamSelector } from "../../components/TeamSelector";
import { calculateRP } from "../../public/data/utils/calculateRP";
import { getHeroSuggestions } from "../../public/data/utils/draftLogic";
import { normalizeMetaScore } from "../../public/data/utils/normalize";
import { playerNames } from "../../public/data/utils/playerNames";

import {
  HeroMeta,
  PlayerProfile,
  RankedHero,
  SlotSelection,
  SynergyEntry,
  SynergyMatrix,
} from "../../types";

const screenWidth = Dimensions.get("window").width;

const defaultPlayers: PlayerProfile[] = Array(5).fill({ preferences: [] });
const defaultNullArray = (length: number) => Array(length).fill(null);

const getSynergyScore = (
  heroId: number,
  otherHeroes: (string | null)[],
  type: "with" | "vs",
  heroMeta: HeroMeta[]
): number => {
  const heroData = (synergyMatrix as SynergyMatrix)[String(heroId)];
  if (!heroData) return 0;

  return otherHeroes.reduce((sum, otherImg) => {
    if (!otherImg) return sum;
    const otherId = extractHeroIdFromImg(otherImg, heroMeta);
    const synergyList = heroData[type];
    const match = synergyList.find((s: SynergyEntry) => s.heroId2 === otherId);
    return sum + (match?.synergy ?? 0);
  }, 0);
};

const extractHeroIdFromImg = (imgUrl: string, heroMeta: HeroMeta[]): number => {
  const relPath = imgUrl.replace("https://cdn.cloudflare.steamstatic.com", "");
  const heroEntry = heroMeta.find((h) => h.img === relPath);
  return heroEntry?.id ?? 0;
};

const getSortedHeroImages = (
  heroMeta: HeroMeta[],
  allyTeam: (string | null)[],
  enemyTeam: (string | null)[],
  bans: (string | null)[],
  players: PlayerProfile[],
  selectedSlot: SlotSelection | null
): RankedHero[] => {
  const maxScore = Math.max(
    ...heroMeta.map((h) => (h.pro_pick ?? 0) + (h.pro_ban ?? 0))
  );
  const minScore = Math.min(
    ...heroMeta.map((h) => (h.pro_pick ?? 0) + (h.pro_ban ?? 0))
  );

  const rawHeroes = heroMeta.map((hero) => {
    const heroId = hero.id;
    const synergyWithAlly = getSynergyScore(heroId, allyTeam, "with", heroMeta);
    const synergyVsEnemy = getSynergyScore(heroId, enemyTeam, "vs", heroMeta);
    const synergyVsBans = -getSynergyScore(heroId, bans, "vs", heroMeta);
    const totalSynergy = synergyWithAlly + synergyVsEnemy + synergyVsBans / 2;
    const rawMetaScore = (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0);
    const normalizedMeta = normalizeMetaScore(rawMetaScore, maxScore);

    const RP = calculateRP(hero.pub_pick, hero.pub_win);

    let playerRP = 0;
    if (selectedSlot?.type === "ally" && selectedSlot.playerId !== undefined) {
      const rawRP = players[selectedSlot.playerId]?.stats?.[heroId];
      if (typeof rawRP === "number") {
        playerRP = rawRP;
      }
    }

    const finalScore =
      (normalizedMeta * 2 + totalSynergy * 3 + playerRP * 5) / 10;

    return {
      name: hero.name,
      img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
      winRate: hero.pub_pick > 0 ? hero.pub_win / hero.pub_pick : 0,
      metaScore: normalizedMeta,
      synergyWithAlly,
      synergyVsEnemy,
      synergyFromBans: synergyVsBans,
      totalSynergy,
      finalScore,
      displayScore: normalizedMeta.toFixed(1),
      playerRP,
      localized_name: hero.localized_name,
    };
  });

  return rawHeroes.sort((a, b) => b.finalScore - a.finalScore);
};
export default function DraftPage() {
  const [heroMeta, setHeroMeta] = useState<HeroMeta[]>([]);
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
  const [sortKey, setSortKey] = useState<keyof RankedHero>("finalScore");
  const [sortAsc, setSortAsc] = useState(false);

  const availablePlayers = Object.entries(playerNames).map(([id, name]) => ({
    id: Number(id),
    name,
  }));

  const rawSuggestions = getHeroSuggestions({
    allyTeam,
    enemyTeam,
    bans,
    slotIndex: selectedSlot,
    players,
  });

  const usedHeroes = new Set(
    [...allyTeam, ...enemyTeam, ...bans].filter(Boolean)
  );

  const sortedHeroes = useMemo(() => {
    const sorted = [...baseRankedHeroes].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortAsc
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    });
    return sorted;
  }, [baseRankedHeroes, sortKey, sortAsc]);

  useEffect(() => {
    const fetchAndRankHeroes = async () => {
      const meta = await loadHeroMeta();
      setHeroMeta(meta);
      const ranked = getSortedHeroImages(
        meta,
        allyTeam,
        enemyTeam,
        bans,
        players,
        selectedSlot
      );
      setBaseRankedHeroes(ranked);
    };

    fetchAndRankHeroes();
  }, [allyTeam, enemyTeam, bans, players, selectedSlot]);

  const suggestions: RankedHero[] = sortedHeroes.filter(
    (hero) => rawSuggestions.includes(hero.name) && !usedHeroes.has(hero.img)
  );
  return (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>AvaDrafter</Text>

      <PlayersSection
        players={players}
        setPlayers={setPlayers}
        availablePlayers={availablePlayers}
        styles={styles}
        calculateRP={calculateRP}
        playersData={playersData}
      />

      <TeamSelector
        team={allyTeam}
        type="ally"
        title="Time Aliado"
        onSelect={(index) => {
          if (allyTeam[index]) {
            const newTeam = [...allyTeam];
            newTeam[index] = null;
            setAllyTeam(newTeam);
            setSelectedSlot(null);
          } else {
            setSelectedSlot({ type: "ally", index, playerId: index });
          }
        }}
        styles={styles}
      />

      <TeamSelector
        team={enemyTeam}
        type="enemy"
        title="Time Inimigo"
        onSelect={(index) => {
          if (enemyTeam[index]) {
            const newTeam = [...enemyTeam];
            newTeam[index] = null;
            setEnemyTeam(newTeam);
            setSelectedSlot(null);
          } else {
            setSelectedSlot({ type: "enemy", index, playerId: index });
          }
        }}
        styles={styles}
      />

      <BanSelector
        bans={bans}
        onSelect={(index) => {
          if (bans[index]) {
            const newBans = [...bans];
            newBans[index] = null;
            setBans(newBans);
            setSelectedSlot(null);
          } else {
            setSelectedSlot({ type: "ban", index, playerId: index });
          }
        }}
        styles={styles}
      />

      <HeroSuggestions
        players={players}
        allyTeam={allyTeam}
        enemyTeam={enemyTeam}
        bans={bans}
        selectedSlot={selectedSlot}
        sortedHeroes={sortedHeroes}
        suggestions={suggestions}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        styles={styles}
        calculateRP={calculateRP}
        setAllyTeam={setAllyTeam}
        setEnemyTeam={setEnemyTeam}
        setBans={setBans}
      />
    </ScrollView>
  </SafeAreaView>
);
}
