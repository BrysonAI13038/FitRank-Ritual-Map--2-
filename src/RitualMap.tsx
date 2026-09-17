const amber = "#f59e0b";
const bg      = "#0c0c0e";
const surface = "#161618";
const border  = "#26262b";
const muted   = "#52525b";
const dim     = "#a1a1aa";
const text    = "#f4f4f5";

type Phase = {
  label: string;
  accentBorder?: boolean;
  steps: { text: string; accent?: boolean }[];
};

const phases: Phase[] = [
  {
    label: "Trigger",
    steps: [
      { text: "Finish Workout" },
      { text: "Want to see your progress" },
    ],
  },
  {
    label: "FitRank",
    accentBorder: true,
    steps: [
      { text: "Open FitRank" },
      { text: "Log exercises, weight, and reps" },
      { text: "FitRank compares it to past workouts" },
    ],
  },
  {
    label: "ELO Reward",
    steps: [
      { text: "Earn ELO", accent: true },
      { text: "See your rank and progress toward the next rank" },
    ],
  },
  {
    label: "Return Loop",
    steps: [
      { text: "Come back after your next workout and try to improve" },
    ],
  },
];

function Arrow({ accent }: { accent?: boolean }) {
  const color = accent ? amber : "#3f3f46";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      margin: "2px 0" }}>
      <div style={{ width: 1, height: 18, background: color }} />
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
        <path d="M4 5L0 0h8L4 5z" fill={color} />
      </svg>
    </div>
  );
}

function PhaseConnector() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0" }}>
      <div style={{ width: 1, height: 10, background: "#2a2a2e" }} />
      <div style={{ width: 1, height: 10, background: "#2a2a2e", marginTop: 3, opacity: 0.5 }} />
      <div style={{ width: 1, height: 10, background: "#2a2a2e", marginTop: 3, opacity: 0.25 }} />
    </div>
  );
}

function StepCard({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? `${amber}14` : surface,
      border: `1px solid ${accent ? amber + "55" : border}`,
      padding: "11px 16px",
      borderRadius: 2,
      width: "100%",
      boxSizing: "border-box",
    }}>
      <span style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        fontWeight: accent ? 600 : 400,
        color: accent ? amber : "#ffffff",
        lineHeight: 1.45,
      }}>
        {text}
      </span>
      {accent && (
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 28, height: 3, background: amber, borderRadius: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10,
            color: amber, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ELO awarded
          </span>
        </div>
      )}
    </div>
  );
}

function PhaseBlock({ phase }: { phase: Phase }) {
  return (
    <div style={{
      background: bg,
      border: `1px solid ${phase.accentBorder ? amber + "33" : border}`,
      borderRadius: 3,
      padding: "14px 14px 16px",
      width: "100%",
      boxSizing: "border-box",
    }}>
      {/* phase label */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 3, height: 14, borderRadius: 1,
          background: phase.accentBorder ? amber : "#3f3f46",
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: "Barlow Condensed, sans-serif",
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: phase.accentBorder ? amber : dim,
        }}>
          {phase.label}
        </span>
      </div>

      {/* steps */}
      {phase.steps.map((step, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StepCard text={step.text} accent={step.accent} />
          {i < phase.steps.length - 1 && <Arrow accent={step.accent} />}
        </div>
      ))}
    </div>
  );
}

export default function RitualMap() {
  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "52px 24px 64px",
    }}>
      {/* header */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: muted,
          marginBottom: 8,
        }}>
          FitRank
        </div>
        <div style={{
          fontFamily: "Barlow Condensed, sans-serif",
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#ffffff",
          lineHeight: 1,
        }}>
          Ritual Map
        </div>
        <div style={{
          width: 32, height: 2, background: amber,
          borderRadius: 1, margin: "12px auto 0",
        }} />
      </div>

      {/* flow */}
      <div style={{ width: "100%", maxWidth: 340, display: "flex",
        flexDirection: "column", alignItems: "center" }}>
        {phases.map((phase, i) => (
          <div key={i} style={{ width: "100%", display: "flex",
            flexDirection: "column", alignItems: "center" }}>
            <PhaseBlock phase={phase} />
            {i < phases.length - 1 && <PhaseConnector />}
          </div>
        ))}
      </div>

      {/* footer annotation */}
      <div style={{
        marginTop: 48,
        borderTop: `1px solid ${border}`,
        paddingTop: 20,
        width: "100%",
        maxWidth: 340,
        textAlign: "center",
      }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12,
          color: muted, fontStyle: "italic" }}>
          Interface appears{" "}
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12,
          color: dim, fontWeight: 500, fontStyle: "italic" }}>
          after the behavior
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12,
          color: muted, fontStyle: "italic" }}>
          {" "}— Reflection.
        </span>
      </div>
    </div>
  );
}
