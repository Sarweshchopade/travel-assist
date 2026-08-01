import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, Volume2 } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel } from "../../components/Panel";

export default function Language() {
  const { plan } = useTrip();
  const [playing, setPlaying] = useState(null);
  if (!plan?.language) return null;
  const { localLanguage, phrases } = plan.language;

  const speak = (text, id) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    setPlaying(id);
    utterance.onend = () => setPlaying(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-5">
      <Panel title={`Local language: ${localLanguage}`} icon={Languages}>
        <p className="text-sm text-mist">
          Handy phrases from the Language Agent — tap the speaker to hear them.
        </p>
      </Panel>

      <div className="grid sm:grid-cols-2 gap-4">
        {phrases?.map((p, i) => (
          <motion.div
            key={p.phrase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card-glass rounded-2xl p-5 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm text-mist">{p.phrase}</p>
              <p className="font-display text-lg text-paper">{p.translation}</p>
              <p className="text-xs text-teal mt-1">/{p.pronunciation}/</p>
            </div>
            <button
              onClick={() => speak(p.translation, p.phrase)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                playing === p.phrase
                  ? "bg-marigold border-marigold text-ink"
                  : "border-border text-mist hover:text-marigold hover:border-marigold"
              }`}
              aria-label={`Play pronunciation of ${p.translation}`}
            >
              <Volume2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
