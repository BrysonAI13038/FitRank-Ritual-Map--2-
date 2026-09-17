import { useState } from "react";
import RitualMap from "./RitualMap";
import SpeedBump from "./SpeedBump";
import Companion from "./Companion";
import InstrumentPanel from "./InstrumentPanel";
import SignatureInteraction from "./SignatureInteraction";

type View = "ritual" | "speedbump" | "companion" | "instrument" | "signature";

const TABS: { id: View; label: string }[] = [
  { id: "ritual",     label: "Ritual Map" },
  { id: "speedbump",  label: "Speed Bump v1" },
  { id: "companion",  label: "Companion v1" },
  { id: "instrument", label: "Instrument Panel v1" },
  { id: "signature",  label: "Signature Interaction" },
];

export default function App() {
  const [view, setView] = useState<View>("ritual");

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Nav */}
      <div className="border-b border-neutral-300 flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-5 py-3 text-[10px] uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              view === tab.id
                ? "border-neutral-800 text-neutral-800"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === "ritual" && <RitualMap />}
      {view === "speedbump" && <SpeedBump />}
      {view === "companion"  && <Companion />}
      {view === "instrument" && <InstrumentPanel />}
      {view === "signature"  && <SignatureInteraction />}
    </div>
  );
}
