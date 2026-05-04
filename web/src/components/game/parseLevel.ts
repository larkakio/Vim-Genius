import type { LevelSource } from "./levels";

export type CellKind = "floor" | "wall" | "exit" | "gem";

export type ParsedLevel = {
  id: number;
  name: string;
  width: number;
  height: number;
  /** grid[row][col] */
  grid: CellKind[][];
  start: { x: number; y: number };
  gemCount: number;
  maxMoves?: number;
};

const MAP: Record<string, CellKind | "start" | void> = {
  ".": "floor",
  "#": "wall",
  E: "exit",
  G: "gem",
  "@": "start",
};

export function parseLevel(src: LevelSource): ParsedLevel {
  const height = src.rows.length;
  const width = Math.max(...src.rows.map((r) => r.length));
  const grid: CellKind[][] = [];
  let start = { x: 0, y: 0 };
  let gemCount = 0;

  for (let y = 0; y < height; y++) {
    const row = src.rows[y] ?? "";
    const line: CellKind[] = [];
    for (let x = 0; x < width; x++) {
      const ch = row[x] ?? ".";
      const k = MAP[ch];
      if (k === "start") {
        start = { x, y };
        line.push("floor");
      } else if (k) {
        if (k === "gem") gemCount += 1;
        line.push(k);
      } else {
        line.push("floor");
      }
    }
    grid.push(line);
  }

  return {
    id: src.id,
    name: src.name,
    width,
    height,
    grid,
    start,
    gemCount,
    maxMoves: src.maxMoves,
  };
}
