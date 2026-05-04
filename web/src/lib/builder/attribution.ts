import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";

/** Builder code suffix for check-in tx (ERC-8021). */
export function getCheckInDataSuffix(): Hex | undefined {
  const override = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (override?.startsWith("0x") && override.length > 2) {
    return override as Hex;
  }
  const code = process.env.NEXT_PUBLIC_BUILDER_CODE;
  if (!code?.trim()) return undefined;
  return Attribution.toDataSuffix({ codes: [code.trim()] });
}
