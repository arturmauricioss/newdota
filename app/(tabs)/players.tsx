import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { playerNames } from "../../public/data/utils/playerNames";

export default function Players() {
  const [players, setPlayers] = useState<[number, string][]>([]);
  const router = useRouter();

useEffect(() => {
  const sorted = Object.entries(playerNames).sort((a, b) =>
    a[1].localeCompare(b[1])
  );
  setPlayers(sorted.map(([id, name]) => [Number(id), name]));
}, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎮 Jogadores</Text>
      <View style={styles.grid}>
        {players.map(([id, name]) => (
          <TouchableOpacity
            key={id}
            style={styles.card}
            onPress={() => router.push(`/players/${id}`)}
          >
            <Text style={styles.cardText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    gap: 12
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "center"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10
  },
  card: {
    backgroundColor: "#1e1e2f",
    padding: 16,
    borderRadius: 8,
    margin: 6,
    minWidth: 120
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  }
});
