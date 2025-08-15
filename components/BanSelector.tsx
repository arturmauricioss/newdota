import React from "react";
import { Text, View } from "react-native";
import BanSlot from "./BanSlot";

export const BanSelector = ({
  bans,
  onSelect,
  styles,
}: {
  bans: (string | null)[];
  onSelect: (index: number) => void;
  styles: any;
}) => (
  <>
    <Text style={styles.subTitle}>Banimentos</Text>
    <View style={styles.banSection}>
      {bans.map((ban, i) => (
        <View key={`ban-${i}`} style={styles.slotWrapper}>
          <BanSlot hero={ban} onSelect={() => onSelect(i)} />
        </View>
      ))}
    </View>
  </>
);
