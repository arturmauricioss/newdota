import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getPlayerStats } from "../../public/data/services/playerService";

import { calculateRP } from "../../public/data/utils/calculateRP";
import { loadHeroMeta } from "../../public/data/utils/loadHeroMeta";
import { normalizeMetaScore } from "../../public/data/utils/normalize";
import { playerNames } from "../../public/data/utils/playerNames";

import { HeroInfo, HeroStats, MetaInfo, RawHero, SortKey } from "../../types";

const heroesRaw = require("../../assets/heroes_with_images.json");

export default function PlayerDetails() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const numericId = Number(id);
  const name = playerNames[numericId] ?? `Jogador ${numericId}`;

  const [stats, setStats] = useState<HeroStats[]>([]);
  const [heroes, setHeroes] = useState<Record<number, HeroInfo>>({});
  const [metaMap, setMetaMap] = useState<Record<number, MetaInfo>>({});
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("RF");
  const [sortAsc, setSortAsc] = useState(false);
  const [maxRM, setMaxRM] = useState(0);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);

  useEffect(() => {
    (async () => {
      try {
        // 1) Busca stats do player (do AsyncStorage ou do asset inicial)
        const data = await getPlayerStats(numericId);
        setStats(data);

        // 2) Monta mapa de heróis estáticos
        const heroesMap = Object.fromEntries(
          (heroesRaw as RawHero[]).map((h) => [
            h.id,
            { name: h.localized_name, image: h.image_url },
          ])
        );
        setHeroes(heroesMap);

        // 3) Carrega meta de heróis
        const metaRaw = await loadHeroMeta();
        const metaProcessed: Record<number, MetaInfo> = {};
        const rawScores: number[] = [];

        metaRaw.forEach((m: any) => {
          const winRate = m.pub_pick ? (m.pub_win / m.pub_pick) * 100 : 0;
          const rawRM = (m.pro_pick ?? 0) + (m.pro_ban ?? 0);
          rawScores.push(rawRM);

          metaProcessed[m.id] = {
            winRate,
            pub_pick: m.pub_pick,
            pro_pick: m.pro_pick,
            pro_ban: m.pro_ban,
          };
        });

        setMetaMap(metaProcessed);
        setMaxRM(Math.max(...rawScores));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [numericId]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const calculateRF = (games: number, win: number, meta?: MetaInfo) => {
    const RP = calculateRP(games, win);
    const rawRM = meta ? (meta.pro_pick ?? 0) + (meta.pro_ban ?? 0) : 0;
    const RM = normalizeMetaScore(rawRM, maxRM);
    return (RP * 5 + RM * 2) / 7;
  };

  const sortedStats = [...stats].sort((a, b) => {
    const winA = a.games ? a.win / a.games : 0.5;
    const winB = b.games ? b.win / b.games : 0.5;

    const RP_A = calculateRP(a.games, a.win);
    const RP_B = calculateRP(b.games, b.win);

    const metaA = metaMap[a.hero_id];
    const metaB = metaMap[b.hero_id];

    const RM_A = normalizeMetaScore(
      metaA ? (metaA.pro_pick ?? 0) + (metaA.pro_ban ?? 0) : 0,
      maxRM
    );
    const RM_B = normalizeMetaScore(
      metaB ? (metaB.pro_pick ?? 0) + (metaB.pro_ban ?? 0) : 0,
      maxRM
    );

    const RF_A = calculateRF(a.games, a.win, metaA);
    const RF_B = calculateRF(b.games, b.win, metaB);

    if (sortKey === "name") {
      const nameA = heroes[a.hero_id]?.name ?? "";
      const nameB = heroes[b.hero_id]?.name ?? "";
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }

    let valA = 0;
    let valB = 0;
    switch (sortKey) {
      case "games":
        valA = a.games;
        valB = b.games;
        break;
      case "winRate":
        valA = winA;
        valB = winB;
        break;
      case "RP":
        valA = RP_A;
        valB = RP_B;
        break;
      case "RM":
        valA = RM_A;
        valB = RM_B;
        break;
      case "RF":
        valA = RF_A;
        valB = RF_B;
        break;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.wrapper}>
        <Text style={styles.title}>📊 Desempenho do Jogador</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#f5c842" />
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.headerRow}>
              {(["name", "winRate", "RP", "RM", "RF"] as SortKey[]).map(
                (key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.headerCell}
                    onPress={() => handleSort(key)}
                  >
                    <Text style={styles.headerText}>
                      {key === "name" ? "Herói" : key.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {sortedStats.map((item) => {
              const hero = heroes[item.hero_id];
              const meta = metaMap[item.hero_id];
              const winRateRaw = item.games ? item.win / item.games : 0.5;
              const RP = calculateRP(item.games, item.win);
              const rawRM = meta
                ? (meta.pro_pick ?? 0) + (meta.pro_ban ?? 0)
                : 0;
              const RM = normalizeMetaScore(rawRM, maxRM);
              const RF = calculateRF(item.games, item.win, meta);

              return (
                <View key={item.hero_id} style={styles.row}>
                  <View style={styles.heroCell}>
                    <Image
                      source={{ uri: hero?.image }}
                      style={styles.heroImage}
                    />
                  </View>
                  <Text style={styles.cell}>
                    {(winRateRaw * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.cell}>{RP.toFixed(1)}</Text>
                  <Text style={styles.cell}>{RM.toFixed(1)}</Text>
                  <Text style={styles.cell}>{RF.toFixed(1)}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#1e1e2f",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  wrapper: {
    width: "100%",
    maxWidth: 800,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: "#f5c842",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  tableContainer: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#393a4d",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  headerCell: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    textAlign: "center",
    color: "#f0f0f0",
    fontWeight: "600",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b2c3b",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#444655",
  },
  heroCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 6,
  },
  heroImage: {
    width: 64,
    height: 36,
    resizeMode: "contain",
    marginRight: 6,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#f0f0f0",
    fontSize: 14,
  },
});
