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

/*
  Two looks, and the difference is meaning rather than decoration. Accent is
  for the replies the page itself owes you — a page that does not exist yet, an
  address on your clipboard. Ink is for a label standing in for something the
  desktop shows on hover, so it matches that tooltip rather than raising its
  voice to the level of an answer.
*/
export type ToastTone = "accent" | "ink";

export type ToastDetail = { message: string; tone: ToastTone };

export function cursorToast(message: string, tone: ToastTone = "accent") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastDetail>(CURSOR_TOAST, { detail: { message, tone } }),
  );
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

function emit(ctx: AudioContext, tone: Tone) {
  const { from, to, peak } = TONES[tone];
  const start = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + 0.09);

  // Ramp rather than a hard start/stop, so it reads as a tick and not a pop.
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);

  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.14);
}

/**
 * Warms the audio context on the visitor's first interaction.
 *
 * Mobile Safari always hands back a suspended context and will not route Web
 * Audio at all until something has actually played through it, so this pushes a
 * one-frame silent buffer to open the tap. Must be called from inside a real
 * gesture handler.
 */
export function unlockAudio() {
  if (typeof window === "undefined") return;

  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();

    const source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    source.start(0);
  } catch {
    /* audio unavailable — the UI works exactly the same without it */
  }
}

export function playTone(tone: Tone = "click") {
  if (typeof window === "undefined" || isMuted()) return;

  try {
    context ??= new AudioContext();
    const ctx = context;

    /*
      A suspended context's clock has not started, so scheduling against
      currentTime aims at a moment that is already past by the time it
      resumes — silence. Desktop contexts are usually running by the first
      click, which is why this only ever showed up on a phone.
    */
    if (ctx.state === "suspended") {
      void ctx
        .resume()
        .then(() => emit(ctx, tone))
        .catch(() => {});
      return;
    }

    emit(ctx, tone);
  } catch {
    /* audio unavailable — the UI works exactly the same without it */
  }
}
