import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

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
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data: MetaHero[]) => {
        const processed = data.map((hero) => ({
          ...hero,
          winRate: parseFloat(((hero.pub_win / hero.pub_pick) * 100).toFixed(2)),
          metaScore: (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0),
        }));
        setHeroes(processed);
      })
      .catch((err) => console.error("Erro ao carregar meta:", err));
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
    <ScrollView style={styles.container}>
<View style={styles.headerRow}>
  <Text style={styles.headerCell}>Herói</Text>
    <Text style={[styles.headerCell, styles.secondColumnOffset]}>
        Win Rate
    </Text>
  <Text style={styles.headerCell}>Meta Score</Text>
</View>



      {sortedHeroes.map((hero) => (
<View key={hero.id} style={styles.row}>
  <View style={styles.heroCell}>
    <Image
      source={{ uri: `https://cdn.cloudflare.steamstatic.com${hero.img}` }}
      style={styles.heroImg}
    />
     <Text style={styles.heroName}>{hero.localized_name}</Text>
  </View>
  <Text style={[
        styles.cell,
        styles.secondColumnOffset
      ]}>{hero.winRate}</Text>
  <Text style={styles.cell}>{hero.metaScore}</Text>
</View>

      ))}
    </ScrollView>
  );
};

export default MetaTable;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#1e1e2f",
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
    paddingLeft: 50,   // ajuste esse valor conforme a distância desejada
  },
});
