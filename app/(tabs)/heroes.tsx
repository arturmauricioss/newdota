import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Hero = {
  id: number;
  localized_name: string;
  image_url: string;
};

const Heroes = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);

useEffect(() => {
  fetch("/data/heroes_with_images.json")
    .then((res) => res.json())
    .then((data: Hero[]) => {
      const sorted = data.sort((a, b) =>
        a.localized_name.localeCompare(b.localized_name)
      );
      setHeroes(sorted);
    })
    .catch((err) => console.error("Erro ao carregar heróis:", err));
}, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Heróis</Text>
      <View style={styles.grid}>
        {heroes.map((hero) => (
          <View key={hero.id} style={styles.card}>
            <Image
              source={{ uri: hero.image_url }}
              style={styles.image}
            />
            <Text style={styles.name}>{hero.localized_name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.botbar} />
    </ScrollView>
  );
};

export default Heroes;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#1e1e2f",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 80,
    alignItems: "center",
    margin: 6,
    backgroundColor: "#2b2c3b",
    borderRadius: 8,
    padding: 6,
  },
  image: {
    width: 64,
    height: 36,
    borderRadius: 6,
    marginBottom: 6,
  },
  name: {
    color: "#f0f0f0",
    fontSize: 12,
    textAlign: "center",
  },
  botbar: {
    height: 40,
    marginTop: 20,
    backgroundColor: "#111",
    width: "100%",
  },
});
