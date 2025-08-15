import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { loadHeroMeta } from "../../public/data/utils/loadHeroMeta"; // ajuste o caminho conforme sua estrutura

type MetaHero = {
  id: number;
  localized_name: string;
  img: string;
  pub_pick: number;
  pub_win: number;
  pro_pick?: number;
  pro_ban?: number;
  winRate?: number;
  metaScore?: number;
};

type SortKey = "localized_name" | "winRate" | "metaScore";

const MetaTable = () => {
  const [heroes, setHeroes] = useState<MetaHero[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("metaScore");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const rawData = await loadHeroMeta();

        const rawScores = rawData.map(
          (hero: MetaHero) => (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0)
        );
        const maxScore = Math.max(...rawScores);

        const processed = rawData.map((hero: MetaHero) => {
          const rawMeta = (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0);
          const normalizedMeta =
            maxScore > 0 ? (rawMeta / maxScore) * 20 - 10 : 0;

          return {
            ...hero,
            winRate: parseFloat(
              ((hero.pub_win / hero.pub_pick) * 100).toFixed(2)
            ),
            metaScore: parseFloat(normalizedMeta.toFixed(2)),
          };
        });

        setHeroes(processed);
      } catch (error) {
        console.error("Erro ao carregar meta:", error);
        setHeroes([]);
      }
    };

    loadMeta();
  }, []);

  const sortedHeroes = [...heroes].sort((a, b) => {
    let result = 0;

    if (sortKey === "localized_name") {
      result = a.localized_name.localeCompare(b.localized_name);
    } else {
      const aVal = a[sortKey] as number;
      const bVal = b[sortKey] as number;
      result = aVal - bVal;
    }

    return sortAsc ? result : -result;
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <Text style={styles.heading}>Meta</Text>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("localized_name")}
          >
            <Text style={styles.headerText}>Herói</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerCell, styles.secondColumnOffset]}
            onPress={() => handleSort("winRate")}
          >
            <Text style={styles.headerText}>Win Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("metaScore")}
          >
            <Text style={styles.headerText}>Meta Score</Text>
          </TouchableOpacity>
        </View>

        {sortedHeroes.map((hero) => (
          <View key={hero.id} style={styles.row}>
            <View style={styles.heroCell}>
              <Image
                source={{
                  uri: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
                }}
                style={styles.heroImg}
              />
              <Text style={styles.heroName}>{hero.localized_name}</Text>
            </View>
            <Text style={[styles.cell, styles.secondColumnOffset]}>
              {hero.winRate}
            </Text>
            <Text style={styles.cell}>{hero.metaScore}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default MetaTable;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#1e1e2f",
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#444",
    paddingBottom: 6,
    marginBottom: 6,
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#f0f0f0",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  cell: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
  },
  heroImg: {
    width: 64,
    height: 36,
    marginRight: 6,
    borderRadius: 4,
  },
  heroCell: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  heroName: {
    color: "#f0f0f0",
    fontSize: 14,
  },
  secondColumnOffset: {
    paddingLeft: 50, // ajuste esse valor conforme a distância desejada
  },
  headerText: {
    fontWeight: "bold",
    color: "#f0f0f0",
    textAlign: "center",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#1e1e2f",
  },
  heading: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "bold",
    color: "#f5f5f5",
    marginBottom: 12,
    textAlign: "center",
  },
});
