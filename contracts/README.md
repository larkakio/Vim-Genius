# CheckIn (Foundry)

Deploy to Base mainnet, then set `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` in the Next.js app.

```bash
forge test
forge create src/CheckIn.sol:CheckIn --rpc-url $BASE_RPC --private-key $PK
```

`checkIn()` allows one call per UTC day (`block.timestamp / 86400`), rejects `msg.value != 0`, and tracks a consecutive-day streak.
