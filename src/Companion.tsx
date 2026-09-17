import { useState } from "react";

type Screen = "home" | "log-workout" | "log-food" | "feedback";

const EXERCISES = ["Bench Press", "Squat", "Deadlift", "Pull-Up", "Row"];

const FEEDBACK_MESSAGES = [
  "You showed up. That's the whole game.",
  "Every set you log is data. Every data point is proof.",
  "You did something today that your future self will thank you for.",
  "Not every workout has to be a PR. Consistency is the rank.",
];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center py-10 px-6 font-mono">
      <p className="text-[10px] tracking-widest uppercase text-neutral-400 mb-4">
        Companion v1 · Low-fi Sketch
      </p>
      <div
        className="relative bg-neutral-50 border-2 border-neutral-400 w-72 rounded-sm overflow-hidden"
        style={{ minHeight: 580 }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-16 h-1.5 bg-neutral-300 rounded-full" />
        </div>
        <div className="px-5 pt-4 pb-8">{children}</div>
      </div>
    </div>
  );
}

function Btn({
  onClick,
  children,
  ghost,
}: {
  onClick: () => void;
  children: React.ReactNode;
  ghost?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full border text-xs py-2.5 tracking-wide transition-colors ${
        ghost
          ? "border-neutral-300 text-neutral-500 hover:border-neutral-500 hover:text-neutral-700"
          : "border-neutral-700 text-neutral-800 hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}

// ── Home ────────────────────────────────────────────────────────
function HomeScreen({
  onWorkout,
  onFood,
}: {
  onWorkout: () => void;
  onFood: () => void;
}) {
  return (
    <>
      <div className="border-b border-dashed border-neutral-300 pb-3 mb-5 flex items-baseline justify-between">
        <p className="text-[9px] uppercase tracking-widest text-neutral-400">FitRank</p>
        <p className="text-[9px] text-neutral-400">Today</p>
      </div>

      {/* Rank card */}
      <div className="border border-neutral-400 p-4 mb-4">
        <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2">Your rank</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold text-neutral-800 leading-none">Silver II</p>
            <p className="text-[10px] text-neutral-500 mt-1">1 ,240 ELO</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-neutral-400">Next rank</p>
            <p className="text-[10px] text-neutral-600 font-semibold">Gold I</p>
            <p className="text-[9px] text-neutral-400">60 ELO away</p>
          </div>
        </div>
        {/* Progress bar sketch */}
        <div className="mt-3 border border-neutral-300 h-2 w-full">
          <div className="bg-neutral-600 h-full" style={{ width: "78%" }} />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-[8px] text-neutral-400">Silver II</p>
          <p className="text-[8px] text-neutral-400">Gold I</p>
        </div>
      </div>

      {/* Motivational message */}
      <div className="border border-dashed border-neutral-300 p-3 mb-5">
        <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-1.5">
          [ daily message ]
        </p>
        <p className="text-[10px] text-neutral-600 leading-relaxed italic">
          "You've logged 4 workouts this month. You're building something real."
        </p>
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        <Btn onClick={onWorkout}>+ Log a workout</Btn>
        <Btn onClick={onFood} ghost>+ Log food</Btn>
      </div>
    </>
  );
}

// ── Log Workout ─────────────────────────────────────────────────
function LogWorkoutScreen({ onDone }: { onDone: (ex: string) => void }) {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const canSubmit = exercise && weight && reps;

  return (
    <>
      <div className="border-b border-dashed border-neutral-300 pb-3 mb-5">
        <p className="text-[9px] uppercase tracking-widest text-neutral-400">FitRank · Workout</p>
      </div>

      <p className="text-xs font-semibold text-neutral-700 mb-4 leading-snug">
        What did you work on today?
      </p>

      <div className="mb-3">
        <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Exercise</label>
        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="w-full border border-neutral-400 bg-white text-xs text-neutral-800 px-3 py-2 outline-none appearance-none"
        >
          <option value="" disabled>select one...</option>
          {EXERCISES.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Weight (lbs)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 135"
          className="w-full border border-neutral-400 bg-white text-xs text-neutral-800 px-3 py-2 outline-none placeholder:text-neutral-300"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Reps</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="e.g. 10"
          className="w-full border border-neutral-400 bg-white text-xs text-neutral-800 px-3 py-2 outline-none placeholder:text-neutral-300"
        />
      </div>

      <Btn onClick={() => canSubmit && onDone(exercise)} ghost={!canSubmit}>
        Save workout →
      </Btn>
    </>
  );
}

// ── Log Food ────────────────────────────────────────────────────
function LogFoodScreen({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <>
        <div className="border-b border-dashed border-neutral-300 pb-3 mb-5">
          <p className="text-[9px] uppercase tracking-widest text-neutral-400">FitRank · Food</p>
        </div>
        <div className="flex flex-col items-center mt-10 mb-10 text-center">
          <div className="border border-neutral-400 w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-base text-neutral-700">✓</span>
          </div>
          <p className="text-xs font-semibold text-neutral-700 mb-2">Logged.</p>
          <p className="text-[10px] text-neutral-500 leading-relaxed max-w-[160px]">
            Fueling your body is part of the work too.
          </p>
        </div>
        <Btn onClick={onBack}>← Back to home</Btn>
      </>
    );
  }

  return (
    <>
      <div className="border-b border-dashed border-neutral-300 pb-3 mb-5">
        <p className="text-[9px] uppercase tracking-widest text-neutral-400">FitRank · Food</p>
      </div>

      <p className="text-xs font-semibold text-neutral-700 mb-1 leading-snug">What did you eat?</p>
      <p className="text-[10px] text-neutral-400 mb-5 leading-relaxed">
        No judgment here. Just a record.
      </p>

      <div className="border border-dashed border-neutral-300 p-3 mb-4">
        <p className="text-[9px] text-neutral-300 uppercase tracking-widest">[ meal entry fields ]</p>
        <div className="mt-2 space-y-2">
          {["Meal / food item", "Calories (optional)", "Protein (optional)"].map((f) => (
            <div key={f} className="border border-neutral-300 px-3 py-2">
              <p className="text-[9px] text-neutral-400">{f}</p>
            </div>
          ))}
        </div>
      </div>

      <Btn onClick={() => setSaved(true)}>Save food log</Btn>
    </>
  );
}

// ── Feedback ────────────────────────────────────────────────────
function FeedbackScreen({
  exercise,
  onHome,
}: {
  exercise: string;
  onHome: () => void;
}) {
  const msg = FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)];

  return (
    <>
      <div className="border-b border-dashed border-neutral-300 pb-3 mb-5">
        <p className="text-[9px] uppercase tracking-widest text-neutral-400">FitRank · Nice work</p>
      </div>

      {/* Positive feedback — no weight judgment */}
      <div className="border border-neutral-400 p-4 mb-4">
        <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2">You logged</p>
        <p className="text-sm font-semibold text-neutral-800">{exercise}</p>
        <p className="text-[10px] text-neutral-500 mt-1">Added to your history.</p>
      </div>

      <div className="border border-dashed border-neutral-300 p-3 mb-4">
        <p className="text-[10px] text-neutral-600 leading-relaxed italic">"{msg}"</p>
      </div>

      {/* ELO nudge — encouraging, not transactional */}
      <div className="flex items-center gap-3 border border-neutral-300 px-4 py-3 mb-5">
        <div className="border border-neutral-400 w-8 h-8 flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-neutral-700">+</span>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-neutral-700">ELO on the way</p>
          <p className="text-[9px] text-neutral-400">Calculated after we compare to your past.</p>
        </div>
      </div>

      <Btn onClick={onHome}>← Back to home</Btn>
    </>
  );
}

// ── Root ────────────────────────────────────────────────────────
export default function Companion() {
  const [screen, setScreen] = useState<Screen>("home");
  const [lastExercise, setLastExercise] = useState("");

  return (
    <PhoneFrame>
      {screen === "home" && (
        <HomeScreen
          onWorkout={() => setScreen("log-workout")}
          onFood={() => setScreen("log-food")}
        />
      )}
      {screen === "log-workout" && (
        <LogWorkoutScreen
          onDone={(ex) => {
            setLastExercise(ex);
            setScreen("feedback");
          }}
        />
      )}
      {screen === "log-food" && (
        <LogFoodScreen onBack={() => setScreen("home")} />
      )}
      {screen === "feedback" && (
        <FeedbackScreen exercise={lastExercise} onHome={() => setScreen("home")} />
      )}
    </PhoneFrame>
  );
}
