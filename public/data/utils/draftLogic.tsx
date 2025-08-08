import metaData from "../../../assets/meta.json";

type SlotSelection = {
  type: "ally" | "enemy" | "ban";
  index: number;
  playerId?: number;
};

type PlayerProfile = {
  preferences?: string[];
};

type DraftParams = {
  allyTeam: (string | null)[];
  enemyTeam: (string | null)[];
  bans: (string | null)[];
  slotIndex: SlotSelection | null;
  players: PlayerProfile[];
};

// Retorna nomes dos heróis disponíveis no meta
function getMetaHeroes(): string[] {
  return metaData.map((hero: any) => hero.name);
}

// Ordena por sinergia fictícia baseada em presença no time aliado
function sortBySinergy(heroes: string[], allyTeam: (string | null)[]): string[] {
  return [...heroes].sort((a, b) => {
    const scoreA = allyTeam.filter((hero) => hero && a.includes(hero)).length;
    const scoreB = allyTeam.filter((hero) => hero && b.includes(hero)).length;
    return scoreB - scoreA;
  });
}

// Ordena por “counter” fictício com lógica inversa
function sortByCounters(heroes: string[], enemyTeam: (string | null)[]): string[] {
  return [...heroes].sort((a, b) => {
    const scoreA = enemyTeam.filter((hero) => hero && a.includes(hero)).length;
    const scoreB = enemyTeam.filter((hero) => hero && b.includes(hero)).length;
    return scoreA - scoreB;
  });
}

// Ban prioritário fictício — heróis com nome longo são mais perigosos (🙃)
function getBanRecommendations(heroes: string[], ally: (string | null)[], enemy: (string | null)[]): string[] {
  return [...heroes].sort((a, b) => b.length - a.length);
}

// Preferência do jogador tem prioridade
function prioritizePlayerPreferences(pool: string[], preferences: string[]): string[] {
  return [...pool].sort((a, b) => {
    const aPref = preferences.includes(a) ? -1 : 1;
    const bPref = preferences.includes(b) ? -1 : 1;
    return aPref - bPref;
  });
}

// Função principal
export const getHeroSuggestions = ({
  allyTeam = [],
  enemyTeam = [],
  bans = [],
  slotIndex = null,
  players = [],
}: DraftParams): string[] => {
  let availableHeroes = getMetaHeroes();

  const selectedHeroes = [...allyTeam, ...enemyTeam].filter(Boolean) as string[];
  availableHeroes = availableHeroes.filter(
    (hero: string) => !bans.includes(hero) && !selectedHeroes.includes(hero)
  );

  let suggestions: string[] = [];

  if (slotIndex?.type === "ally") {
    const synergeticHeroes = sortBySinergy(availableHeroes, allyTeam);

    const player = players[slotIndex.playerId ?? 0];
    if (player?.preferences) {
      suggestions = prioritizePlayerPreferences(synergeticHeroes, player.preferences);
    } else {
      suggestions = synergeticHeroes;
    }

  } else if (slotIndex?.type === "enemy") {
    suggestions = sortByCounters(availableHeroes, enemyTeam);

  } else if (slotIndex?.type === "ban") {
    suggestions = getBanRecommendations(availableHeroes, allyTeam, enemyTeam);

  } else {
    suggestions = availableHeroes;
  }

  return suggestions;
};
