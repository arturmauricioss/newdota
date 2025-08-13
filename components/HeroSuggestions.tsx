import React from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { totalTableWidth } from "../app/style/draftstyle";
import { Props, RankedHero } from "../types";

const webScrollWrapperStyle = Platform.select({
  web: {
    overflowX: "scroll",
    display: "flex",
    width: "100%",
  },
  default: {},
});
export const HeroSuggestions = ({
  suggestions,
  sortKey,
  setSortKey,
  sortAsc,
  setSortAsc,
  selectedSlot,
  allyTeam,
  enemyTeam,
  bans,
  styles,
  setAllyTeam,
  setEnemyTeam,
  setBans,
}: Props) => {
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (valA == null && valB == null) return 0;
    if (valA == null) return sortAsc ? 1 : -1;
    if (valB == null) return sortAsc ? -1 : 1;

    if (sortKey === "displayScore") {
      valA = parseFloat(valA as string);
      valB = parseFloat(valB as string);
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }

    return 0;
  });

  const isSelected = (heroImg: string): boolean => {
    if (!selectedSlot) return false;
    const selectedArray =
      selectedSlot.type === "ally"
        ? allyTeam
        : selectedSlot.type === "enemy"
        ? enemyTeam
        : bans;
    return selectedArray[selectedSlot.index] === heroImg;
  };
const toggleSort = (key: keyof RankedHero) => {
  if (sortKey === key) {
    setSortAsc(!sortAsc);
  } else {
    setSortKey(key);
    setSortAsc(false);
  }
};

  return (
    <View style={styles.tableSection}>
      <Text style={styles.subTitle}>Sugestões de Heróis</Text>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={true}
  contentContainerStyle={{ minWidth: totalTableWidth }}
>
        <View style={styles.tableContainer}>
          {/* Cabeçalho com nova ordem */}
<View style={styles.tableHeader}>
  <Text style={styles.cellName}>Herói</Text>
  <TouchableOpacity onPress={() => toggleSort("finalScore")}>
    <Text style={styles.cellFinal}>
      Final {sortKey === "finalScore" ? (sortAsc ? "↑" : "↓") : ""}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => toggleSort("playerRP")}>
    <Text style={styles.cellRP}>
      Pessoal {sortKey === "playerRP" ? (sortAsc ? "↑" : "↓") : ""}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => toggleSort("displayScore")}>
    <Text style={styles.cellScore}>
      Meta {sortKey === "displayScore" ? (sortAsc ? "↑" : "↓") : ""}
    </Text>
  </TouchableOpacity>
  {/* <TouchableOpacity onPress={() => toggleSort("totalSynergy")}>
    <Text style={styles.cellSynergy}>
      Sinergia {sortKey === "totalSynergy" ? (sortAsc ? "↑" : "↓") : ""}
    </Text>
  </TouchableOpacity> */}
  <TouchableOpacity onPress={() => toggleSort("synergyWithAlly")}>
    <Text style={styles.cellAlly}>
      Aliado {sortKey === "synergyWithAlly" ? (sortAsc ? "↑" : "↓") : ""}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => toggleSort("synergyVsEnemy")}>
    <Text style={styles.cellEnemy}>
      Inimigo {sortKey === "synergyVsEnemy" ? (sortAsc ? "↑" : "↓") : ""}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => toggleSort("synergyFromBans")}>
    <Text style={styles.cellBan}>
      Bans {sortKey === "synergyFromBans" ? (sortAsc ? "↑" : "↓") : ""}
    </Text>
  </TouchableOpacity>
</View>


          {/* Linhas com nova ordem */}
          {sortedSuggestions.map((hero) => (
            <TouchableOpacity
              key={hero.name}
              style={[
                styles.tableRow,
                isSelected(hero.img) && styles.selectedRow,
              ]}
              onPress={() => {
                if (!selectedSlot) return;
                const img = hero.img;
                if (selectedSlot.type === "ally") {
                  const updated = [...allyTeam];
                  updated[selectedSlot.index] = img;
                  setAllyTeam(updated);
                }
                if (selectedSlot.type === "enemy") {
                  const updated = [...enemyTeam];
                  updated[selectedSlot.index] = img;
                  setEnemyTeam(updated);
                }
                if (selectedSlot.type === "ban") {
                  const updated = [...bans];
                  updated[selectedSlot.index] = img;
                  setBans(updated);
                }
              }}
            >
<View style={styles.heroCell}>
  <Image source={{ uri: hero.img }} style={styles.heroImage} />
  <Text style={styles.heroName}>{hero.localized_name}</Text>
</View>

<Text style={styles.cellFinal}>{hero.finalScore.toFixed(1)}</Text>
<Text style={styles.cellRP}>{hero.playerRP.toFixed(1)}</Text>
<Text style={styles.cellScore}>{hero.displayScore}</Text>
{/* <Text style={styles.cellSynergy}>{hero.totalSynergy.toFixed(1)}</Text> */}
<Text style={styles.cellAlly}>{hero.synergyWithAlly.toFixed(1)}</Text>
<Text style={styles.cellEnemy}>{hero.synergyVsEnemy.toFixed(1)}</Text>
<Text style={styles.cellBan}>{hero.synergyFromBans.toFixed(1)}</Text>
</TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      </View>

  );
};
