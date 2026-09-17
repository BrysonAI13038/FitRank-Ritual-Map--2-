import { useState } from "react";

type Screen = 1 | 2 | 3;

function PhoneFrame({ screen, total, children }: { screen: Screen; total: number; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center py-10 px-6 font-mono">
      <p className="text-[10px] tracking-widest uppercase text-neutral-400 mb-4">
        Signature Interaction · Low-fi Sketch
      </p>
      <div
        className="relative bg-neutral-50 border-2 border-neutral-400 w-72 rounded-sm overflow-hidden"
        style={{ minHeight: 600 }}
      >
        {/* Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-16 h-1.5 bg-neutral-300 rounded-full" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 px-5 pt-3 pb-0">
          {([1, 2, 3] as Screen[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 border ${screen === s ? "bg-neutral-800 border-neutral-800" : s < screen ? "bg-neutral-400 border-neutral-400" : "bg-white border-neutral-300"}`} />
              {s < total && <div className={`h-px w-6 ${s < screen ? "bg-neutral-400" : "bg-neutral-200"}`} />}
            </div>
          ))}
          <p className="text-[8px] text-neutral-400 ml-1 uppercase tracking-widest">Step {screen} of 3</p>
        </div>

        <div className="px-5 pt-4 pb-8">{children}</div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">{children}</p>;
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-dashed border-neutral-300 pb-2 mb-4">
      <p className="text-[9px] uppercase tracking-widest text-neutral-400">{children}</p>
    </div>
  );
}

// ── Screen 1: Log ────────────────────────────────────────────────
function Screen1({ onNext }: { onNext: () => void }) {
  const [weight, setWeight] = useState("195");
  const [reps, setReps] = useState("8");

  return (
    <PhoneFrame screen={1} total={3}>
      <SectionDivider>FitRank · Log Workout</SectionDivider>

      {/* Exercise locked for this flow */}
      <div className="border border-neutral-300 p-3 mb-4">
        <Label>Exercise</Label>
        <p className="text-sm font-semibold text-neutral-800">Bench Press</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-neutral-400 p-3">
          <Label>Weight (lbs)</Label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-neutral-800 outline-none"
          />
        </div>
        <div className="border border-neutral-400 p-3">
          <Label>Reps</Label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-neutral-800 outline-none"
          />
        </div>
      </div>

      {/* Previous best — visible before submitting */}
      <div className="border border-dashed border-neutral-300 p-3 mb-6">
        <Label>Your previous best</Label>
        <div className="flex justify-between items-baseline mt-1">
          <span className="text-xs text-neutral-500">185 lbs · 8 reps</span>
          <span className="text-[9px] text-neutral-400">Sep 14</span>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full border border-neutral-700 text-xs py-2.5 tracking-wide text-neutral-800 hover:bg-neutral-100 transition-colors"
      >
        Submit workout →
      </button>
    </PhoneFrame>
  );
}

// ── Screen 2: Comparison ─────────────────────────────────────────
function Screen2({ onNext }: { onNext: () => void }) {
  return (
    <PhoneFrame screen={2} total={3}>
      <SectionDivider>FitRank · Comparing</SectionDivider>

      <p className="text-xs font-semibold text-neutral-800 mb-4 leading-snug">
        Here's how today stacks up against your last session.
      </p>

      {/* Side-by-side comparison */}
      <div className="border border-neutral-400 mb-4 overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-3 border-b border-neutral-400 bg-neutral-100">
          <div className="px-3 py-2">
            <p className="text-[8px] uppercase tracking-widest text-neutral-400">Metric</p>
          </div>
          <div className="px-3 py-2 border-l border-neutral-400">
            <p className="text-[8px] uppercase tracking-widest text-neutral-400">Last time</p>
            <p className="text-[8px] text-neutral-400">Sep 14</p>
          </div>
          <div className="px-3 py-2 border-l border-neutral-400">
            <p className="text-[8px] uppercase tracking-widest text-neutral-500 font-semibold">Today</p>
            <p className="text-[8px] text-neutral-400">Sep 16</p>
          </div>
        </div>

        {/* Weight row */}
        <div className="grid grid-cols-3 border-b border-neutral-200">
          <div className="px-3 py-2.5">
            <p className="text-[9px] text-neutral-500">Weight</p>
          </div>
          <div className="px-3 py-2.5 border-l border-neutral-200">
            <p className="text-xs text-neutral-500">185 lbs</p>
          </div>
          <div className="px-3 py-2.5 border-l border-neutral-200 flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-800">195 lbs</p>
            <p className="text-[9px] font-semibold text-neutral-700">+10</p>
          </div>
        </div>

        {/* Reps row */}
        <div className="grid grid-cols-3">
          <div className="px-3 py-2.5">
            <p className="text-[9px] text-neutral-500">Reps</p>
          </div>
          <div className="px-3 py-2.5 border-l border-neutral-200">
            <p className="text-xs text-neutral-500">8</p>
          </div>
          <div className="px-3 py-2.5 border-l border-neutral-200 flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-800">8</p>
            <p className="text-[9px] text-neutral-400">same</p>
          </div>
        </div>
      </div>

      {/* Improvement callout */}
      <div className="border border-neutral-800 p-3 mb-4">
        <Label>Improvement detected</Label>
        <p className="text-sm font-semibold text-neutral-800 mt-0.5">+10 lbs on Bench Press</p>
        <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
          Weight increased from 185 → 195 lbs at the same rep count.
        </p>
      </div>

      {/* No-shame note for flat/regression cases */}
      <div className="border border-dashed border-neutral-300 p-3 mb-5">
        <p className="text-[9px] text-neutral-400 leading-relaxed">
          <span className="text-neutral-500 font-semibold">Note:</span> ELO is awarded for completing a workout. Improvement adds a bonus — but showing up always counts.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full border border-neutral-700 text-xs py-2.5 tracking-wide text-neutral-800 hover:bg-neutral-100 transition-colors"
      >
        See your ELO →
      </button>
    </PhoneFrame>
  );
}

