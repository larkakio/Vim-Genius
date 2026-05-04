"use client";

import { base } from "wagmi/chains";
import { useConnect } from "wagmi";

export function ConnectSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { connectors, connectAsync, isPending, error } = useConnect();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-t-2xl border border-cyan-500/40 bg-[#0a0f18]/95 p-4 shadow-[0_0_40px_rgba(0,255,255,0.15)] sm:rounded-2xl">
        <h2
          id="connect-title"
          className="font-display text-lg tracking-wide text-cyan-200"
        >
          Connect wallet
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Choose a wallet. You will be prompted for Base (8453) when needed.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {connectors.map((c) => (
            <li key={c.uid}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  void (async () => {
                    try {
                      await connectAsync({ connector: c, chainId: base.id });
                      onClose();
                    } catch {
                      /* user cancelled or error */
                    }
                  })();
                }}
                className="w-full rounded-xl border border-fuchsia-500/30 bg-fuchsia-950/20 px-4 py-3 text-left text-sm font-medium text-fuchsia-100 transition hover:border-fuchsia-400/60 hover:bg-fuchsia-950/40 disabled:opacity-40"
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
        {error ? (
          <p className="mt-2 text-xs text-red-400">{error.message}</p>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-slate-600 py-2 text-sm text-slate-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
