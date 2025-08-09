export type SlotSelection = {
  type: "ally" | "enemy" | "ban";
  index: number;
  playerId?: number;
};

export type HeroMeta = {
  id: number;
  name: string;
  img: string;
  pub_pick: number;
  pub_win: number;
  pro_pick?: number;
  pro_ban?: number;
    localized_name: string;
};

export type SynergyEntry = {
  heroId2: number;
  synergy: number;
};

export type SynergyMatrixEntry = {
  heroId: number;
  vs: SynergyEntry[];
  with: SynergyEntry[];
};

export type SynergyMatrix = {
  [heroId: string]: SynergyMatrixEntry;
};

export type PlayerStatEntry = {
  hero_id: number;
  games: number;
  win: number;
};

export type RankedHero = {
  name: string;
  localized_name: string;
  img: string;
  winRate: number;
  metaScore: number;
  synergyWithAlly: number;
  synergyVsEnemy: number;
  synergyFromBans: number;
  totalSynergy: number;
  finalScore: number;
  displayScore: string;
  playerRP: number;
};

export type PlayerProfile = {
  name: string;
  preferences: string[];
  stats?: Record<number, number>;
};
export type Props = {
  suggestions: RankedHero[];
  styles: any;
  players: PlayerProfile[];
  allyTeam: (string | null)[];
  enemyTeam: (string | null)[];
  bans: (string | null)[];
  selectedSlot: SlotSelection | null;
  sortedHeroes: RankedHero[];

  sortKey: keyof RankedHero;
  setSortKey: (key: keyof RankedHero) => void;
  sortAsc: boolean;
  setSortAsc: (value: boolean) => void;

  calculateRP: (games: number, win: number) => number;
  setAllyTeam: (team: (string | null)[]) => void;
  setEnemyTeam: (team: (string | null)[]) => void;
  setBans: (bans: (string | null)[]) => void;
  
};
