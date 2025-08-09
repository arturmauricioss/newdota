import React from "react";
import { Text, View } from "react-native";
import HeroSlot from "./HeroSlot";

export const TeamSelector = ({
  team,
  type,
  onSelect,
  title,
  styles,
}: {
  team: (string | null)[];
  type: "ally" | "enemy";
  onSelect: (index: number) => void;
  title: string;
  styles: any;
}) => (
  <>
    <Text style={styles.subTitle}>{title}</Text>
    <View style={styles.teamRow}>
      {team.map((hero, i) => (
        <View key={`${type}-${i}`} style={styles.slotWrapper}>
          <HeroSlot
            hero={hero}
            onSelect={() => onSelect(i)}
          />
        </View>
      ))}
    </View>
  </>
);
