"use client";

import { useCallback, useRef } from "react";
import type { ParsedLevel } from "./parseLevel";

const MIN_SWIPE = 40;

type Dir = "h" | "j" | "k" | "l";

function dirFromDelta(dx: number, dy: number): Dir | null {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < MIN_SWIPE && ay < MIN_SWIPE) return null;
  if (ax > ay) return dx > 0 ? "l" : "h";
  return dy > 0 ? "j" : "k";
}

export function GameBoard({
  level,
  cursor,
  gemsCollected,
  onMove,
  shake,
  disabled,
}: {
  level: ParsedLevel;
  cursor: { x: number; y: number };
  gemsCollected: Set<string>;
  onMove: (d: Dir) => void;
  shake: number;
  disabled: boolean;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      start.current = { x: e.clientX, y: e.clientY };
    },
    [disabled],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !start.current) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      start.current = null;
      const d = dirFromDelta(dx, dy);
      if (d) onMove(d);
    },
    [disabled, onMove],
  );

  const onPointerCancel = useCallback(() => {
    start.current = null;
  }, []);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[min(100%,420px)] touch-none select-none rounded-2xl border-2 border-cyan-500/30 bg-[#050810]/90 p-1 shadow-[0_0_60px_rgba(168,85,247,0.12),inset_0_0_80px_rgba(6,182,212,0.06)]"
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        key={shake}
        className={`grid h-full w-full gap-0.5 rounded-xl p-0.5 ${shake ? "animate-board-shake" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${level.height}, minmax(0, 1fr))`,
        }}
      >
        {level.grid.flatMap((row, y) =>
          row.map((cell, x) => {
            const isCursor = cursor.x === x && cursor.y === y;
            const k = `${x},${y}`;
            const gemHere = cell === "gem" && !gemsCollected.has(k);
            const ch = cell === "wall" ? "#" : cell === "exit" ? "E" : gemHere ? "◆" : "·";
            return (
              <div
                key={k}
                className={`relative flex min-h-[28px] items-center justify-center rounded-md border text-[10px] font-mono sm:min-h-[32px] sm:text-xs ${
                  cell === "wall"
                    ? "border-slate-700 bg-slate-900/90 text-slate-600"
                    : cell === "exit"
                      ? "border-emerald-400/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                      : gemHere
                        ? "border-fuchsia-400/60 bg-fuchsia-950/50 text-fuchsia-200 shadow-[0_0_14px_rgba(232,121,249,0.35)]"
                        : "border-cyan-500/15 bg-slate-950/40 text-slate-600"
                } ${isCursor ? "z-10 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#050810]" : ""}`}
              >
                {!isCursor ? (
                  <span className="opacity-80">{ch}</span>
                ) : (
                  <span
                    className="animate-cursor-pulse text-sm text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                    aria-label="cursor"
                  >
                    ▶
                  </span>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
