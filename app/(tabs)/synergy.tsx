import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

type Hero = {
  id: number;
  localized_name: string;
  image_url: string;
};

type SynergyData = {
  with: { heroId2: number; synergy: number }[];
  vs: { heroId2: number; synergy: number }[];
};

type SynergyMatrix = Record<string, SynergyData>;

const Synergy = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [synergies, setSynergies] = useState<SynergyMatrix>({});
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/heroes_with_images.json")
      .then((res) => res.json())
      .then(setHeroes)
      .catch((err) => console.error("Erro ao carregar heróis:", err));

    fetch("/data/synergyMatrix.json")
      .then((res) => res.json())
      .then(setSynergies)
      .catch((err) => console.error("Erro ao carregar sinergias:", err));
  }, []);

  const synergy =
    selectedHeroId !== null ? synergies[String(selectedHeroId)] : null;
  const currentHero = heroes.find((h) => h.id === selectedHeroId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔗 Sinergias e Counters de Heróis</Text>

      <Picker
        selectedValue={selectedHeroId ?? ""}
        onValueChange={(value) => setSelectedHeroId(Number(value))}
        style={styles.picker}
      >
        <Picker.Item label="Escolha um herói" value="" />
        {heroes.map((hero) => (
          <Picker.Item
            key={hero.id}
            label={hero.localized_name}
            value={hero.id}
          />
        ))}
      </Picker>

      {synergy && currentHero && (
        <View style={styles.details}>
          <Text style={styles.heroName}>{currentHero.localized_name}</Text>
          <Image
            source={{ uri: currentHero.image_url }}
            style={styles.heroImage}
          />

          {/* 🛡️ Top 10 Aliados */}
          <View style={styles.subsection}>
            <Text style={styles.subTitle}>🛡️ Top 10 Aliados</Text>
            <View style={styles.synergyGrid}>
              {synergy.with
                .sort((a, b) => b.synergy - a.synergy)
                .slice(0, 10)
                .map((pair) => {
                  const partner = heroes.find(
                    (h) => h.id === pair.heroId2
                  );
                  if (!partner) return null;
                  return (
                    <View key={partner.id} style={styles.synergyItem}>
                      <Image
                        source={{ uri: partner.image_url }}
                        style={styles.partnerImage}
                      />
                      <Text style={styles.positive}>
                        +{pair.synergy.toFixed(2)}%
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>

          {/* ⚔️ Top 10: Melhor Contra */}
          <View style={styles.subsection}>
            <Text style={styles.subTitle}>⚔️ Top 10: Melhor Contra</Text>
            <View style={styles.synergyGrid}>
              {synergy.vs
                .filter((pair) => pair.synergy > 0)
                .sort((a, b) => b.synergy - a.synergy)
                .slice(0, 10)
                .map((pair) => {
                  const enemy = heroes.find(
                    (h) => h.id === pair.heroId2
                  );
                  if (!enemy) return null;
                  return (
                    <View key={enemy.id} style={styles.synergyItem}>
                      <Image
                        source={{ uri: enemy.image_url }}
                        style={styles.partnerImage}
                      />
                      <Text style={styles.positive}>
                        +{pair.synergy.toFixed(2)}%
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>

          {/* ☠️ Top 10: Pior Contra */}
          <View style={styles.subsection}>
            <Text style={styles.subTitle}>☠️ Top 10: Pior Contra</Text>
            <View style={styles.synergyGrid}>
              {synergy.vs
                .filter((pair) => pair.synergy < 0)
                .sort((a, b) => a.synergy - b.synergy)
                .slice(0, 10)
                .map((pair) => {
                  const enemy = heroes.find(
                    (h) => h.id === pair.heroId2
                  );
                  if (!enemy) return null;
                  return (
                    <View key={enemy.id} style={styles.synergyItem}>
                      <Image
                        source={{ uri: enemy.image_url }}
                        style={styles.partnerImage}
                      />
                      <Text style={styles.negative}>
                        {pair.synergy.toFixed(2)}%
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Synergy;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#1e1e2f",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 12,
  },
  picker: {
    backgroundColor: "#2b2c3b",
    color: "#f0f0f0",
    marginBottom: 16,
  },
  details: {
    alignItems: "center",
  },
  heroName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 8,
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 16,
  },
  subsection: {
    marginBottom: 20,
    width: "100%",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 8,
  },

  // Nova grid de 2 colunas
  synergyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  synergyItem: {
    width: "17%",
    alignItems: "center",
    marginBottom: 12,
  },
  partnerImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginBottom: 4,
  },
  positive: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  negative: {
    color: "#f44336",
    fontWeight: "bold",
  },
});
