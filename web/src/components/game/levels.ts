export type LevelSource = {
  id: number;
  name: string;
  rows: string[];
  maxMoves?: number;
};

/** Row strings: `.` floor, `#` wall, `@` start, `E` exit, `G` gem */
export const LEVEL_SOURCES: LevelSource[] = [
  {
    id: 1,
    name: "Boot sector",
    rows: [
      "....E",
      ".....",
      "..@..",
      ".....",
      ".....",
    ],
  },
  {
    id: 2,
    name: "Firewall maze",
    rows: [
      "#########",
      "#..G....#",
      "#.###.#.#",
      "#...@...#",
      "#.###.#.#",
      "#.....E.#",
      "#########",
    ],
    maxMoves: 48,
  },
  {
    id: 3,
    name: "Neon vault",
    rows: [
      "G.......G",
      ".#######.",
      ".#.....#.",
      ".#.E...@.",
      ".#.....#.",
      ".#######.",
      ".........",
    ],
    maxMoves: 36,
  },
  {
    id: 4,
    name: "Singularity",
    rows: [
      "..........",
      ".#.#.#.#.#.",
      "..G....G..",
      ".#.#@#.#.#.",
      "..G....G..",
      ".#.#.#.#.#.",
      ".....E....",
    ],
    maxMoves: 42,
  },
];
