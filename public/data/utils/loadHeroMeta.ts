import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { HeroMeta } from "../../../types";

// Importa fallback apenas quando necessário
let metaFallback: HeroMeta[] | null = null;

const getFallback = async (): Promise<HeroMeta[]> => {
  if (!metaFallback) {
    // Importa dinamicamente para evitar execução no servidor
    const fallbackModule = await import("../../../assets/meta.json");
    metaFallback = fallbackModule.default as HeroMeta[];
  }
  return metaFallback;
};

export const loadHeroMeta = async (): Promise<HeroMeta[]> => {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        const saved = localStorage.getItem("metaData");
        if (saved) {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed : await getFallback();
        }
      }
      return await getFallback();
    } else {
      const fileUri = FileSystem.documentDirectory + "meta.json";
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : await getFallback();
      } else {
        return await getFallback();
      }
    }
  } catch (error) {
    console.error("Erro ao carregar heroMeta:", error);
    return await getFallback();
  }
};
