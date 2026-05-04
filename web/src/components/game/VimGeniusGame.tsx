"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LEVEL_SOURCES } from "./levels";
import { parseLevel, type ParsedLevel } from "./parseLevel";
import { GameBoard } from "./GameBoard";

const STORAGE_KEY = "vim-genius-progress-v1";

type Progress = { unlockedIndex: number };

function loadProgress(): Progress {
  if (typeof window === "undefined") return { unlockedIndex: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedIndex: 0 };
    const p = JSON.parse(raw) as Progress;
    if (typeof p.unlockedIndex !== "number" || p.unlockedIndex < 0)
      return { unlockedIndex: 0 };
    return {
      unlockedIndex: Math.min(
        p.unlockedIndex,
        LEVEL_SOURCES.length - 1,
      ),
    };
  } catch {
    return { unlockedIndex: 0 };
  }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

type Dir = "h" | "j" | "k" | "l";

function keyFor(x: number, y: number) {
  return `${x},${y}`;
}

export function VimGeniusGame() {
  const levels = useMemo(
    () => LEVEL_SOURCES.map((s) => parseLevel(s)),
    [],
  );
  const [levelIndex, setLevelIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [gems, setGems] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [shake, setShake] = useState(0);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level: ParsedLevel = levels[levelIndex] ?? levels[0];

  useEffect(() => {
    const p = loadProgress();
    setUnlockedIndex(p.unlockedIndex);
    setLevelIndex((i) => Math.min(i, p.unlockedIndex));
  }, []);

  useEffect(() => {
    const l = levels[levelIndex] ?? levels[0];
    setCursor(l.start);
    setGems(new Set());
    setMoves(0);
    setStatus("playing");
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, [levelIndex, levels]);

  const tryMove = useCallback(
    (dir: Dir) => {
      if (status !== "playing") return;
      const l = levels[levelIndex] ?? levels[0];
      let nx = cursor.x;
      let ny = cursor.y;
      if (dir === "h") nx -= 1;
      if (dir === "l") nx += 1;
      if (dir === "k") ny -= 1;
      if (dir === "j") ny += 1;

      if (nx < 0 || ny < 0 || nx >= l.width || ny >= l.height) {
        setShake((s) => s + 1);
        return;
      }
      const cell = l.grid[ny]?.[nx];
      if (!cell || cell === "wall") {
        setShake((s) => s + 1);
        return;
      }

      const nextMoves = moves + 1;
      const nextGems = new Set(gems);
      if (cell === "gem") nextGems.add(keyFor(nx, ny));

      const allShardsCollected = nextGems.size === l.gemCount;
      const steppedOnExit = cell === "exit";
      const won = steppedOnExit && allShardsCollected;

      setCursor({ x: nx, y: ny });
      setGems(nextGems);
      setMoves(nextMoves);

      if (won) {
        setStatus("won");
        const nextUnlocked = Math.max(unlockedIndex, levelIndex + 1);
        const capped = Math.min(nextUnlocked, levels.length - 1);
        setUnlockedIndex(capped);
        saveProgress({ unlockedIndex: capped });
        advanceTimer.current = setTimeout(() => {
          if (levelIndex < levels.length - 1) {
            setLevelIndex((i) => i + 1);
          }
        }, 1600);
        return;
      }

      if (l.maxMoves && nextMoves > l.maxMoves) {
        setStatus("lost");
      }
    },
    [cursor.x, cursor.y, gems, levelIndex, levels, moves, status, unlockedIndex],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (status !== "playing") return;
      const k = e.key.toLowerCase();
      const map: Record<string, Dir> = {
        h: "h",
        j: "j",
        k: "k",
        l: "l",
        arrowleft: "h",
        arrowdown: "j",
        arrowup: "k",
        arrowright: "l",
      };
      const d = map[k];
      if (d) {
        e.preventDefault();
        tryMove(d);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, tryMove]);

  function goNext() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (levelIndex < levels.length - 1) setLevelIndex((i) => i + 1);
  }

  function retry() {
    const l = levels[levelIndex] ?? levels[0];
    setCursor(l.start);
    setGems(new Set());
    setMoves(0);
    setStatus("playing");
  }

  return (
    <div className="flex flex-col gap-3">
      <header className="flex flex-wrap items-end justify-between gap-2 border-b border-cyan-500/25 pb-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-500/80">
            Vim Genius
          </p>
          <h1
            className="font-display text-xl text-transparent sm:text-2xl"
            style={{
              backgroundImage:
                "linear-gradient(90deg,#22d3ee,#e879f9,#a78bfa,#22d3ee)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
            data-testid="level-title"
          >
            {level.name}
          </h1>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <div>
            Sector{" "}
            <span className="text-fuchsia-300">{levelIndex + 1}</span> /{" "}
            {levels.length}
          </div>
          <div>
            Moves{" "}
            <span className="text-cyan-200">
              {moves}
              {level.maxMoves ? ` / ${level.maxMoves}` : ""}
            </span>
          </div>
          {level.gemCount > 0 ? (
            <div>
              Data shards{" "}
              <span className="text-emerald-300">
                {gems.size}/{level.gemCount}
              </span>
            </div>
          ) : null}
        </div>
      </header>

      <GameBoard
        level={level}
        cursor={cursor}
        gemsCollected={gems}
        onMove={tryMove}
        shake={shake}
        disabled={status !== "playing"}
      />

      <p className="text-center font-mono text-[10px] text-slate-500">
        Swipe on the grid — hjkl / arrows / pad
      </p>

      <div className="grid grid-cols-3 gap-1 sm:mx-auto sm:max-w-xs">
        <span />
        <MovePad label="k / ↑" dir="k" onMove={tryMove} disabled={status !== "playing"} />
        <span />
        <MovePad label="h / ←" dir="h" onMove={tryMove} disabled={status !== "playing"} />
        <MovePad label="j / ↓" dir="j" onMove={tryMove} disabled={status !== "playing"} />
        <MovePad label="l / →" dir="l" onMove={tryMove} disabled={status !== "playing"} />
      </div>

      {status === "won" ? (
        <div
          className="rounded-xl border border-emerald-400/40 bg-emerald-950/30 p-4 text-center"
          role="status"
          data-testid="level-complete"
        >
          <p className="font-display text-lg text-emerald-300">Sector cleared</p>
          <p className="mt-1 text-xs text-slate-400">
            {levelIndex < levels.length - 1
              ? "Loading next sector…"
              : "All sectors cleared. Legendary."}
          </p>
          {levelIndex < levels.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="mt-3 rounded-lg border border-emerald-400/50 px-4 py-2 text-sm text-emerald-200"
            >
              Next sector
            </button>
          ) : null}
        </div>
      ) : null}

      {status === "lost" ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-center">
          <p className="font-display text-lg text-rose-300">Buffer overflow</p>
          <p className="mt-1 text-xs text-slate-400">Move limit reached.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-3 rounded-lg border border-rose-400/50 px-4 py-2 text-sm text-rose-200"
          >
            Retry sector
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-2">
        {levels.map((_, i) => (
          <button
            key={LEVEL_SOURCES[i]?.id ?? i}
            type="button"
            disabled={i > unlockedIndex}
            onClick={() => setLevelIndex(i)}
            className={`h-8 min-w-8 rounded-md border px-2 font-mono text-xs ${
              i === levelIndex
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-100"
                : i <= unlockedIndex
                  ? "border-slate-600 text-slate-300 hover:border-slate-500"
                  : "cursor-not-allowed border-slate-800 text-slate-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function MovePad({
  label,
  dir,
  onMove,
  disabled,
}: {
  label: string;
  dir: Dir;
  onMove: (d: Dir) => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-testid={`move-${dir}`}
      onClick={() => onMove(dir)}
      className="rounded-lg border border-cyan-500/30 bg-slate-900/60 py-2 font-mono text-[10px] text-cyan-200/90 hover:border-cyan-400/50 disabled:opacity-30"
    >
      {label}
    </button>
  );
}
