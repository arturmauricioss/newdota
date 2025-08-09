import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import allPlayersData from "../../assets/data/players/players.json";
import { calculateRP } from "../../public/data/utils/calculateRP";
import { playerNames } from "../../public/data/utils/playerNames";


const heroesRaw = require("../../assets/heroes_with_images.json");
const metaRaw = require("../../assets/meta.json");

type HeroStats = {
  hero_id: number;
  games: number;
  win: number;
};

type HeroInfo = {
  name: string;
  image: string;
};

type MetaInfo = {
  winRate: number;
  pub_pick: number;
  pro_pick?: number;
  pro_ban?: number;
};
type RawHero = {
  id: number;
  localized_name: string;
  image_url: string;
};
type SortKey = "name" | "winRate" | "games" | "RP" | "RM" | "RF";

export default function PlayerDetails() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const name = playerNames[Number(id)];

  const [stats, setStats] = useState<HeroStats[]>([]);
  const [heroes, setHeroes] = useState<Record<number, HeroInfo>>({});
  const [metaMap, setMetaMap] = useState<Record<number, MetaInfo>>({});
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("RF");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: name });
    }
  }, [name]);

 useEffect(() => {
  const fetchData = async () => {
    try {
const statsData = (allPlayersData as Record<string, HeroStats[]>)[id as string];

if (!statsData) {
  throw new Error(`Dados não encontrados para o jogador ${id}`);
}
setStats(statsData);

      const heroesMap = Object.fromEntries(
        (heroesRaw as RawHero[]).map((hero) => [
          hero.id,
          { name: hero.localized_name, image: hero.image_url }
        ])
      );
      setHeroes(heroesMap);

      const metaMapProcessed: Record<number, MetaInfo> = {};
      (metaRaw as any[]).forEach((metaHero) => {
        const winRateMeta =
          metaHero.pub_pick > 0
            ? (metaHero.pub_win / metaHero.pub_pick) * 100
            : 0;
        metaMapProcessed[metaHero.id] = {
          winRate: winRateMeta,
          pub_pick: metaHero.pub_pick,
          pro_pick: metaHero.pro_pick,
          pro_ban: metaHero.pro_ban
        };
      });
      setMetaMap(metaMapProcessed);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

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
    const RM = rawRM / 100 - 10;
    return (RP * 5 +RM*2) / 7;
  };

  const sortedStats = [...stats].sort((a, b) => {
    const heroA = heroes[a.hero_id];
    const heroB = heroes[b.hero_id];

    const winRateA = a.games > 0 ? a.win / a.games : 0.5;
    const winRateB = b.games > 0 ? b.win / b.games : 0.5;

    const RP_A = calculateRP(a.games, a.win);
    const RP_B = calculateRP(b.games, b.win);

    const metaA = metaMap[a.hero_id];
    const metaB = metaMap[b.hero_id];

    const RM_A = metaA ? (metaA.pro_pick ?? 0) + (metaA.pro_ban ?? 0) : 0;
    const RM_B = metaB ? (metaB.pro_pick ?? 0) + (metaB.pro_ban ?? 0) : 0;

    const RF_A = calculateRF(a.games, a.win, metaA);
    const RF_B = calculateRF(b.games, b.win, metaB);

    let valA = 0;
    let valB = 0;

    switch (sortKey) {
      case "name":
        return sortAsc
          ? (heroA?.name || "").localeCompare(heroB?.name || "")
          : (heroB?.name || "").localeCompare(heroA?.name || "");
      case "games":
        valA = a.games;
        valB = b.games;
        break;
      case "winRate":
        valA = winRateA;
        valB = winRateB;
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
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>📊 Desempenho do Jogador</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#f5c842" />
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.headerCell} onPress={() => handleSort("name")}>
                <Text style={styles.headerText}>Herói</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerCell} onPress={() => handleSort("winRate")}>
                <Text style={styles.headerText}>Winrate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerCell} onPress={() => handleSort("RP")}>
                <Text style={styles.headerText}>RP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerCell} onPress={() => handleSort("RM")}>
                <Text style={styles.headerText}>RM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerCell} onPress={() => handleSort("RF")}>
                <Text style={styles.headerText}>RF</Text>
              </TouchableOpacity>
            </View>

            {sortedStats.map((item) => {
              const hero = heroes[item.hero_id];
              const meta = metaMap[item.hero_id];
              const winRateRaw = item.games > 0 ? item.win / item.games : 0.5;
              const RP = calculateRP(item.games, item.win);
              const rawRM = meta ? (meta.pro_pick ?? 0) + (meta.pro_ban ?? 0) : 0;
              const RM = rawRM / 100 - 10;
              const RF = calculateRF(item.games, item.win, meta);

              return (
                <View key={item.hero_id} style={styles.row}>
                  <View style={styles.heroCell}>
                    <Image source={{ uri: hero?.image }} style={styles.heroImage} />
                  </View>
                  <Text style={styles.cell}>{(winRateRaw * 100).toFixed(0)}%</Text>
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
