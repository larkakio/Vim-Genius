import { isAddress } from "viem";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function getCheckInContractAddress(): `0x${string}` | undefined {
  const raw = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS;
  if (!raw || !isAddress(raw)) return undefined;
  return raw;
}

export const BASE_APP_ID =
  process.env.NEXT_PUBLIC_BASE_APP_ID?.trim() ?? "";