// ── Screen 3: ELO Award ──────────────────────────────────────────
function Screen3({ onReset }: { onReset: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const eloBase = 12;
  const eloBonus = 8;
  const eloTotal = eloBase + eloBonus;
  const eloBefore = 1240;
  const eloAfter = eloBefore + eloTotal;
  const rankMin = 1200;
  const rankMax = 1300;
  const pctBefore = ((eloBefore - rankMin) / (rankMax - rankMin)) * 100;
  const pctAfter = Math.min(((eloAfter - rankMin) / (rankMax - rankMin)) * 100, 100);

  return (
    <PhoneFrame screen={3} total={3}>
      <SectionDivider>FitRank · ELO Awarded</SectionDivider>

      {/* Main ELO number — the moment */}
      <div className="border border-neutral-800 p-4 mb-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <Label>ELO earned</Label>
            <p className="text-4xl font-semibold text-neutral-900 leading-none tracking-tight">
              +{eloTotal}
            </p>
          </div>
          <div className="text-right">
            <Label>New total</Label>
            <div className="flex items-baseline gap-1.5">
              <p className="text-sm text-neutral-400 line-through">{eloBefore.toLocaleString()}</p>
              <p className="text-xl font-semibold text-neutral-900">{eloAfter.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Progress bar — moving */}
        <div className="mb-1">
          <div className="flex justify-between mb-1">
            <p className="text-[8px] text-neutral-500">Silver II</p>
            <p className="text-[8px] text-neutral-500">Gold I</p>
          </div>
          <div className="relative border border-neutral-400 h-3 w-full bg-white">
            {/* Before marker */}
            <div
              className="absolute top-0 bottom-0 bg-neutral-300"
              style={{ width: `${pctBefore}%` }}
            />
            {/* After fill */}
            <div
              className="absolute top-0 bottom-0 bg-neutral-800"
              style={{ width: `${pctAfter}%` }}
            />
            {/* Seam tick */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white"
              style={{ left: `${pctBefore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-[8px] text-neutral-400">{eloBefore} before</p>
            <p className="text-[8px] font-semibold text-neutral-700">{eloAfter} now · 42 to Gold I</p>
          </div>
        </div>
      </div>

      {/* The seam — how ELO was calculated */}
      <div className="border border-neutral-400 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-neutral-100 transition-colors"
        >
          <p className="text-[9px] uppercase tracking-widest text-neutral-500">How this was calculated</p>
          <p className="text-[9px] text-neutral-400">{expanded ? "▲" : "▼"}</p>
        </button>
        {expanded && (
          <div className="border-t border-neutral-300 px-3 pb-3 pt-2 space-y-2">
            <div className="flex justify-between items-baseline py-1.5 border-b border-neutral-200">
              <div>
                <p className="text-[10px] text-neutral-700">Workout completed</p>
                <p className="text-[8px] text-neutral-400">Base ELO — awarded for showing up</p>
              </div>
              <p className="text-xs font-semibold text-neutral-800">+{eloBase}</p>
            </div>
            <div className="flex justify-between items-baseline py-1.5 border-b border-neutral-200">
              <div>
                <p className="text-[10px] text-neutral-700">Improvement bonus</p>
                <p className="text-[8px] text-neutral-400">+10 lbs vs. last Bench Press session</p>
              </div>
              <p className="text-xs font-semibold text-neutral-800">+{eloBonus}</p>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <p className="text-[10px] font-semibold text-neutral-700">Total ELO earned</p>
              <p className="text-xs font-semibold text-neutral-800">+{eloTotal}</p>
            </div>
            <div className="border-t border-dashed border-neutral-300 pt-2 mt-1">
              <p className="text-[9px] text-neutral-400 leading-relaxed">
                ELO is calculated from two signals: <span className="text-neutral-600">workout completion</span> and <span className="text-neutral-600">improvement compared to your previous session</span> on the same exercise. No ELO is deducted for flat or down sessions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rank status */}
      <div className="border border-dashed border-neutral-300 p-3 mb-5">
        <div className="flex items-baseline justify-between">
          <Label>Current rank</Label>
          <p className="text-[9px] text-neutral-400">no change</p>
        </div>
        <p className="text-sm font-semibold text-neutral-800 mt-0.5">Silver II</p>
        <p className="text-[9px] text-neutral-400 mt-1">42 ELO until Gold I. Keep going.</p>
      </div>

      <button
        onClick={onReset}
        className="w-full border border-neutral-300 text-xs py-2.5 tracking-wide text-neutral-500 hover:border-neutral-500 hover:text-neutral-700 transition-colors"
      >
        ← Back to start
      </button>
    </PhoneFrame>
  );
}

// ── Root ─────────────────────────────────────────────────────────
export default function SignatureInteraction() {
  const [screen, setScreen] = useState<Screen>(1);

  return (
    <>
      {screen === 1 && <Screen1 onNext={() => setScreen(2)} />}
      {screen === 2 && <Screen2 onNext={() => setScreen(3)} />}
      {screen === 3 && <Screen3 onReset={() => setScreen(1)} />}
    </>
  );
}
