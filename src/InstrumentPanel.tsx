import { useState } from "react";

type Screen = "home" | "log-workout" | "log-food" | "done";

const EXERCISES = ["Bench Press", "Squat", "Deadlift", "Pull-Up", "Overhead Press", "Row"];

const recent = [
  { date: "Sep 14", exercise: "Bench Press", detail: "185 lbs · 8 reps", delta: "+10 lbs",  up: true  },
  { date: "Sep 11", exercise: "Squat",        detail: "225 lbs · 6 reps", delta: "+5 lbs",   up: true  },
  { date: "Sep 9",  exercise: "Deadlift",     detail: "275 lbs · 5 reps", delta: "—",         up: false },
  { date: "Sep 6",  exercise: "Pull-Up",      detail: "BW · 12 reps",    delta: "+2 reps",   up: true  },
];

/* ── palette ───────────────────────────────────────────────── */
const bg      = "#0c0c0e";
const surface = "#161618";
const border  = "#26262b";
const muted   = "#52525b";
const text    = "#f4f4f5";
const dim     = "#a1a1aa";
const amber   = "#f59e0b";
const amberDim= "#78450a";

/* ── primitives ────────────────────────────────────────────── */
function Divider() {
  return <div style={{ borderTop: `1px solid ${border}` }} />;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, letterSpacing: "0.12em",
      textTransform: "uppercase", color: muted }}>
      {children}
    </span>
  );
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", background: amber, border: "none", color: "#000",
      fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13,
      letterSpacing: "0.04em", padding: "13px 0", cursor: "pointer",
      transition: "opacity 0.15s",
    }}
      onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
      onMouseOut={e  => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", background: "transparent", border: `1px solid ${disabled ? "#2a2a2e" : "#3f3f46"}`,
      color: disabled ? muted : dim,
      fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 13,
      letterSpacing: "0.04em", padding: "12px 0", cursor: disabled ? "default" : "pointer",
      transition: "border-color 0.15s, color 0.15s",
    }}
      onMouseOver={e => { if (!disabled) { e.currentTarget.style.borderColor = "#71717a"; e.currentTarget.style.color = text; }}}
      onMouseOut={e  => { if (!disabled) { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = dim; }}}
    >
      {children}
    </button>
  );
}

/* ── phone shell ───────────────────────────────────────────── */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 24px", background: "#f4f4f5", minHeight: "100vh" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "#a1a1aa", marginBottom: 16 }}>
        Instrument Panel v1
      </p>
      <div style={{
        width: 288, background: bg, borderRadius: 2,
        overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
      }}>
        {/* notch */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 60, height: 5, background: "#26262b", borderRadius: 99 }} />
        </div>
        <div style={{ padding: "4px 20px 36px" }}>{children}</div>
      </div>
    </div>
  );
}

/* ── rank emblem ───────────────────────────────────────────── */
function RankEmblem() {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 16px" }}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {/* outer diamond */}
        <div style={{
          position: "absolute", inset: 0,
          border: `2px solid ${amber}`,
          transform: "rotate(45deg)",
          borderRadius: 2,
        }} />
        {/* inner fill */}
        <div style={{
          position: "absolute", inset: 8,
          background: amberDim,
          transform: "rotate(45deg)",
          borderRadius: 1,
          opacity: 0.4,
        }} />
        {/* rank letter */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 700, fontSize: 26, color: amber, letterSpacing: "0.02em",
            lineHeight: 1,
          }}>S</span>
        </div>
      </div>
    </div>
  );
}

/* ── progress bar ───────────────────────────────────────────── */
function ProgressBar({ pct, before }: { pct: number; before?: number }) {
  return (
    <div>
      <div style={{ position: "relative", height: 6, background: "#1e1e22", borderRadius: 1 }}>
        {before !== undefined && (
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0,
            width: `${before}%`, background: "#3f3f46", borderRadius: 1 }} />
        )}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0,
          width: `${pct}%`, background: amber, borderRadius: 1,
          transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

