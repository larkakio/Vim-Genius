import { isAddress } from "viem";

const DEFAULT_SITE_URL = "https://vim-genius.vercel.app";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

export function getCheckInContractAddress(): `0x${string}` | undefined {
  const raw = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS;
  if (!raw || !isAddress(raw)) return undefined;
  return raw;
}

/** Base.dev app ID (verification meta tag). Override via NEXT_PUBLIC_BASE_APP_ID on Vercel. */
const DEFAULT_BASE_APP_ID = "69f84161879b4ae3fa1c7139";

export const BASE_APP_ID =
  process.env.NEXT_PUBLIC_BASE_APP_ID?.trim() ?? DEFAULT_BASE_APP_ID;
