import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  Props,
  RankedHero
} from "../types";



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

  // Tratar valores nulos ou indefinidos
  if (valA == null && valB == null) return 0;
  if (valA == null) return sortAsc ? 1 : -1;
  if (valB == null) return sortAsc ? -1 : 1;

  // Forçar conversão para número se for displayScore
  if (sortKey === "displayScore") {
    valA = parseFloat(valA as string);
    valB = parseFloat(valB as string);
  }

  // Comparação de strings
  if (typeof valA === "string" && typeof valB === "string") {
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  }

  // Comparação de números
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



  return (
    <View style={styles.tableSection}>
      <Text style={styles.subTitle}>Sugestões de Heróis</Text>
      <View style={styles.tableContainer}>
        {/* Cabeçalho */}
        <View style={styles.tableHeader}>
          {[
            { key: "localized_name", label: "Nome" },
            { key: "displayScore", label: "Score" },
            { key: "synergyWithAlly", label: "Ally" },
            { key: "synergyVsEnemy", label: "Enemy" },
            { key: "synergyFromBans", label: "Ban" },
            { key: "totalSynergy", label: "Sin" },
            { key: "playerRP", label: "RP" },
            { key: "finalScore", label: "Final" },
          ].map(({ key, label }) => (
<TouchableOpacity
  key={key}
  onPress={() => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortAsc(false);
    }
    setSortKey(key as keyof RankedHero);
  }}
>
  <Text style={styles.tableHeaderCell}>
    {label} {sortKey === key ? (sortAsc ? "↑" : "↓") : ""}
  </Text>
</TouchableOpacity>

          ))}
        </View>

        {/* Linhas */}
        {sortedSuggestions.map((hero) => (
          <TouchableOpacity
            key={hero.name}
style={[
  styles.tableRow,
  isSelected(hero.img) && styles.selectedRow
]}

            onPress={() => {
              if (!selectedSlot) return;
              const img = hero.img;
              if (selectedSlot.type === "ally") {
  const updated = [...allyTeam];
  updated[selectedSlot.index] = img;
  setAllyTeam(updated);
}if (selectedSlot.type === "enemy") {
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
            <Image source={{ uri: hero.img }} style={styles.tableImage} />
            <Text style={styles.tableCell}>{hero.localized_name}</Text>
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
    </View>
  );
};
