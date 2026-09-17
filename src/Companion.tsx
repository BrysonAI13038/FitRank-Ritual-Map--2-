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
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f5] py-10 px-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <p className="text-[10px] tracking-widest uppercase text-[#a1a1aa] mb-4">
        Companion v1
      </p>
      <div
        className="relative bg-[#0c0c0e] text-[#f4f4f5] w-72 rounded-[2px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
        style={{ minHeight: 580, colorScheme: "dark" }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-[60px] h-[5px] bg-[#26262b] rounded-full" />
        </div>
        <div className="px-5 pt-4 pb-9">{children}</div>
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
      className={`w-full rounded-[1px] border text-[13px] font-semibold py-3 tracking-[0.04em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e0b] ${
        ghost
          ? "border-[#3f3f46] bg-transparent text-[#a1a1aa] hover:border-[#71717a] hover:text-white"
          : "border-[#f59e0b] bg-[#f59e0b] text-black hover:bg-[#e4930a]"
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
      <div className="border-b border-[#26262b] pb-4 mb-6 flex items-baseline justify-between">
        <p className="text-base font-bold tracking-[0.06em] text-[#f4f4f5]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>FITRANK</p>
        <p className="text-[9px] text-[#a1a1aa]">Today</p>
      </div>

      <div className="mb-6">
        <p className="text-[26px] font-bold leading-tight tracking-[0.02em]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
          Your pace. Your progress.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#a1a1aa]">Every session is a step forward.</p>
      </div>

      {/* Rank card */}
      <div className="rounded-[2px] border border-[#26262b] bg-[#161618] p-4 mb-4">
        <p className="text-[9px] uppercase tracking-widest text-[#a1a1aa] mb-2">Your rank</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[28px] font-semibold text-[#f4f4f5] leading-none tracking-[0.04em]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Silver II</p>
            <p className="text-[36px] font-bold text-[#f59e0b] mt-1 leading-tight" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>1,240 <span className="text-[11px] font-medium tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>ELO</span></p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-[#a1a1aa]">Next rank</p>
            <p className="text-[10px] text-[#a1a1aa] font-semibold">Gold I</p>
            <p className="text-[9px] text-[#a1a1aa]">60 ELO away</p>
          </div>
        </div>
        {/* Rank progress */}
        <div className="mt-4 bg-[#1e1e22] rounded-[1px] h-1.5 w-full overflow-hidden">
          <div className="bg-[#f59e0b] h-full" style={{ width: "78%" }} />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-[8px] text-[#a1a1aa]">Silver II</p>
          <p className="text-[8px] text-[#a1a1aa]">Gold I</p>
        </div>
      </div>

      {/* Motivational message */}
      <div className="rounded-[2px] border border-[#f59e0b]/15 bg-[#f59e0b]/5 p-4 mb-6">
        <p className="text-[9px] text-[#f59e0b] uppercase tracking-widest mb-2">
          A little encouragement
        </p>
        <p className="text-xs text-[#a1a1aa] leading-relaxed italic">
          "You've logged 4 workouts this month. You're building something real."
        </p>
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        <Btn onClick={onWorkout}>+ Log Workout</Btn>
        <Btn onClick={onFood} ghost>+ Log Food</Btn>
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
      <div className="border-b border-[#26262b] pb-4 mb-6">
        <p className="text-[9px] uppercase tracking-widest text-[#a1a1aa]">FitRank · Workout</p>
      </div>

      <p className="text-[22px] font-semibold text-[#f4f4f5] mb-4 leading-snug" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
        What did you work on today?
      </p>

      <div className="mb-3">
        <label className="block text-[10px] uppercase tracking-widest text-[#a1a1aa] mb-1">Exercise</label>
        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="w-full border border-[#26262b] bg-[#161618] text-sm text-[#f4f4f5] rounded-[1px] px-3 py-2.5 outline-none focus:border-[#f59e0b] appearance-none"
        >
          <option value="" disabled>select one...</option>
          {EXERCISES.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-[10px] uppercase tracking-widest text-[#a1a1aa] mb-1">Weight (lbs)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 135"
          className="w-full border border-[#26262b] bg-[#161618] text-sm text-[#f4f4f5] rounded-[1px] px-3 py-2.5 outline-none focus:border-[#f59e0b] placeholder:text-[#71717a]"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[10px] uppercase tracking-widest text-[#a1a1aa] mb-1">Reps</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="e.g. 10"
          className="w-full border border-[#26262b] bg-[#161618] text-sm text-[#f4f4f5] rounded-[1px] px-3 py-2.5 outline-none focus:border-[#f59e0b] placeholder:text-[#71717a]"
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
        <div className="border-b border-[#26262b] pb-4 mb-6">
          <p className="text-[9px] uppercase tracking-widest text-[#a1a1aa]">FitRank · Food</p>
        </div>
        <div className="flex flex-col items-center mt-10 mb-10 text-center">
          <div className="rounded-[2px] border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b] w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-xl text-[#f59e0b]">✓</span>
          </div>
          <p className="text-[26px] font-semibold text-[#f4f4f5] mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Logged.</p>
          <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-[160px]">
            Fueling your body is part of the work too.
          </p>
        </div>
        <Btn onClick={onBack}>← Back to home</Btn>
      </>
    );
  }

  return (
    <>
      <div className="border-b border-[#26262b] pb-4 mb-6">
        <p className="text-[9px] uppercase tracking-widest text-[#a1a1aa]">FitRank · Food</p>
      </div>

      <p className="text-[22px] font-semibold text-[#f4f4f5] mb-1 leading-snug" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>What did you eat?</p>
      <p className="text-[10px] text-[#a1a1aa] mb-5 leading-relaxed">
        No judgment here. Just a record.
      </p>

      <div className="rounded-[2px] border border-[#f59e0b]/15 bg-[#f59e0b]/5 p-4 mb-4">
        <p className="text-[9px] text-[#a1a1aa] uppercase tracking-widest">Meal details</p>
        <div className="mt-2 space-y-2">
          {["Meal / food item", "Calories (optional)", "Protein (optional)"].map((f) => (
            <div key={f} className="rounded-[1px] bg-[#161618] border border-[#26262b] px-3 py-3">
              <p className="text-[9px] text-[#a1a1aa]">{f}</p>
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
      <div className="border-b border-[#26262b] pb-4 mb-6">
        <p className="text-[9px] uppercase tracking-widest text-[#a1a1aa]">FitRank · Nice work</p>
      </div>

      {/* Positive feedback — no weight judgment */}
      <div className="rounded-[2px] border border-[#26262b] bg-[#161618] p-4 mb-4">
        <p className="text-[9px] uppercase tracking-widest text-[#a1a1aa] mb-2">You logged</p>
        <p className="text-[24px] font-semibold text-[#f4f4f5]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{exercise}</p>
        <p className="text-[10px] text-[#a1a1aa] mt-1">Added to your history.</p>
      </div>

      <div className="rounded-[2px] border border-[#f59e0b]/15 bg-[#f59e0b]/5 p-4 mb-4">
        <p className="text-xs text-[#a1a1aa] leading-relaxed italic">"{msg}"</p>
      </div>

      {/* ELO nudge — encouraging, not transactional */}
      <div className="flex items-center gap-3 rounded-[2px] bg-[#161618] border border-[#26262b] px-4 py-3 mb-6">
        <div className="border border-[#f59e0b]/30 bg-[#f59e0b]/10 w-8 h-8 flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-[#f59e0b]">+</span>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#f4f4f5]">ELO on the way</p>
          <p className="text-[9px] text-[#a1a1aa]">Calculated after we compare to your past.</p>
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
