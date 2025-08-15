import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { RankedHero } from "../types";

export const HeroRow = ({
  hero,
  onSelect,
  styles,
}: {
  hero: RankedHero;
  onSelect: () => void;
  styles: any;
}) => (
  <TouchableOpacity style={styles.tableRow} onPress={onSelect}>
    <Image source={{ uri: hero.img }} style={styles.tableImage} />
    <Text style={styles.tableCell}>{hero.name}</Text>
    <Text style={styles.tableCell}>{hero.displayScore}</Text>
    <Text style={styles.tableCell}>{hero.synergyWithAlly.toFixed(1)}</Text>
    <Text style={styles.tableCell}>{hero.synergyVsEnemy.toFixed(1)}</Text>
    <Text style={styles.tableCell}>{hero.synergyFromBans.toFixed(1)}</Text>
    <Text style={styles.tableCell}>{hero.totalSynergy.toFixed(1)}</Text>
    <Text style={styles.tableCell}>{hero.playerRP.toFixed(1)}</Text>
    <Text style={styles.tableCell}>{hero.finalScore.toFixed(1)}</Text>
  </TouchableOpacity>
);