/* ── field ───────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Tag>{label}</Tag>
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
}

function InputEl({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", background: surface, border: `1px solid ${border}`,
        color: text, fontFamily: "Inter, sans-serif", fontSize: 14,
        padding: "10px 12px", outline: "none", boxSizing: "border-box",
        borderRadius: 1,
      }}
      onFocus={e  => (e.currentTarget.style.borderColor = amber)}
      onBlur={e   => (e.currentTarget.style.borderColor = border)}
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN — HOME
══════════════════════════════════════════════════════════════ */
function HomeScreen({ onWorkout, onFood }: { onWorkout: () => void; onFood: () => void }) {
  return (
    <>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: 12, borderBottom: `1px solid ${border}`, marginBottom: 4 }}>
        <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
          fontSize: 16, color: text, letterSpacing: "0.06em" }}>FITRANK</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: muted }}>Sep 16</span>
      </div>

      {/* rank emblem */}
      <RankEmblem />

      {/* rank name + ELO */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 600,
          fontSize: 28, color: text, letterSpacing: "0.08em", lineHeight: 1 }}>
          SILVER II
        </div>
        <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
          fontSize: 48, color: amber, letterSpacing: "0.02em", lineHeight: 1.1 }}>
          1,240
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: muted,
          letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>ELO</div>
      </div>

      {/* progress bar block */}
      <div style={{ marginBottom: 24 }}>
        <ProgressBar pct={40} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <Tag>Silver II · 1,200</Tag>
          <Tag>Gold I · 1,300</Tag>
        </div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: amber }}>
            60 ELO to next rank
          </span>
        </div>
      </div>

      <Divider />

      {/* stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 0, margin: "0 -20px" }}>
        {[
          { value: "18", label: "Workouts" },
          { value: "6",  label: "Day streak" },
          { value: "3",  label: "PRs this mo." },
        ].map(({ value, label }, i) => (
          <div key={label} style={{
            padding: "14px 0", textAlign: "center",
            borderRight: i < 2 ? `1px solid ${border}` : "none",
          }}>
            <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
              fontSize: 26, color: text, lineHeight: 1 }}>{value}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10,
              color: muted, marginTop: 3, letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* recent workouts */}
      <div style={{ margin: "16px 0 6px", display: "flex", justifyContent: "space-between" }}>
        <Tag>Recent workouts</Tag>
        <Tag>last 4</Tag>
      </div>

      <div style={{ marginBottom: 20 }}>
        {recent.map((w, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 0",
            borderBottom: i < recent.length - 1 ? `1px solid ${border}` : "none",
          }}>
            <div style={{ width: 36, flexShrink: 0 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: muted }}>{w.date}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
                color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {w.exercise}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: muted, marginTop: 1 }}>
                {w.detail}
              </div>
            </div>
            <div style={{ flexShrink: 0,
              fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
              color: w.up ? amber : muted }}>
              {w.delta}
            </div>
          </div>
        ))}
      </div>

      {/* actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <PrimaryBtn onClick={onWorkout}>+ Log Workout</PrimaryBtn>
        <GhostBtn onClick={onFood}>+ Log Food</GhostBtn>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN — LOG WORKOUT
══════════════════════════════════════════════════════════════ */
function LogWorkoutScreen({ onDone }: { onDone: () => void }) {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight]     = useState("");
  const [reps, setReps]         = useState("");
  const canSubmit = exercise && weight && reps;

  return (
    <>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: 12, borderBottom: `1px solid ${border}`, marginBottom: 20 }}>
        <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
          fontSize: 16, color: text, letterSpacing: "0.06em" }}>LOG WORKOUT</span>
      </div>

      {/* previous best */}
      <div style={{ background: surface, border: `1px solid ${border}`,
        padding: "12px 14px", marginBottom: 20, borderRadius: 1 }}>
        <Tag>Previous best</Tag>
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13,
              fontWeight: 500, color: dim }}>Bench Press</div>
            <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 600,
              fontSize: 22, color: text, marginTop: 2 }}>185 lbs · 8 reps</div>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11,
            color: muted, alignSelf: "flex-end" }}>Sep 14</div>
        </div>
      </div>

      {/* fields */}
      <Field label="Exercise">
        <select value={exercise} onChange={e => setExercise(e.target.value)} style={{
          width: "100%", background: surface, border: `1px solid ${border}`,
          color: exercise ? text : muted, fontFamily: "Inter, sans-serif", fontSize: 14,
          padding: "10px 12px", outline: "none", appearance: "none", borderRadius: 1,
          cursor: "pointer",
        }}
          onFocus={e => (e.currentTarget.style.borderColor = amber)}
          onBlur={e  => (e.currentTarget.style.borderColor = border)}
        >
          <option value="" disabled style={{ color: muted }}>Select exercise…</option>
          {EXERCISES.map(ex => <option key={ex} value={ex} style={{ color: text }}>{ex}</option>)}
        </select>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Weight (lbs)">
          <InputEl value={weight} onChange={setWeight} type="number" placeholder="0" />
        </Field>
        <Field label="Reps">
          <InputEl value={reps} onChange={setReps} type="number" placeholder="0" />
        </Field>
      </div>

      <div style={{ height: 20 }} />
      {canSubmit
        ? <PrimaryBtn onClick={onDone}>Save + calculate ELO →</PrimaryBtn>
        : <GhostBtn onClick={() => {}} disabled>Fill in all fields</GhostBtn>
      }
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN — LOG FOOD
══════════════════════════════════════════════════════════════ */
function LogFoodScreen({ onDone }: { onDone: () => void }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: 12, borderBottom: `1px solid ${border}`, marginBottom: 20 }}>
        <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
          fontSize: 16, color: text, letterSpacing: "0.06em" }}>LOG FOOD</span>
      </div>

      {/* today intake */}
      <div style={{ background: surface, border: `1px solid ${border}`,
        padding: "12px 14px", marginBottom: 20, borderRadius: 1 }}>
        <Tag>Today's intake</Tag>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Calories", val: "1,840", goal: "/ 2,400" },
            { label: "Protein",  val: "142 g",  goal: "/ 180 g" },
            { label: "Meals",    val: "2",       goal: "logged"  },
          ].map(({ label, val, goal }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Tag>{label}</Tag>
              <div>
                <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 600,
                  fontSize: 18, color: text }}>{val}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11,
                  color: muted, marginLeft: 5 }}>{goal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* meal fields */}
      <Field label="Meal / food item">
        <InputEl value="" onChange={() => {}} placeholder="e.g. Chicken breast, rice" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Calories">
          <InputEl value="" onChange={() => {}} type="number" placeholder="0" />
        </Field>
        <Field label="Protein (g)">
          <InputEl value="" onChange={() => {}} type="number" placeholder="0" />
        </Field>
      </div>

      <div style={{ height: 20 }} />
      <PrimaryBtn onClick={onDone}>Save food log</PrimaryBtn>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN — DONE / ELO UPDATE
