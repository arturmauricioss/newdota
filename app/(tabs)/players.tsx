import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getAllPlayers } from "../../public/data/services/playerService";

export default function Players() {
  const [players, setPlayers] = useState<[number, string][]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const list = await getAllPlayers();
        setPlayers(list);
      })();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Jogadores</Text>
      </View>

      {/* Grid de cards */}
      <View style={styles.grid}>
        {players.map(([id, name]) => (
          <Pressable
            key={id}
            onPress={() => router.push(`/players/${id}`)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardHovered,
            ]}
          >
            <Text style={styles.cardText}>{name}</Text>
          </Pressable>
        ))}
      </View>

      {/* Botão de adicionar jogador */}
      <View style={styles.footer}>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/config")}

        >
          <Text style={styles.addButtonText}>➕</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: "center",
    backgroundColor: "#1e1e2f",
    minHeight: "100%",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 3,
    maxWidth:900,
  },
  card: {
    backgroundColor: "#dadadaff",
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    margin: 3,
  },
  cardHovered: {
    backgroundColor: "#e0e0e0",
    transform: [{ scale: 1.03 }],
  },
  cardText: {
    color: "#1e1e2f",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 24,
  },
  addButton: {
    backgroundColor: "#00ff2aff",
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
