"use client";

import { useState } from "react";
import { formatAddress } from "@/lib/format";
import { base } from "wagmi/chains";
import {
  useAccount,
  useChainId,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { ConnectSheet } from "./ConnectSheet";

export function WalletBar() {
  const [open, setOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const wrong = isConnected && chainId !== base.id;

  return (
    <div className="space-y-2">
      {wrong ? (
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/50 bg-amber-950/30 px-3 py-2 text-xs text-amber-100"
          role="status"
        >
          <span>Wrong network — switch to Base.</span>
          <button
            type="button"
            disabled={isSwitching}
            onClick={() => switchChain({ chainId: base.id })}
            className="rounded-lg bg-amber-500/20 px-3 py-1 font-medium text-amber-200 ring-1 ring-amber-400/40 hover:bg-amber-500/30 disabled:opacity-50"
          >
            {isSwitching ? "Switching…" : "Switch to Base"}
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {isConnected && address ? (
          <>
            <span className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-3 py-1.5 font-mono text-xs text-cyan-100">
              {formatAddress(address)}
            </span>
            <button
              type="button"
              onClick={() => disconnect()}
              className="text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-600/30 to-fuchsia-600/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,255,255,0.25)]"
          >
            Connect wallet
          </button>
        )}
      </div>
      <ConnectSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
