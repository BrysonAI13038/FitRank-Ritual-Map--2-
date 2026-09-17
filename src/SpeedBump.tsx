import { useState } from "react";

type Screen = "prompt" | "log" | "confirm" | "done";

const amber   = "#f59e0b";
const bg      = "#0c0c0e";
const surface = "#161618";
const border  = "#26262b";
const muted   = "#52525b";
const dim     = "#a1a1aa";
const text    = "#ffffff";

const EXERCISES = ["Bench Press", "Squat", "Deadlift", "Pull-Up", "Overhead Press", "Row"];

/* ── primitives ─────────────────────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9,
      letterSpacing: "0.14em", textTransform: "uppercase", color: muted }}>
      {children}
    </span>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${border}`, margin: "0" }} />;
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", background: amber, border: "none", color: "#000",
      fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13,
      letterSpacing: "0.04em", padding: "13px 0", cursor: "pointer",
      borderRadius: 1, transition: "opacity 0.15s",
    }}
      onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
      onMouseOut={e  => (e.currentTarget.style.opacity = "1")}
    >{children}</button>
  );
}

function GhostBtn({ onClick, children, disabled }: {
  onClick: () => void; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", background: "transparent",
      border: `1px solid ${disabled ? "#222226" : "#3f3f46"}`,
      color: disabled ? "#333338" : dim,
      fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 13,
      letterSpacing: "0.04em", padding: "12px 0", cursor: disabled ? "default" : "pointer",
      borderRadius: 1, transition: "border-color 0.15s, color 0.15s",
    }}
      onMouseOver={e => { if (!disabled) { e.currentTarget.style.borderColor = "#71717a"; e.currentTarget.style.color = text; }}}
      onMouseOut={e  => { if (!disabled) { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = dim; }}}
    >{children}</button>
  );
}

function InputEl({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} style={{
        width: "100%", background: surface, border: `1px solid ${border}`,
        color: text, fontFamily: "Inter, sans-serif", fontSize: 14,
        padding: "10px 12px", outline: "none", boxSizing: "border-box", borderRadius: 1,
      }}
      onFocus={e => (e.currentTarget.style.borderColor = amber)}
      onBlur={e  => (e.currentTarget.style.borderColor = border)}
    />
  );
}

/* ── phone shell ────────────────────────────────────────────── */
function Phone({ screen, children }: { screen: Screen; children: React.ReactNode }) {
  const steps: Screen[] = ["prompt", "log", "confirm"];
  const idx = steps.indexOf(screen);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 24px", background: "#f4f4f5", minHeight: "100vh" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "#a1a1aa", marginBottom: 16 }}>
        Speed Bump v1
      </p>
      <div style={{ width: 288, background: bg, borderRadius: 2, overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}>
        {/* notch */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 60, height: 5, background: "#26262b", borderRadius: 99 }} />
        </div>
        {/* step dots — only during 3-step flow */}
        {screen !== "done" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 20px 0" }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: 1,
                  background: i <= idx ? amber : "#2a2a2e",
                  transition: "background 0.2s",
                }} />
                {i < steps.length - 1 && (
                  <div style={{ width: 16, height: 1,
                    background: i < idx ? amber : "#2a2a2e" }} />
                )}
              </div>
            ))}
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: muted, marginLeft: 4 }}>
              Step {Math.max(idx + 1, 1)} of 3
            </span>
          </div>
        )}
        <div style={{ padding: "16px 20px 36px" }}>{children}</div>
      </div>
    </div>
  );
}

