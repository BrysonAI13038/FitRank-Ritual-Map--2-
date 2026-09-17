import { useState } from "react";

type Screen = 1 | 2 | 3;
type Workout = { weight: number; reps: number };
const previous: Workout = { weight: 185, reps: 8 };
const heading = { fontFamily: "Barlow Condensed, sans-serif" };
const card = "rounded-[2px] border border-[#26262b] bg-[#161618] p-4";
const accentCard = "rounded-[2px] border border-[#f59e0b]/25 bg-[#f59e0b]/5 p-4";
const primary = "w-full rounded-[1px] bg-[#f59e0b] px-3 py-3 text-[13px] font-semibold tracking-wide text-black transition-colors hover:bg-[#e4930a] cursor-pointer disabled:cursor-default disabled:bg-[#26262b] disabled:text-[#71717a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e0b]";
const secondary = "w-full rounded-[1px] border border-[#3f3f46] px-3 py-3 text-[13px] text-[#a1a1aa] transition-colors hover:border-[#71717a] hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e0b]";

function improved(workout: Workout) {
  return workout.weight >= previous.weight && workout.reps >= previous.reps &&
    (workout.weight > previous.weight || workout.reps > previous.reps);
}

function PhoneFrame({ screen, children }: { screen: Screen; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f5] px-6 py-10" style={{ fontFamily: "Inter, sans-serif" }}>
      <p className="mb-4 text-[10px] uppercase tracking-[0.14em] text-[#a1a1aa]">Signature Interaction</p>
      <div className="w-72 overflow-hidden rounded-[2px] bg-[#0c0c0e] text-[#f4f4f5] shadow-[0_8px_40px_rgba(0,0,0,0.45)]" style={{ colorScheme: "dark" }}>
        <div className="flex justify-center pt-3 pb-2"><div className="h-[5px] w-[60px] rounded-full bg-[#26262b]" /></div>
        <div className="px-5 pt-3 pb-9">
          <div className="mb-6 flex items-center justify-between border-b border-[#26262b] pb-4">
            <span className="text-base font-bold tracking-[0.06em]" style={heading}>FITRANK</span>
            <span className="text-[9px] uppercase tracking-widest text-[#a1a1aa]">Step {screen} of 3</span>
          </div>
          <ol className="mb-6 grid grid-cols-3 gap-2" aria-label="Workout progress">
            {["Log", "Compare", "Earn ELO"].map((label, i) => (
              <li key={label} aria-current={screen === i + 1 ? "step" : undefined} className={`border-t-2 pt-2 text-[9px] uppercase tracking-widest ${i < screen ? "border-[#f59e0b] text-[#f59e0b]" : "border-[#26262b] text-[#71717a]"}`}>
                {label}
              </li>
            ))}
          </ol>
          {children}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-[9px] uppercase tracking-[0.12em] text-[#a1a1aa]">{children}</p>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-[28px] font-bold leading-tight tracking-[0.02em]" style={heading}>{children}</h2>;
}

function Screen1({ onNext }: { onNext: (workout: Workout) => void }) {
  const [weight, setWeight] = useState("195");
  const [reps, setReps] = useState("8");
  const valid = weight.trim() !== "" && Number.isFinite(Number(weight)) && Number(weight) > 0 && Number.isInteger(Number(reps)) && Number(reps) > 0;
  return (
    <PhoneFrame screen={1}>
      <Title>Put in the work.</Title>
      <p className="mb-6 text-xs leading-relaxed text-[#a1a1aa]">Log your set. See your progress. Earn your ELO.</p>
      <div className={`${card} mb-4`}><Label>Exercise</Label><p className="text-[24px] font-semibold" style={heading}>Bench Press</p></div>
      <form onSubmit={e => { e.preventDefault(); if (valid) onNext({ weight: Number(weight), reps: Number(reps) }); }}>
        <div className="mb-4 grid grid-cols-2 gap-3">
          {[
            { id: "signature-weight", label: "Weight (lbs)", value: weight, set: setWeight, step: "any" },
            { id: "signature-reps", label: "Reps", value: reps, set: setReps, step: "1" },
          ].map(field => (
            <div key={field.id}>
              <label htmlFor={field.id} className="mb-2 block text-[9px] uppercase tracking-widest text-[#a1a1aa]">{field.label}</label>
              <input id={field.id} type="number" required min={field.step === "1" ? 1 : 0.01} step={field.step} value={field.value} onChange={e => field.set(e.target.value)} className="w-full rounded-[1px] border border-[#26262b] bg-[#161618] px-3 py-3 text-lg outline-none focus:border-[#f59e0b]" />
            </div>
          ))}
        </div>
        <div className={`${card} mb-6`}>
          <Label>Your previous best</Label>
          <div className="mt-2 flex items-baseline justify-between"><span className="text-xs text-[#a1a1aa]">185 lbs · 8 reps</span><span className="text-[9px] text-[#71717a]">Sep 14</span></div>
        </div>
        <button disabled={!valid} className={primary}>Submit workout →</button>
      </form>
    </PhoneFrame>
  );
}

function Screen2({ workout, onNext }: { workout: Workout; onNext: () => void }) {
  const bonus = improved(workout);
  return (
    <PhoneFrame screen={2}>
      <Title>Your work, in perspective.</Title>
      <p className="mb-6 text-xs leading-relaxed text-[#a1a1aa]">Bench Press · Compared with your previous session.</p>
      <div className="mb-4 overflow-hidden rounded-[2px] border border-[#26262b] bg-[#161618]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#26262b] text-[9px] text-[#a1a1aa]"><tr>
            <th className="px-3 py-3 font-normal">Metric</th><th className="px-2 py-3 font-normal">Last time<span className="block text-[8px]">Sep 14</span></th><th className="px-2 py-3 font-normal text-[#f59e0b]">Today<span className="block text-[8px]">Sep 16</span></th>
          </tr></thead>
          <tbody>{([
            { label: "Weight", before: previous.weight, now: workout.weight, unit: " lbs" },
            { label: "Reps", before: previous.reps, now: workout.reps, unit: "" },
          ]).map(row => {
            const delta = row.now - row.before;
            return <tr key={row.label} className="border-b border-[#26262b] last:border-0">
              <th className="px-3 py-3 font-normal text-[#a1a1aa]">{row.label}</th>
              <td className="px-2 py-3 text-[#a1a1aa]">{row.before}{row.unit}</td>
              <td className="px-2 py-3 font-medium">{row.now}{row.unit}<span className={`mt-1 block text-[9px] ${delta > 0 ? "text-[#f59e0b]" : "text-[#a1a1aa]"}`}>{delta === 0 ? "same" : `${delta > 0 ? "+" : ""}${Number(delta.toFixed(2))}${row.unit}`}</span></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <div className={`${accentCard} mb-4`}>
        <Label>{bonus ? "Improvement detected" : "Workout completed"}</Label>
        <p className="text-[22px] font-semibold" style={heading}>{bonus ? "You've raised the bar." : "Showing up still counts."}</p>
        <p className="mt-2 text-xs leading-relaxed text-[#a1a1aa]">{bonus ? "More weight or reps, with neither below your previous session. That's +8 bonus ELO." : "No improvement bonus this time. You still earn +12 ELO for completing your workout."}</p>
      </div>
      <p className="mb-6 text-[11px] leading-relaxed text-[#a1a1aa]">Progress takes more than one session. Completion earns +12 ELO; improvement adds +8. No ELO is deducted for flat or down sessions.</p>
      <button onClick={onNext} className={primary}>See your ELO →</button>
    </PhoneFrame>
  );
}

function Screen3({ workout, onReset }: { workout: Workout; onReset: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const eloBase = 12;
  const eloBonus = improved(workout) ? 8 : 0;
  const eloTotal = eloBase + eloBonus;
  const eloBefore = 1240;
  const eloAfter = eloBefore + eloTotal;
  const remaining = 1300 - eloAfter;
  const pctAfter = eloAfter - 1200;
  return (
    <PhoneFrame screen={3}>
      <Title>Progress, earned.</Title>
      <p className="mb-6 text-xs leading-relaxed text-[#a1a1aa]">{eloBonus ? "A stronger set. A step closer to Gold." : "Another session in the bank. Keep building."}</p>
      <div className="mb-5 rounded-[2px] border border-[#f59e0b]/40 bg-gradient-to-b from-[#f59e0b]/15 to-[#161618] px-4 py-6 shadow-[0_0_32px_rgba(245,158,11,0.08)]">
        <div className="text-center" aria-live="polite">
          <Label>ELO earned</Label>
          <p className="text-[88px] font-bold leading-none tracking-tight text-[#f59e0b]" style={heading}>+{eloTotal}</p>
          <p className="mt-2 text-[11px] text-[#a1a1aa]">+{eloBase} completion <span className="mx-1 text-[#52525b]">/</span> +{eloBonus} improvement</p>
        </div>
        <div className="mt-6 flex items-baseline justify-between border-t border-[#f59e0b]/15 pt-4">
          <Label>New total</Label>
          <p className="text-[28px] font-semibold" style={heading}><span className="mr-2 text-base text-[#71717a] line-through">1,240</span>{eloAfter.toLocaleString()}</p>
        </div>
        <div className="mt-4 flex justify-between text-[9px] text-[#a1a1aa]"><span>Silver II · 1,200</span><span>Gold I · 1,300</span></div>
        <div role="progressbar" aria-label="Progress from Silver II to Gold I" aria-valuemin={1200} aria-valuemax={1300} aria-valuenow={eloAfter} className="relative mt-2 h-2 overflow-hidden rounded-[1px] bg-[#26262b]">
          <div className="absolute inset-y-0 left-0 bg-[#78450a]" style={{ width: "40%" }} />
          <div className="absolute inset-y-0 bg-[#f59e0b] shadow-[0_0_12px_#f59e0b]" style={{ left: "40%", width: `${pctAfter - 40}%` }} />
          <div className="absolute inset-y-0 w-px bg-[#f4f4f5]" style={{ left: "40%" }} />
        </div>
        <div className="mt-2 flex justify-between text-[9px]"><span className="text-[#a1a1aa]">1,240 before</span><span className="text-[#f59e0b]">{remaining} ELO to Gold I</span></div>
      </div>
      <div className="mb-4 rounded-[2px] border border-[#26262b] bg-[#161618]">
        <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="signature-breakdown" className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-[10px] text-[#a1a1aa] hover:text-white focus-visible:outline-2 focus-visible:outline-[#f59e0b]">
          How this was calculated <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
        {expanded && <div id="signature-breakdown" className="border-t border-[#26262b] px-4 pb-4">
          {[
            { label: "Workout completed", detail: "Base ELO — awarded for showing up", value: eloBase },
            { label: "Improvement bonus", detail: eloBonus ? `${workout.weight} lbs × ${workout.reps} reps vs. 185 lbs × 8` : "No bonus this session. No penalty.", value: eloBonus },
            { label: "Total ELO earned", detail: "", value: eloTotal },
          ].map(row => <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-[#26262b] py-3 last:border-0">
            <div><p className="text-[11px]">{row.label}</p>{row.detail && <p className="mt-1 text-[9px] leading-relaxed text-[#a1a1aa]">{row.detail}</p>}</div><span className="text-sm font-semibold text-[#f59e0b]">+{row.value}</span>
          </div>)}
          <p className="border-t border-[#26262b] pt-3 text-[10px] leading-relaxed text-[#a1a1aa]">Improvement means more weight or reps with neither decreasing, compared with your previous session on the same exercise. Flat or down sessions still earn completion ELO.</p>
        </div>}
      </div>
      <div className={`${card} mb-6`}>
        <div className="flex justify-between"><Label>Current rank</Label><span className="text-[9px] text-[#a1a1aa]">no change</span></div>
        <p className="text-[24px] font-semibold" style={heading}>Silver II</p>
        <p className="mt-1 text-[11px] text-[#a1a1aa]">{remaining} ELO until Gold I. Keep going.</p>
      </div>
      <button onClick={onReset} className={secondary}>← Back to start</button>
    </PhoneFrame>
  );
}

export default function SignatureInteraction() {
  const [screen, setScreen] = useState<Screen>(1);
  const [workout, setWorkout] = useState<Workout>({ weight: 195, reps: 8 });
  return <>
    {screen === 1 && <Screen1 onNext={entry => { setWorkout(entry); setScreen(2); }} />}
    {screen === 2 && <Screen2 workout={workout} onNext={() => setScreen(3)} />}
    {screen === 3 && <Screen3 workout={workout} onReset={() => setScreen(1)} />}
  </>;
}