══════════════════════════════════════════════════════════════ */
function DoneScreen({ onHome }: { onHome: () => void }) {
  const eloBefore = 1240;
  const eloGained = 18;
  const eloAfter  = eloBefore + eloGained;
  const pctBefore = 40;
  const pctAfter  = Math.round(((eloAfter - 1200) / 100) * 100);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: 12, borderBottom: `1px solid ${border}`, marginBottom: 20 }}>
        <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
          fontSize: 16, color: text, letterSpacing: "0.06em" }}>ELO UPDATED</span>
      </div>

      {/* main ELO card */}
      <div style={{ background: surface, border: `1px solid ${amber}22`,
        padding: "18px 16px", marginBottom: 16, borderRadius: 1 }}>

        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: 16 }}>
          <div>
            <Tag>ELO earned</Tag>
            <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
              fontSize: 56, color: amber, lineHeight: 1, letterSpacing: "0.01em", marginTop: 4 }}>
              +{eloGained}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Tag>New total</Tag>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4,
              justifyContent: "flex-end" }}>
              <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 500,
                fontSize: 18, color: muted, textDecoration: "line-through" }}>
                {eloBefore.toLocaleString()}
              </span>
              <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
                fontSize: 30, color: text }}>
                {eloAfter.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* progress bar */}
        <ProgressBar pct={pctAfter} before={pctBefore} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <Tag>Silver II</Tag>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: amber }}>
            42 ELO to Gold I
          </span>
        </div>
      </div>

      {/* session delta */}
      <div style={{ background: surface, border: `1px solid ${border}`,
        padding: "12px 14px", marginBottom: 16, borderRadius: 1 }}>
        <Tag>Session</Tag>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "ELO gained",       val: `+${eloGained}`, accent: true },
            { label: "vs. last session", val: "+10 lbs",        accent: false },
            { label: "Rank",             val: "Silver II",      accent: false },
          ].map(({ label, val, accent }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Tag>{label}</Tag>
              <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 600,
                fontSize: 16, color: accent ? amber : text }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <GhostBtn onClick={onHome}>← Back to dashboard</GhostBtn>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function InstrumentPanel() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <Phone>
      {screen === "home"        && <HomeScreen onWorkout={() => setScreen("log-workout")} onFood={() => setScreen("log-food")} />}
      {screen === "log-workout" && <LogWorkoutScreen onDone={() => setScreen("done")} />}
      {screen === "log-food"    && <LogFoodScreen onDone={() => setScreen("done")} />}
      {screen === "done"        && <DoneScreen onHome={() => setScreen("home")} />}
    </Phone>
  );
}
