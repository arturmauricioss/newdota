import React, { useState } from "react";
import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
} from "react-native";
import heroesData from "../../assets/heroes_with_images.json";
import heroLores from "../../assets/lores.json";
import synergyRaw from "../../assets/synergyMatrix.json";
import ScrollPapiro from "../../components/ScrollPapiro";
import { heroesStyles as styles } from "../style/heroesstyle";

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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const cardWidth = 92;

const Heroes = () => {
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = Math.floor(screenWidth / cardWidth);

  const [search, setSearch] = useState("");
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);

  const heroes: Hero[] = heroesData
    .sort((a, b) => a.localized_name.localeCompare(b.localized_name))
    .filter((hero) =>
      hero.localized_name.toLowerCase().includes(search.toLowerCase())
    );

  const synergy =
    selectedHeroId !== null ? synergyMatrix[String(selectedHeroId)] : null;
  const currentHero = heroesData.find((h) => h.id === selectedHeroId);
  const currentHeroLore = heroLores.find((h) => h.id === selectedHeroId)?.lore;

const handleSearch = (text: string) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setSearch(text);

  // Sempre limpa o herói ao digitar
  if (selectedHeroId !== null) {
    setSelectedHeroId(null);
  }
};


  const renderItem = ({ item }: { item: Hero }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedHeroId(item.id);
        setSearch(""); // 🧹 Limpa o campo de busca
      }}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <Text style={styles.name}>{item.localized_name}</Text>
      </View>
    </TouchableOpacity>
  );
return (
  <View style={styles.container}>
    {/* Título dinâmico */}
    <Text style={styles.title}>
      {selectedHeroId === null ? "Heróis" : currentHero?.localized_name}
    </Text>

{/* Campo de busca com botão de voltar */}
<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
  <TextInput
    style={[styles.input, { flex: 1, marginBottom: 0 }]} // Remove o marginBottom do input aqui
    placeholder="Buscar herói..."
    placeholderTextColor="#aaa"
    value={search}
    onChangeText={handleSearch}
  />
  {selectedHeroId !== null && (
    <TouchableOpacity
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedHeroId(null);
        setSearch("");
      }}
      style={{
        height: 40,
        paddingHorizontal: 12,
        backgroundColor: "#2b2c3b",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
      }}
    >
      <Text style={{ color: "#f0f0f0", fontSize: 16 }}>Voltar</Text>
    </TouchableOpacity>
  )}
</View>



    {selectedHeroId === null ? (
      <FlatList
        data={heroes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.grid}
      />
    ) : (
      <ScrollView
        style={styles.details}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Image
          source={{ uri: currentHero?.image_url }}
          style={styles.heroImage}
        />

        {/* 🛡️ Top 10 Aliados */}
        <View style={styles.subsection}>
          <Text style={styles.subTitle}>🛡️ Top 10 Aliados</Text>
          <View style={styles.synergyGrid}>
            {synergy?.with
              .sort((a, b) => b.synergy - a.synergy)
              .slice(0, 10)
              .map((pair) => {
                const partner = heroesData.find((h) => h.id === pair.heroId2);
                if (!partner) return null;
                return (
                  <TouchableOpacity
                    key={partner.id}
                    style={styles.synergyItem}
                    onPress={() => {
                      setSelectedHeroId(partner.id);
                      setSearch("");
                    }}
                  >
                    <Image
                      source={{ uri: partner.image_url }}
                      style={styles.partnerImage}
                    />
                    <Text style={styles.positive}>
                      +{pair.synergy.toFixed(2)}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* ⚔️ Top 10: Melhor Contra */}
        <View style={styles.subsection}>
          <Text style={styles.subTitle}>⚔️ Top 10: Melhor Contra</Text>
          <View style={styles.synergyGrid}>
            {synergy?.vs
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
                    onPress={() => {
                      setSelectedHeroId(enemy.id);
                      setSearch("");
                    }}
                  >
                    <Image
                      source={{ uri: enemy.image_url }}
                      style={styles.partnerImage}
                    />
                    <Text style={styles.positive}>
                      +{pair.synergy.toFixed(2)}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* ☠️ Top 10: Pior Contra */}
        <View style={styles.subsection}>
          <Text style={styles.subTitle}>☠️ Top 10: Pior Contra</Text>
          <View style={styles.synergyGrid}>
            {synergy?.vs
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
                    onPress={() => {
                      setSelectedHeroId(enemy.id);
                      setSearch("");
                    }}
                  >
                    <Image
                      source={{ uri: enemy.image_url }}
                      style={styles.partnerImage}
                    />
                    <Text style={styles.negative}>
                      {pair.synergy.toFixed(2)}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* História */}
        <Text style={styles.subTitle}>História</Text>
        <View style={{ marginVertical: 24 }}>
          <ScrollPapiro
            text={currentHeroLore ?? ""}
            width={Math.min(Math.max(320, screenWidth * 0.8), 600)}
          />
        </View>
      </ScrollView>
    )}
  </View>
);

};

export default Heroes;
