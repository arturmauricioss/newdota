import React from "react";
import { Text, View } from "react-native";
import { RankedHero } from "../types";

export const SortHeader = ({
  sortKey,
  sortAsc,
  setSortKey,
  setSortAsc,
  styles,
}: {
  sortKey: keyof RankedHero;
  sortAsc: boolean;
  setSortKey: (key: keyof RankedHero) => void;
  setSortAsc: (asc: boolean) => void;
  styles: any;
}) => {
  const headers = [
    { key: "name", label: "Nome" },
    { key: "metaScore", label: "Meta" },
    { key: "synergyWithAlly", label: "Ally" },
    { key: "synergyVsEnemy", label: "Enemy" },
    { key: "synergyFromBans", label: "Ban" },
    { key: "totalSynergy", label: "Sin" },
    { key: "playerRP", label: "RP" },
    { key: "finalScore", label: "Final" },
  ];

  return (
    <View style={styles.tableHeader}>
      {headers.map(({ key, label }) => (
        <Text
          key={key}
          style={styles.tableHeaderCell}
          onPress={() => {
            setSortKey(key as keyof RankedHero);
            setSortAsc(sortKey === key ? !sortAsc : false);
          }}
        >
          {label} {sortKey === key ? (sortAsc ? "↑" : "↓") : ""}
        </Text>
      ))}
    </View>
  );
};
