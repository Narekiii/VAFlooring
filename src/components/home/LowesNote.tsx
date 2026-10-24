import { facts } from "@/content/site";
import styles from "./LowesNote.module.css";

/** Credibility note, intentionally quieter than the V & A brand. Text reference only — no third-party logos. */
export function LowesNote() {
  return (
    <p className={styles.note}>{facts.lowesLine}</p>
  );
}
