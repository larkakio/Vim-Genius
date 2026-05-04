# Vim Genius

Mobile-first Vim grid puzzle on **Base** with daily on-chain check-in and **Builder Code** (ERC-8021) attribution via `ox`.

## Layout

- **`contracts/`** — Foundry: `CheckIn.sol` (one check-in per UTC day, `msg.value` must be zero, streak).
- **`web/`** — Next.js App Router (Vercel **Root Directory = `web`**).

## Quick start

```bash
cd contracts && forge test
cd ../web && cp .env.example .env.local
# Fill NEXT_PUBLIC_* then:
npm run dev
```

Production app URL: **`https://vim-genius.vercel.app`** (Vercel Root Directory **`web`**).

Deploy the contract to Base mainnet, set `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS`, register the app on [base.dev](https://www.base.dev), and set `NEXT_PUBLIC_BASE_APP_ID` and `NEXT_PUBLIC_BUILDER_CODE` on Vercel (see [`web/.env.example`](web/.env.example)).

## Environment

See [`web/.env.example`](web/.env.example).

## Checks

```bash
cd contracts && forge test
cd ../web && npm run typecheck && npm run build && npm run test:e2e
```

Store assets in `web/public/`: `app-icon.jpg` (1024×1024, under 1MB) and `app-thumbnail.jpg` (1.91∶1, under 1MB) for Base.dev.
