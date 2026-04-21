import { shuffle } from "./shuffle";

export function createTeams(players: string[]) {
  const shuffled = shuffle(players);
  const mid = Math.ceil(shuffled.length / 2);

  return {
    teamA: shuffled.slice(0, mid),
    teamB: shuffled.slice(mid),
  };
}
