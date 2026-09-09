"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * The booking panel behind "Let's Talk" and "Work With Me".
 *
 * It behaves like the expanded work image on purpose: same softened backdrop,
 * same dismissal model. There is no close button — clicking the free space
 * around the panel closes it, and Escape does too for keyboard users.
 *
 * This uses Cal's own embed script rather than a plain <iframe> of the booking
 * page. A bare iframe loads the full Cal page, whose body paints the theme
 * background, so the booker card ends up sitting on a black slab. The embed
 * script mounts the booker with a transparent background and sizes the frame to
 * its content, which is what leaves only the card floating over the blurred
 * page.
 *
 * Lives in a context so the two buttons, which sit in different server
 * components, can both open the one panel without prop-drilling a callback
 * through them.
 */
const CAL_LINK = "sajidur-rahman-n6b6ry/30min";
const CAL_NAMESPACE = "booking";
const EXIT_MS = 380;

/*
  The one thing the embed does not make transparent on its own. `cal-bg` is the
  booker's page ground, and it paints an opaque slab out to the edges of the
  frame — white on the light theme, near-black on the dark one. Either way it
  shows against our own backdrop.

  Only this variable: `cal-bg-emphasis` and the rest still give the date cells
  and the time slots their fills.
*/
const CAL_UI = {
  layout: "month_view",
  /*
    Always dark, and not a bug: the backdrop behind this is a dark wash in both
    themes, so the booker is on a dark ground either way. Following the site
    theme here would put a light booker on that dark wash.
  */
  theme: "dark",
  hideEventTypeDetails: false,
  /*
    `cal-bg` is the booker's page ground, and it paints an opaque slab out to
    the edges of the frame — white on the light theme, near-black on the dark
    one. Either way it shows against our own backdrop. Both entries are
    transparent, so it does not matter which set Cal resolves.

    Only this variable: `cal-bg-emphasis` and the rest still give the date
    cells and the time slots their fills.
  */
  cssVarsPerTheme: {
    light: { "cal-bg": "transparent" },
    dark: { "cal-bg": "transparent" },
  },
};

type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, (...args: unknown[]) => void>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/** Cal's published loader snippet, transcribed. */
function loadCal() {
  if (window.Cal) return;

  const push = (target: { q?: unknown[] }, args: unknown) => {
    target.q = target.q || [];
    target.q.push(args);
  };

  const cal = function (...args: unknown[]) {
    const self = window.Cal as CalApi;

    if (!self.loaded) {
      self.ns = {};
      self.q = self.q || [];
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      document.head.append(script);
      self.loaded = true;
    }

    if (args[0] === "init") {
      const api = function (...inner: unknown[]) {
        push(api as unknown as { q?: unknown[] }, inner);
      } as CalApi;
      api.q = api.q || [];

      const namespace = args[1];
      if (typeof namespace === "string") {
        self.ns![namespace] = self.ns![namespace] || (api as (...a: unknown[]) => void);
        push(self.ns![namespace] as unknown as { q?: unknown[] }, args);
        push(self, ["initNamespace", namespace]);
      } else {
        push(self, args);
      }
      return;
    }

    push(self, args);
  } as CalApi;

  window.Cal = cal;
}

const BookingContext = createContext<() => void>(() => {});

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  const openPanel = useCallback(() => {
    setClosing(false);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, EXIT_MS);
  }, []);

  // Mount the booker once the panel is actually opened, so nothing from Cal is
  // fetched for visitors who never click.
  useEffect(() => {
    if (!open) return;
    const mount = mountRef.current;
    if (!mount || mount.childElementCount > 0) return;

    loadCal();
    const Cal = window.Cal!;

    Cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" });
    /*
      `ui` before `inline`, which is the reverse of Cal's published snippet.

      On the first open it makes no difference — the embed script has not
      loaded, so both calls sit in a queue and are applied together. On a
      reopen the script is already there, `inline` builds the iframe
      synchronously, and a `ui` sent afterwards arrives as a message the
      booker may already have rendered past: the transparent ground was lost
      and the white slab came back, but only from the second open onward.
    */
    const applyUi = () => Cal.ns![CAL_NAMESPACE]("ui", CAL_UI);

    applyUi();

    Cal.ns![CAL_NAMESPACE]("inline", {
      elementOrSelector: mount,
      calLink: CAL_LINK,
      config: { layout: "month_view", theme: CAL_UI.theme },
    });

    /*
      And once more when the booker says it is ready.

      Layout and theme survive the trip because Cal folds them into the iframe
      URL — you can read them back off the src. `cssVarsPerTheme` cannot go in
      a URL, so it is delivered to the frame as a message, and a message sent
      before the frame exists lands nowhere. Registering it up front is what
      keeps the theme right on a reopen; re-sending it here is what actually
      makes the ground transparent.
    */
    Cal.ns![CAL_NAMESPACE]("on", {
      action: "linkReady",
      /*
        The whole config again, not just the variables. Sent on its own, Cal
        has no theme to resolve `cssVarsPerTheme` against and falls back to its
        default ground — which is how a white slab appeared behind a booker
        that was still rendering dark.
      */
      callback: applyUi,
    });

    /*
      And again on a timer, because none of the above is a guarantee.

      Everything except the CSS variables reaches the booker through its URL.
      The variables travel as a message, so they only stick if they arrive
      while the booker is listening — and that window moves with the network,
      the embed script's own load, and whether this is a first open or a
      reopen. Miss it and an opaque slab sits behind the card.

      The call is idempotent, so re-asserting it a few times over the first
      few seconds costs nothing and closes every gap the event alone leaves.
    */
    const retries = [300, 900, 2000, 4000].map((ms) => window.setTimeout(applyUi, ms));

    return () => retries.forEach((id) => window.clearTimeout(id));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closePanel]);

  return (
    <BookingContext.Provider value={openPanel}>
      {children}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Book a 30 minute call"
          onClick={closePanel}
          data-open={!closing}
          /* The shared modal wash, matching the expanded-work backdrop. */
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-[var(--scrim-modal)] p-[16px] opacity-0 transition-opacity duration-[380ms] ease-[var(--ease-smooth)] data-[open=true]:opacity-100 sm:p-[40px]"
        >
          {/*
            No background, border or shadow here: the embed brings its own card
            and keeps everything around it transparent, so anything painted on
            this wrapper would read as a slab behind Cal's UI.
          */}
          <div
            ref={mountRef}
            onClick={(event) => event.stopPropagation()}
            data-open={!closing}
            className="max-h-full w-full max-w-[1180px] scale-[0.97] cursor-default overflow-auto transition-transform duration-[380ms] ease-[var(--ease-smooth)] data-[open=true]:scale-100"
          />
        </div>
      )}
    </BookingContext.Provider>
  );
}
