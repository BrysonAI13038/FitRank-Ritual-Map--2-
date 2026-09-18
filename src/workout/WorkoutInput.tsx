import { useId, useState } from "react";
import { exercises, processWorkout, type SetInput, type Workout, type WorkoutErrors } from "./model";

const field = "w-full rounded-[1px] border border-[#26262b] bg-[#161618] px-3 py-2.5 text-sm text-[#f4f4f5] outline-none focus:border-[#f59e0b]";
const primary = "w-full rounded-[1px] bg-[#f59e0b] px-3 py-3 text-[13px] font-semibold text-black hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b] cursor-pointer";
const secondary = "w-full rounded-[1px] border border-[#3f3f46] px-3 py-3 text-xs text-[#a1a1aa] hover:text-white focus-visible:outline-2 focus-visible:outline-[#f59e0b] cursor-pointer";

export default function WorkoutInput({ onSubmit, onCancel }: { onSubmit: (workout: Workout) => void; onCancel: () => void }) {
  const prefix = useId();
  const [query, setQuery] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState<(SetInput & { id: number })[]>([{ id: 0, weight: "", reps: "" }]);
  const [nextId, setNextId] = useState(1);
  const [errors, setErrors] = useState<WorkoutErrors>({ rows: [] });
  const results = exercises.filter(ex => `${ex.name} ${ex.group}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = exercises.find(ex => ex.id === exerciseId);
  return <form noValidate onSubmit={event => {
    event.preventDefault();
    const result = processWorkout(exerciseId, sets);
    if (result.ok) onSubmit(result.workout);
    else setErrors(result.errors);
  }}>
    <label htmlFor={`${prefix}-search`} className="mb-2 block text-[10px] uppercase tracking-widest text-[#a1a1aa]">Find an exercise</label>
    <input id={`${prefix}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Exercise or muscle group" className={field} />
    <fieldset className="my-3 max-h-48 overflow-y-auto rounded-[2px] border border-[#26262b] p-2" aria-describedby={errors.exercise ? `${prefix}-exercise-error` : undefined}>
      <legend className="sr-only">Select an exercise</legend>
      {results.map(ex => <label key={ex.id} className={`flex cursor-pointer items-center gap-2 rounded-[1px] px-2 py-2 text-xs ${exerciseId === ex.id ? "bg-[#f59e0b]/10 text-[#f59e0b]" : "text-[#a1a1aa]"}`}>
        <input type="radio" name={`${prefix}-exercise`} value={ex.id} checked={exerciseId === ex.id} onChange={() => setExerciseId(ex.id)} className="accent-[#f59e0b]" />
        <span>{ex.name}<span className="mt-0.5 block text-[9px] text-[#a1a1aa]">{ex.group}</span></span>
      </label>)}
      {!results.length && <p className="p-2 text-xs text-[#a1a1aa]">No matches. Try another exercise or muscle group.</p>}
    </fieldset>
    {errors.exercise && <p id={`${prefix}-exercise-error`} role="alert" className="mb-3 text-xs text-[#f59e0b]">{errors.exercise}</p>}
    {selected && <p className="mb-4 text-xs text-[#f59e0b]">Selected: {selected.name}</p>}
    <p className="mb-3 text-[11px] leading-relaxed text-[#a1a1aa]">Add sets for this exercise. Use 0 lbs for bodyweight sets.</p>
    <div className="space-y-3">{sets.map((set, index) => <fieldset key={set.id} className="rounded-[2px] border border-[#26262b] bg-[#161618] p-3">
      <legend className="px-1 text-[10px] uppercase tracking-widest text-[#a1a1aa]">Set {index + 1}</legend>
      <div className="grid grid-cols-2 gap-3">{(["weight", "reps"] as const).map(key => {
        const error = errors.rows[index]?.[key];
        const id = `${prefix}-${set.id}-${key}`;
        return <div key={key}><label htmlFor={id} className="mb-2 block text-[10px] text-[#a1a1aa]">{key === "weight" ? "Weight (lbs)" : "Reps"}</label>
          <input id={id} type="number" min={key === "weight" ? 0 : 1} step={key === "weight" ? "any" : 1} inputMode={key === "weight" ? "decimal" : "numeric"} value={set[key]} required aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} onChange={event => setSets(current => current.map(row => row.id === set.id ? { ...row, [key]: event.target.value } : row))} className={field} />
          {error && <p id={`${id}-error`} role="alert" className="mt-2 text-[10px] text-[#f59e0b]">{error}</p>}
        </div>;
      })}</div>
      {sets.length > 1 && <button type="button" aria-label={`Remove set ${index + 1}`} onClick={() => { setSets(current => current.filter(row => row.id !== set.id)); setErrors({ rows: [] }); }} className="mt-3 text-[11px] text-[#a1a1aa] underline cursor-pointer">Remove set</button>}
    </fieldset>)}</div>
    {errors.sets && <p role="alert" className="mt-3 text-xs text-[#f59e0b]">{errors.sets}</p>}
    <div className="mt-4 space-y-3">
      <button type="button" className={secondary} onClick={() => { setSets(current => [...current, { id: nextId, weight: "", reps: "" }]); setNextId(nextId + 1); }}>+ Add set</button>
      <button type="submit" className={primary}>Submit workout →</button>
      <button type="button" className={secondary} onClick={onCancel}>← Back</button>
    </div>
  </form>;
}
