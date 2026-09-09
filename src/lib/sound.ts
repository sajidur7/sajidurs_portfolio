/**
 * Synthesised UI feedback — no audio files to load, and nothing can play until
 * the visitor's first click creates the AudioContext, which keeps it on the
 * right side of browser autoplay policy.
 *
 * Everything is deliberately quiet and short (~120ms). `muted` is persisted so
 * a visitor who turns it off stays off; call `setMuted` from a toggle if one
 * gets added to the UI later.
 */
const STORAGE_KEY = "space:sound-muted";

/**
 * Raises a message on the cursor — the same pill the "C" shortcut uses.
 * Decoupled through an event so any component can call it without reaching
 * into the cursor's state.
 */
export const CURSOR_TOAST = "space:cursor-toast";

export function cursorToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CURSOR_TOAST, { detail: message }));
}

type Tone = "click" | "nav";

let context: AudioContext | null = null;
let muted: boolean | null = null;

function isMuted() {
  if (muted === null) {
    try {
      muted = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    /* private mode — the in-memory value still applies for this session */
  }
}

const TONES: Record<Tone, { from: number; to: number; peak: number }> = {
  click: { from: 880, to: 440, peak: 0.05 },
  nav: { from: 1320, to: 760, peak: 0.04 },
};

export function playTone(tone: Tone = "click") {
  if (typeof window === "undefined" || isMuted()) return;

  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();

    const { from, to, peak } = TONES[tone];
    const start = context.currentTime;

    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(from, start);
    osc.frequency.exponentialRampToValueAtTime(to, start + 0.09);

    // Ramp rather than a hard start/stop, so it reads as a tick and not a pop.
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);

    osc.connect(gain).connect(context.destination);
    osc.start(start);
    osc.stop(start + 0.14);
  } catch {
    /* audio unavailable — the UI works exactly the same without it */
  }
}
