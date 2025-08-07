export const calculateRP = (games: number, win: number): number => {
  const winRate = games > 0 ? win / games : 0.5;
  return ((winRate - 1 / (games + 1)) - 0.25)*15 +2;
};
