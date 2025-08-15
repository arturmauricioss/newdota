import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type PlayerSelectProps = {
  value: number | null;
  onChange: (newValue: number) => void;
  options: { id: number; name: string }[];
  disabled?: boolean;
};

const PlayerSelect: React.FC<PlayerSelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
}) => {
  if (Platform.OS === "web") {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={webStyles.select}
      >
        <option value="" disabled>
          Jogador
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }

  // Versão para mobile (Android/iOS)
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Jogador</Text>
      <Picker
        selectedValue={value ?? ""}
        onValueChange={(itemValue) => onChange(Number(itemValue))}
        enabled={!disabled}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um jogador" value="" />
        {options.map((option) => (
          <Picker.Item key={option.id} label={option.name} value={option.id} />
        ))}
      </Picker>
    </View>
  );
};

export default PlayerSelect;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    color: "#f0f0f0",
    marginBottom: 4,
  },
  picker: {
    backgroundColor: "#2b2c3b",
    color: "#f0f0f0",
  },
});

const webStyles = {
  select: {
    width: 60,
    fontSize: 14,
    padding: "4px 8px",
    color: "#f0f0f0",
    backgroundColor: "#2b2c3b",
    borderRadius: 4,
    border: "none",
    appearance: "none" as const,
  },
};
