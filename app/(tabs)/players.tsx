import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
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
      <Text style={styles.title}>Jogadores</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {players.map(([id, name]) => (
          <HoverCard
            key={id}
            name={name}
            onPress={() => router.push(`/players/${id}`)}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

function HoverCard({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
      style={[
        styles.card,
        hovered && styles.cardHovered,
      ]}
    >
      <Text style={styles.cardText}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: "center",
    gap: 10,
    minHeight: "100%",
    backgroundColor: "#1e1e2f",
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    maxWidth: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    margin: 6,
    minWidth: 80,
    transitionDuration: "200ms",
  },
  cardHovered: {
    backgroundColor: "#e0e0e0",
    transform: [{ scale: 1.03 }],
  },
  cardText: {
    color: "#1e1e2f",
    fontSize: 16,
    textAlign: "center",
  },
});
