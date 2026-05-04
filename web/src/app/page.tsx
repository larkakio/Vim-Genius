import { CheckInPanel } from "@/components/checkin/CheckInPanel";
import { VimGeniusGame } from "@/components/game/VimGeniusGame";
import { WalletBar } from "@/components/wallet/WalletBar";

export default function Home() {
  return (
    <main className="relative z-[1] mx-auto flex max-w-lg flex-col gap-6 px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
      <VimGeniusGame />

      <section className="space-y-3 rounded-2xl border border-violet-500/25 bg-slate-950/50 p-4 backdrop-blur-md">
        <h2 className="font-display text-sm tracking-widest text-violet-200/90">
          ONCHAIN
        </h2>
        <WalletBar />
        <CheckInPanel />
      </section>
    </main>
  );
}
