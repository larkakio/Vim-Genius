"use client";

import { useMemo } from "react";
import { base } from "wagmi/chains";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { checkInAbi } from "@/lib/contracts/checkInAbi";
import { getCheckInDataSuffix } from "@/lib/builder/attribution";
import { getCheckInContractAddress } from "@/lib/env";

const SECONDS_PER_DAY = 86400n;

function utcDayIndex(tsSeconds: bigint): bigint {
  return tsSeconds / SECONDS_PER_DAY;
}

export function CheckInPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contract = getCheckInContractAddress();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const {
    writeContractAsync,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const nowDay = useMemo(
    () => utcDayIndex(BigInt(Math.floor(Date.now() / 1000))),
    [],
  );

  const { data: lastDay, refetch } = useReadContract({
    address: contract,
    abi: checkInAbi,
    functionName: "lastCheckInDay",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: Boolean(isConnected && address && contract),
    },
  });

  const { data: streak } = useReadContract({
    address: contract,
    abi: checkInAbi,
    functionName: "currentStreak",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: Boolean(isConnected && address && contract),
    },
  });

  const alreadyToday =
    lastDay !== undefined && nowDay === (lastDay as bigint);

  const busy = isWriting || isSwitching;

  async function onCheckIn() {
    if (!address || !contract) return;
    resetWrite();
    const baseId = base.id;
    if (chainId !== baseId) {
      await switchChainAsync({ chainId: baseId });
    }
    const dataSuffix = getCheckInDataSuffix();
    await writeContractAsync({
      address: contract,
      abi: checkInAbi,
      functionName: "checkIn",
      args: [],
      chainId: baseId,
      ...(dataSuffix ? { dataSuffix } : {}),
    });
    await refetch();
  }

  if (!contract) {
    return (
      <div className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-3 text-xs text-slate-400">
        Daily check-in is unavailable until{" "}
        <span className="font-mono text-slate-300">
          NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS
        </span>{" "}
        is set.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-violet-500/35 bg-violet-950/15 p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-sm tracking-wide text-violet-200">
          Base check-in
        </h3>
        {typeof streak === "bigint" ? (
          <span className="font-mono text-xs text-violet-300/90">
            Streak: {streak.toString()}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
        Once per UTC day. You only pay L2 gas — no ETH is sent to the contract.
      </p>
      {!isConnected ? (
        <p className="mt-2 text-xs text-slate-500">Connect a wallet to check in.</p>
      ) : alreadyToday ? (
        <p className="mt-2 text-xs text-emerald-400/90">
          You have already checked in today.
        </p>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onCheckIn()}
          className="mt-3 w-full rounded-lg bg-violet-600/80 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] disabled:opacity-40"
        >
          {busy ? "Confirm in wallet…" : "Check in on Base"}
        </button>
      )}
      {writeError ? (
        <p className="mt-2 text-xs text-red-400">{writeError.message}</p>
      ) : null}
    </div>
  );
}
