"use client";

import { useEffect, useState } from "react";

/**
 * Figma node 1:115. The frame shows a frozen time, so that exact string is what
 * renders on the server and on the first client paint — no hydration mismatch —
 * and the real clock takes over on mount.
 */
const DESIGN_TIME = "12: 05: 16 GMT +6";
const OFFSET_HOURS = 6;

function nowInOffset() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const there = new Date(utc + OFFSET_HOURS * 3_600_000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(there.getHours())}: ${pad(there.getMinutes())}: ${pad(there.getSeconds())} GMT +${OFFSET_HOURS}`;
}

export function Clock() {
  const [label, setLabel] = useState(DESIGN_TIME);

  useEffect(() => {
    const tick = () => setLabel(nowInOffset());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="text-trim whitespace-nowrap text-right font-body text-[14px] leading-normal tabular-nums text-muted">
      {label}
    </p>
  );
}
