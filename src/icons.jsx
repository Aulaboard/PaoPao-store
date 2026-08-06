import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

// Hand-drawn barbell glyph, small sizes (nav, logo, product placeholder, footer).
// We draw this ourselves instead of relying on a third-party "dumbbell" icon,
// since that glyph rendered as a broken/garbled shape on some devices.
export function BarbellIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="4" cy="12" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="12" r="2.6" stroke="currentColor" strokeWidth="2" />
      <line x1="4" y1="8.6" x2="4" y2="15.4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="8.6" x2="20" y2="15.4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Larger, wider barbell illustration used once as quiet hero decoration.
export function BarbellArt({ className, style }) {
  return (
    <svg viewBox="0 0 220 90" fill="none" className={className} style={style}>
      <rect x="18" y="38" width="184" height="6" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <rect x="6" y="20" width="20" height="42" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <rect x="194" y="20" width="20" height="42" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <rect x="0" y="28" width="10" height="26" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <rect x="210" y="28" width="10" height="26" rx="3" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

// Maps a serializable icon key (stored in content.json / localStorage) to a component.
export const TRUST_ICON_MAP = {
  truck: Truck,
  shield: ShieldCheck,
  rotate: RotateCcw,
};