/* ── screen header ──────────────────────────────────────────── */
function ScreenHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${border}` }}>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 9, letterSpacing: "0.14em",
        textTransform: "uppercase", color: muted, marginBottom: 6 }}>
        {eyebrow}
      </div>
      <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
        fontSize: 22, letterSpacing: "0.04em", color: text, lineHeight: 1.1 }}>
        {title}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN 1 — PROMPT
══════════════════════════════════════════════════════════════ */
function PromptScreen({ onNext }: { onNext: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const options = [
    { label: "Heavier weight" },
    { label: "More reps" },
    { label: "Better form" },
  ];

  const toggle = (i: number) =>
    setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <Phone screen="prompt">
      <ScreenHeader eyebrow="Before you log" title="What improved this week?" />

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: dim,
        lineHeight: 1.6, marginBottom: 20 }}>
        Take a moment. Compare your recent workouts with last week.
      </p>

      {/* reflection checkboxes */}
      <div style={{ background: surface, border: `1px solid ${border}`,
        borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
        {options.map((opt, i) => {
          const on = checked.has(i);
          return (
            <div key={i}>
              <button onClick={() => toggle(i)} style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "13px 14px", background: "transparent",
                border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{
                  width: 16, height: 16, border: `1.5px solid ${on ? amber : "#3f3f46"}`,
                  borderRadius: 1, flexShrink: 0, background: on ? amber : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  {on && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13,
                  color: on ? text : dim, fontWeight: on ? 500 : 400,
                  transition: "color 0.15s" }}>
                  {opt.label}
                </span>
              </button>
              {i < options.length - 1 && <Divider />}
            </div>
          );
        })}
      </div>

      {/* intent note */}
      <div style={{ background: `${amber}0d`, border: `1px solid ${amber}25`,
        borderRadius: 2, padding: "10px 12px", marginBottom: 24 }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: dim,
          lineHeight: 1.55, margin: 0 }}>
          <span style={{ color: amber, fontWeight: 500 }}>Speed Bump</span> — ELO is earned after you confirm, not before. No quick saves.
        </p>
      </div>

      <PrimaryBtn onClick={onNext}>Continue to log →</PrimaryBtn>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN 2 — LOG
══════════════════════════════════════════════════════════════ */
function LogScreen({ onNext }: {
  onNext: (data: { exercise: string; weight: string; reps: string }) => void;
}) {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight]     = useState("");
  const [reps, setReps]         = useState("");
  const canSubmit = exercise && weight && reps;

  return (
    <Phone screen="log">
      <ScreenHeader eyebrow="Log workout" title="One exercise at a time." />

      {/* exercise select */}
      <div style={{ marginBottom: 12 }}>
        <Tag>Exercise</Tag>
        <div style={{ marginTop: 6 }}>
          <select value={exercise} onChange={e => setExercise(e.target.value)} style={{
            width: "100%", background: surface, border: `1px solid ${border}`,
            color: exercise ? text : muted, fontFamily: "Inter, sans-serif",
            fontSize: 14, padding: "10px 12px", outline: "none",
            appearance: "none", borderRadius: 1, cursor: "pointer", boxSizing: "border-box",
          }}
            onFocus={e => (e.currentTarget.style.borderColor = amber)}
            onBlur={e  => (e.currentTarget.style.borderColor = border)}
          >
            <option value="" disabled style={{ color: muted }}>Select exercise…</option>
            {EXERCISES.map(ex => <option key={ex} value={ex} style={{ color: "#000" }}>{ex}</option>)}
          </select>
        </div>
      </div>

      {/* weight + reps */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div>
          <Tag>Weight (lbs)</Tag>
          <div style={{ marginTop: 6 }}>
            <InputEl value={weight} onChange={setWeight} type="number" placeholder="0" />
          </div>
        </div>
        <div>
          <Tag>Reps</Tag>
          <div style={{ marginTop: 6 }}>
            <InputEl value={reps} onChange={setReps} type="number" placeholder="0" />
          </div>
        </div>
      </div>

      {/* previous best */}
      <div style={{ background: surface, border: `1px solid ${border}`,
        borderRadius: 2, padding: "10px 12px", marginBottom: 24 }}>
        <Tag>Previous best — Bench Press</Tag>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "baseline", marginTop: 6 }}>
          <span style={{ fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 600, fontSize: 18, color: dim }}>
            185 lbs · 8 reps
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: muted }}>Sep 14</span>
        </div>
      </div>

      {canSubmit
        ? <PrimaryBtn onClick={() => onNext({ exercise, weight, reps })}>Review entry →</PrimaryBtn>
        : <GhostBtn onClick={() => {}} disabled>Fill in all fields</GhostBtn>
      }
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN 3 — CONFIRM
══════════════════════════════════════════════════════════════ */
function ConfirmScreen({ data, onDone }: {
  data: { exercise: string; weight: string; reps: string };
  onDone: () => void;
}) {
  return (
    <Phone screen="confirm">
      <ScreenHeader eyebrow="Confirm workout" title="Does this look right?" />

      {/* summary card */}
      <div style={{ background: surface, border: `1px solid ${border}`,
        borderRadius: 2, overflow: "hidden", marginBottom: 16 }}>
        {[
          { label: "Exercise", value: data.exercise },
          { label: "Weight",   value: `${data.weight} lbs` },
          { label: "Reps",     value: data.reps },
        ].map(({ label, value }, i) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "12px 14px" }}>
              <Tag>{label}</Tag>
              <span style={{ fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: 600, fontSize: 18, color: text }}>{value}</span>
            </div>
            {i < 2 && <Divider />}
          </div>
        ))}
      </div>

      {/* lock notice */}
      <div style={{ background: `${amber}0d`, border: `1px solid ${amber}25`,
        borderRadius: 2, padding: "10px 12px", marginBottom: 24 }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11,
          color: dim, lineHeight: 1.55, margin: 0 }}>
          Confirming locks this entry and{" "}
          <span style={{ color: amber, fontWeight: 500 }}>awards your ELO</span>.
          This is the moment that counts.
        </p>
      </div>

      <PrimaryBtn onClick={onDone}>Confirm Workout</PrimaryBtn>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCREEN 4 — DONE
══════════════════════════════════════════════════════════════ */
function DoneScreen({ onReset }: { onReset: () => void }) {
  return (
    <Phone screen="done">
      {/* wordmark */}
      <div style={{ paddingBottom: 14, borderBottom: `1px solid ${border}`, marginBottom: 24 }}>
        <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
          fontSize: 16, color: text, letterSpacing: "0.06em" }}>FITRANK</span>
      </div>

      {/* ELO award */}
      <div style={{ background: surface, border: `1px solid ${amber}33`,
        borderRadius: 2, padding: "20px 16px", marginBottom: 16 }}>
        <Tag>ELO earned</Tag>
        <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700,
          fontSize: 56, color: amber, lineHeight: 1, letterSpacing: "0.01em",
          marginTop: 4, marginBottom: 16 }}>
          +20
        </div>
        {/* mini progress bar */}
        <div style={{ height: 5, background: "#1e1e22", borderRadius: 1, marginBottom: 6 }}>
          <div style={{ height: "100%", width: "58%", background: amber, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Tag>Silver II · 1,260</Tag>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: amber }}>
            42 to Gold I
          </span>
        </div>
      </div>

      {/* message */}
      <div style={{ background: surface, border: `1px solid ${border}`,
        borderRadius: 2, padding: "14px 14px", marginBottom: 24 }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: dim,
          lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
          "You confirmed it. That deliberate pause is exactly what separates consistent progress from noise."
        </p>
      </div>

      <div style={{ marginBottom: 8 }}>
        <Tag>Next step</Tag>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: dim,
          marginTop: 4, lineHeight: 1.5 }}>
          Log your next workout and track your progress week by week.
        </p>
      </div>

      <div style={{ height: 20 }} />
      <GhostBtn onClick={onReset}>← Start over</GhostBtn>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function SpeedBump() {
  const [screen, setScreen] = useState<Screen>("prompt");
  const [logData, setLogData] = useState({ exercise: "", weight: "", reps: "" });

  return (
    <>
      {screen === "prompt"  && <PromptScreen onNext={() => setScreen("log")} />}
      {screen === "log"     && <LogScreen onNext={data => { setLogData(data); setScreen("confirm"); }} />}
      {screen === "confirm" && <ConfirmScreen data={logData} onDone={() => setScreen("done")} />}
      {screen === "done"    && <DoneScreen onReset={() => setScreen("prompt")} />}
    </>
  );
}
