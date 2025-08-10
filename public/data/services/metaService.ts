import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export const updateMeta = async (): Promise<void> => {
  const response = await fetch("https://api.opendota.com/api/heroStats");
  const data = await response.json();

  if (Platform.OS === "web") {
    localStorage.setItem("metaData", JSON.stringify(data));
  } else {
    const fileUri = FileSystem.documentDirectory + "meta.json";
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), {
      encoding: FileSystem.EncodingType.UTF8,
    });
  }
};
