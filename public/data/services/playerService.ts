import AsyncStorage from "@react-native-async-storage/async-storage";
import allPlayersAsset from "../../../assets/data/players/players.json";
import { HeroStats } from "../../../types"; // importe seu tipo de HeroStats
import { playerNames as staticNames } from "../utils/playerNames";

const NAMES_KEY = "PLAYER_NAMES";
const STATS_KEY = "PLAYER_STATS";

/**
 * Retorna a lista de [id, nome], mesclando nomes estáticos e custom.
 */
export async function getAllPlayers(): Promise<[number, string][]> {
  const namesJson = await AsyncStorage.getItem(NAMES_KEY);
  const customNames: Record<string, string> = namesJson
    ? JSON.parse(namesJson)
    : {};

  const merged = { ...staticNames, ...customNames };
  return Object.entries(merged)
    .map(([id, name]) => [Number(id), name] as [number, string])
    .sort(([, a], [, b]) => a.localeCompare(b));
}

/**
 * Adiciona um novo jogador puro:
 *   1) salva nome no map de nomes
 *   2) fetch na OpenDota
 *   3) salva stats no map de stats
 */
export async function addPlayer(id: number, name: string) {
  // 1) atualiza map de nomes
  const namesJson = await AsyncStorage.getItem(NAMES_KEY);
  const customNames: Record<string, string> = namesJson
    ? JSON.parse(namesJson)
    : {};
  customNames[id] = name;
  await AsyncStorage.setItem(NAMES_KEY, JSON.stringify(customNames));

  // 2) baixa estatísticas da API
  const url = `https://api.opendota.com/api/players/${id}/heroes?game_mode=22`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Não foi possível baixar stats do jogador ${id}`);
  }
  const data: HeroStats[] = await res.json();

  // 3) salva no map de stats
  const statsJson = await AsyncStorage.getItem(STATS_KEY);
  const statsMap: Record<string, HeroStats[]> = statsJson
    ? JSON.parse(statsJson)
    : {};
  statsMap[id] = data;
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(statsMap));
}

/**
 * Retorna as estatísticas de um jogador:
 *   - tenta do AsyncStorage
 *   - se não existir, usa o asset inicial (allPlayersAsset)
 */
export async function getPlayerStats(id: number): Promise<HeroStats[]> {
  const statsJson = await AsyncStorage.getItem(STATS_KEY);
  const statsMap: Record<string, HeroStats[]> = statsJson
    ? JSON.parse(statsJson)
    : {};

  if (statsMap[id]) {
    return statsMap[id];
  }

  // fallback ao JSON embarcado
  return (allPlayersAsset as Record<string, HeroStats[]>)[String(id)] ?? [];
}
