import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { updateMeta } from "../../public/data/services/metaService";
import { addPlayer } from "../../public/data/services/playerService";

// 🔁 Conversão de SteamID64 para Dotabuff ID
function convertToDotabuffId(input: string): number {
  const id = Number(input);
  if (id > 76561197960265728) {
    return id - 76561197960265728;
  }
  return id;
}

export default function ConfigScreen() {
  const [newPlayerId, setNewPlayerId] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const router = useRouter();

  const handleAdd = async () => {
    const convertedId = convertToDotabuffId(newPlayerId);
    if (!convertedId || !newPlayerName.trim()) {
      return Alert.alert("⚠️ Preencha ID e Nome");
    }

    try {
      await addPlayer(convertedId, newPlayerName.trim());
      Alert.alert("✅ Jogador adicionado!", undefined, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert("❌ Erro", err.message || "Não foi possível adicionar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await updateMeta();
          Alert.alert("✅ Meta atualizada!");
        }}
      >
        <Text style={styles.buttonText}>🎯 Atualizar Meta</Text>
      </TouchableOpacity>

      <View style={styles.divider} />
      <Text style={styles.title}>Jogadores</Text>

      <TextInput
        style={styles.input}
        placeholder="ID do jogador (Steam ou Dotabuff)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={newPlayerId}
        onChangeText={setNewPlayerId}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do jogador"
        placeholderTextColor="#888"
        value={newPlayerName}
        onChangeText={setNewPlayerName}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>➕ Adicionar Jogador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1e2f",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#444655",
    marginVertical: 24,
  },
  input: {
    width: "80%",
    maxWidth: 600,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
});
