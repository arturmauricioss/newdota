import React, { useState } from "react";
import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View
} from "react-native";
import heroesData from "../../assets/heroes_with_images.json";
import synergyRaw from "../../assets/synergyMatrix.json";

type Hero = {
  id: number;
  localized_name: string;
  image_url: string;
};

type SynergyPair = {
  heroId2: number;
  synergy: number;
};

type SynergyData = {
  with: SynergyPair[];
  vs: SynergyPair[];
};

type SynergyMatrix = {
  [heroId: string]: SynergyData;
};

const synergyMatrix: SynergyMatrix = synergyRaw;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const cardWidth = 92;

const Heroes = () => {
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = Math.floor(screenWidth / cardWidth);

  const [search, setSearch] = useState("");
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);

  const heroes: Hero[] = heroesData
    .sort((a: Hero, b: Hero) => a.localized_name.localeCompare(b.localized_name))
    .filter((hero: Hero) =>
      hero.localized_name.toLowerCase().includes(search.toLowerCase())
    );

  const synergy = selectedHeroId !== null ? synergyMatrix[String(selectedHeroId)] : null;
  const currentHero = heroesData.find((h: Hero) => h.id === selectedHeroId);


  const handleSearch = (text: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearch(text);
    setSelectedHeroId(null);
  };

  const renderItem = ({ item }: { item: Hero }) => (
    <TouchableOpacity onPress={() => setSelectedHeroId(item.id)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <Text style={styles.name}>{item.localized_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
{selectedHeroId === null && (
  <>
    <Text style={styles.title}>Herois</Text>
    <TextInput
      style={styles.input}
      placeholder="Buscar herói..."
      placeholderTextColor="#aaa"
      value={search}
      onChangeText={handleSearch}
    />
    <FlatList
      data={heroes}
      renderItem={renderItem}
      keyExtractor={(item: Hero) => item.id.toString()}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={styles.grid}
    />
  </>
)}

  

      {synergy && currentHero && (
        <ScrollView style={styles.details}>
              <TextInput
      style={styles.input}
      placeholder="Buscar herói..."
      placeholderTextColor="#aaa"
      value={search}
      onChangeText={handleSearch}
    />


          <Text style={styles.heroName}>{currentHero.localized_name}</Text>
          <Image source={{ uri: currentHero.image_url }} style={styles.heroImage} />

          {/* 🛡️ Top 10 Aliados */}
          <View style={styles.subsection}>
            <Text style={styles.subTitle}>🛡️ Top 10 Aliados</Text>
            <View style={styles.synergyGrid}>
{synergy.with
  .sort((a, b) => b.synergy - a.synergy)
  .slice(0, 10)
  .map((pair) => {
    const partner = heroesData.find((h) => h.id === pair.heroId2);
    if (!partner) return null;
    return (
      <TouchableOpacity
        key={partner.id}
        style={styles.synergyItem}
        onPress={() => setSelectedHeroId(partner.id)}
      >
        <Image source={{ uri: partner.image_url }} style={styles.partnerImage} />
        <Text style={styles.positive}>+{pair.synergy.toFixed(2)}%</Text>
      </TouchableOpacity>
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
    const enemy = heroesData.find((h) => h.id === pair.heroId2);
    if (!enemy) return null;
    return (
      <TouchableOpacity
        key={enemy.id}
        style={styles.synergyItem}
        onPress={() => setSelectedHeroId(enemy.id)}
      >
        <Image source={{ uri: enemy.image_url }} style={styles.partnerImage} />
        <Text style={styles.positive}>+{pair.synergy.toFixed(2)}%</Text>
      </TouchableOpacity>
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
    const enemy = heroesData.find((h) => h.id === pair.heroId2);
    if (!enemy) return null;
    return (
      <TouchableOpacity
        key={enemy.id}
        style={styles.synergyItem}
        onPress={() => setSelectedHeroId(enemy.id)}
      >
        <Image source={{ uri: enemy.image_url }} style={styles.partnerImage} />
        <Text style={styles.negative}>{pair.synergy.toFixed(2)}%</Text>
      </TouchableOpacity>
    );
  })}

            </View>
          </View>
        </ScrollView>
      )}


    </View>
  );
};

export default Heroes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e2f",
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#2b2c3b",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#f0f0f0",
    marginBottom: 12,
  },
  grid: {
    justifyContent: "center",
  },
  card: {
    width: 80,
    height: 88,
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
  details: {
    alignItems: "center",
    marginTop: 24,
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
