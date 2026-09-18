import { processWorkout, type Workout } from "./model";
import { scoreWorkout } from "./scoring";

const KEY = "fitrank.workouts.v1";
export type SavedWorkout = { id: string; completedAt: string; exercises: Workout[]; earned: number };
export type SavedData = { version: 1; workouts: SavedWorkout[]; elo: number };
export type Reward = { workoutCount: number; before: number; after: number; earned: number; workout: SavedWorkout };

// One versioned document commits workout history and ELO together. Never silently
// overwrite malformed data. Storage errors leave the form intact for retry.
export function loadData(storage: Pick<Storage, "getItem"> = localStorage): SavedData {
  const raw = storage.getItem(KEY);
  if (!raw) return { version: 1, workouts: [], elo: 0 };
  try {
    const data = JSON.parse(raw) as SavedData;
    if (data.version !== 1 || !Array.isArray(data.workouts) || !Number.isSafeInteger(data.elo) || data.elo < 0) throw new Error();
    const ids = new Set<string>();
    let total = 0;
    for (const workout of data.workouts) {
      if (typeof workout.id !== "string" || ids.has(workout.id) || typeof workout.completedAt !== "string" || !Number.isFinite(Date.parse(workout.completedAt)) || !Array.isArray(workout.exercises) || !workout.exercises.length || workout.exercises.length > 7 || new Set(workout.exercises.map(ex => ex.exerciseId)).size !== workout.exercises.length || !Number.isSafeInteger(workout.earned) || workout.earned < 0 || workout.earned > 108) throw new Error();
      for (const ex of workout.exercises) {
        if (!Array.isArray(ex.sets) || ex.sets.some(set => typeof set.weightLbs !== "number" || typeof set.reps !== "number") || !processWorkout(ex.exerciseId, ex.sets.map(set => ({ weight: String(set.weightLbs), reps: String(set.reps) }))).ok) throw new Error();
      }
      ids.add(workout.id);
      total += workout.earned;
    }
    if (total !== data.elo) throw new Error();
    return data;
  } catch {
    throw new Error("Saved workout data could not be read. Nothing was overwritten.");
  }
}
export function saveWorkout(exercises: Workout[], id: string, storage: Pick<Storage, "getItem" | "setItem"> = localStorage): Reward {
  const data = loadData(storage);
  const existingIndex = data.workouts.findIndex(workout => workout.id === id);
  if (existingIndex >= 0) {
    const workout = data.workouts[existingIndex];
    const before = data.workouts.slice(0, existingIndex).reduce((sum, item) => sum + item.earned, 0);
    return { workoutCount: existingIndex + 1, workout, before, after: before + workout.earned, earned: workout.earned };
  }
  const earned = scoreWorkout(exercises, data.workouts);
  const after = data.elo + earned;
  if (!Number.isSafeInteger(after)) throw new Error("ELO total is outside the supported range.");
  const workout: SavedWorkout = { id, completedAt: new Date().toISOString(), exercises, earned };
  storage.setItem(KEY, JSON.stringify({ version: 1, workouts: [...data.workouts, workout], elo: after } satisfies SavedData));
  return { workoutCount: data.workouts.length + 1, workout, before: data.elo, after, earned };
}
