import { useEffect, useRef, useState } from "react";
import { rankProgress } from "./scoring";
import type { Reward } from "./storage";
import "./workout-success.css";

const messages = ["Workout logged. Keep building.", "Another session in the books.", "Progress comes from showing up.", "Keep stacking sessions.", "One workout closer.", "Consistency builds strength."];

export default function WorkoutReward({ reward, onBack }: { reward: Reward; onBack: () => void }) {
  const [position, setPosition] = useState(reward.before);
  const focusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    focusRef.current?.focus();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let start: number | null = null;
    const finish = () => { cancelAnimationFrame(frame); setPosition(reward.after); };
    const tick = (time: number) => {
      if (start === null) start = time;
      const progress = Math.min((time - start) / 1100, 1);
      setPosition(reward.before + (reward.after - reward.before) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    if (preference.matches) finish();
    else frame = requestAnimationFrame(tick);
    const onPreference = () => { if (preference.matches) finish(); };
    preference.addEventListener("change", onPreference);
    return () => { cancelAnimationFrame(frame); preference.removeEventListener("change", onPreference); };
  }, [reward]);
  const progress = rankProgress(position);
  const final = rankProgress(reward.after);
  const sets = reward.workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  return <div ref={focusRef} tabIndex={-1} className="focus:outline-none">
    <p className="mb-3 text-xs font-semibold text-[#f59e0b]">✓ Workout saved</p>
    <h3 className="mb-5 text-[24px] font-semibold leading-tight" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{messages[(reward.workoutCount - 1) % messages.length]}</h3>
    <div className="fitrank-workout-success mb-5 rounded-[2px] border border-[#f59e0b]/25 bg-[#161618] px-4 py-6">
      <div className="mb-5 flex items-baseline justify-between gap-2">
        <p className="text-[30px] font-bold" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{progress.rank}</p>
        <span aria-hidden="true" className="fitrank-elo-gain text-lg font-semibold text-[#f59e0b]">+{reward.earned} ELO</span>
      </div>
      <div role="progressbar" aria-label={final.next ? `${final.rank} progress toward ${final.next}` : "Elite rank achieved"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(final.percent)} aria-valuetext={`${reward.after} ELO. ${final.next ? `${final.remaining} ELO to ${final.next}` : "Elite rank achieved"}`} className="h-4 overflow-hidden rounded-[2px] bg-[#26262b]">
        <div className="h-full rounded-[2px] bg-[#f59e0b] shadow-[0_0_16px_rgba(245,158,11,0.3)]" style={{ width: `${progress.percent}%` }} />
      </div>
      <div className="mt-3 flex justify-between gap-2 text-[10px] text-[#a1a1aa]"><span>{reward.after.toLocaleString()} ELO</span><span>{final.next ? `${final.remaining.toLocaleString()} to ${final.next}` : "Elite achieved"}</span></div>
      <p role="status" className="sr-only">Workout saved. Earned {reward.earned} ELO. Current rank: {final.rank}.</p>
    </div>
    <p className="mb-6 text-xs text-[#a1a1aa]">{reward.workout.exercises.length} {reward.workout.exercises.length === 1 ? "exercise" : "exercises"} · {sets} {sets === 1 ? "set" : "sets"} completed</p>
    <button type="button" onClick={onBack} className="w-full cursor-pointer rounded-[1px] bg-[#f59e0b] px-3 py-3 text-[13px] font-semibold text-black hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]">← Back to home</button>
  </div>;
}
