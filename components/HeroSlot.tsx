import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  hero: string | null;
  onSelect: () => void;
};

export default function HeroSlot({ hero, onSelect }: Props) {
  return (
    <TouchableOpacity onPress={onSelect} style={styles.slot}>
      {hero ? (
        <Image source={{ uri: hero }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: { width: 60, height: 60, margin: 4 },
  image: { width: "100%", height: "100%", borderRadius: 8 },
  placeholder: { flex: 1, backgroundColor: "#444", borderRadius: 8 }
});
