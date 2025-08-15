import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  heroes: (string | null)[];
};

export default function SuggestedHeroes({ heroes }: Props) {
  const filteredHeroes = heroes.filter(
    (h): h is string => h !== null && h !== ""
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sugestões:</Text>
      <FlatList
        horizontal
        data={filteredHeroes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  title: {
    color: "#f5c842",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  card: { width: 60, height: 60, marginHorizontal: 4 },
  image: { width: "100%", height: "100%", borderRadius: 8 },
});
