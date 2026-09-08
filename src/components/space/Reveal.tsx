"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Fades and lifts its child into place the first time it reaches the viewport,
 * then disconnects — nothing re-animates on the way back up.
 *
 * It renders the element itself rather than wrapping it, so the caller keeps
 * control of layout classes and the markup stays flat. Anything it does not
 * recognise is forwarded to that element, which lets callers attach ARIA and
 * pointer handlers directly.
 */
type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  children: ReactNode;
} & Record<string, unknown>;

export function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support: show it on the next frame rather than never.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      {...rest}
      ref={ref}
      data-shown={shown}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
