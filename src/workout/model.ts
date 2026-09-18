export const exercises = [
  { id: "bench-press", name: "Bench Press", group: "Chest" },
  { id: "squat", name: "Squat", group: "Legs" },
  { id: "deadlift", name: "Deadlift", group: "Posterior chain" },
  { id: "row", name: "Dumbbell Row", group: "Back" },
  { id: "overhead-press", name: "Overhead Press", group: "Shoulders" },
  { id: "biceps-curl", name: "Biceps Curl", group: "Arms" },
  { id: "crunch", name: "Crunch", group: "Core" },
];
export type SetInput = { weight: string; reps: string };
export type Workout = { exerciseId: string; sets: { weightLbs: number; reps: number }[] };
export type WorkoutErrors = { exercise?: string; sets?: string; rows: { weight?: string; reps?: string }[] };
export type ProcessResult = { ok: true; workout: Workout } | { ok: false; errors: WorkoutErrors };

// Prototype input bounds, not training recommendations. Adjust with the exercise catalog.
export const MAX_SETS = 20;
export const MAX_REPS = 100;
export const WEIGHT_LIMITS: Record<string, number> = {
  "bench-press": 500, squat: 700, deadlift: 800, row: 200,
  "overhead-press": 300, "biceps-curl": 150, crunch: 100,
};

// Pure input processing; deliberately independent of UI, storage, and scoring.
export function processWorkout(exerciseId: string, sets: SetInput[]): ProcessResult {
  const errors: WorkoutErrors = { rows: [] };
  if (!exercises.some(exercise => exercise.id === exerciseId)) errors.exercise = "Select an exercise from the list.";
  if (sets.length > MAX_SETS) errors.sets = `Use at most ${MAX_SETS} sets per exercise.`;
  if (!sets.length) errors.sets = "Add at least one set.";
  errors.rows = sets.map(set => {
    const row: WorkoutErrors["rows"][number] = {};
    if (!/^\d+(\.\d+)?$/.test(set.weight.trim()) || !Number.isFinite(Number(set.weight)) || Number(set.weight) < 0 || Number(set.weight) > (WEIGHT_LIMITS[exerciseId] ?? 0)) row.weight = `Enter a weight from 0 to ${WEIGHT_LIMITS[exerciseId] ?? 0} lbs.`;
    if (!/^\d+$/.test(set.reps.trim()) || !Number.isSafeInteger(Number(set.reps)) || Number(set.reps) < 1 || Number(set.reps) > MAX_REPS) row.reps = `Enter a whole number from 1 to ${MAX_REPS} reps.`;
    return row;
  });
  if (errors.exercise || errors.sets || errors.rows.some(row => row.weight || row.reps)) return { ok: false, errors };
  return { ok: true, workout: { exerciseId, sets: sets.map(set => ({ weightLbs: Number(set.weight), reps: Number(set.reps) })) } };
}
