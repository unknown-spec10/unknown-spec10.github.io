"use client";

import { useEffect, useRef, useState } from "react";

/* One observer for every revealed element: adds .is-in once, never re-hides. */
export function RevealRoot() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-draw]")
    );
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

/* Rail navigation: marks the section currently crossing the read line. */
export function ScrollRail() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-rail-link]"));
    if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          links.forEach((link) => {
            const on = link.getAttribute("href") === `#${id}`;
            if (on) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "light" ? "light" : "dark");
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("dp-theme", next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }

  return (
    <button
      type="button"
      className="theme"
      onClick={toggle}
      aria-pressed={theme === "light"}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light" : "Dark"}
    >
      {ready && theme === "dark" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 1v1.8M8 13.2V15M1 8h1.8M13.2 8H15M2.8 2.8l1.3 1.3M11.9 11.9l1.3 1.3M13.2 2.8l-1.3 1.3M4.1 11.9l-1.3 1.3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M13.4 9.7A5.8 5.8 0 0 1 6.3 2.6a5.8 5.8 0 1 0 7.1 7.1Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

/* Kolkata clock — client-only to avoid a hydration mismatch. */
export function LocalTime() {
  const [time, setTime] = useState<string>("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }).format(new Date());

    setTime(format());
    timer.current = setInterval(() => setTime(format()), 30_000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return <span suppressHydrationWarning>{time || "--:--"} IST</span>;
}
