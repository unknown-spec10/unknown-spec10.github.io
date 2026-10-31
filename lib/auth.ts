import { notFound } from "next/navigation";

export type Session = { email: string };

/**
 * There is no production admin any more: content is a file, and /admin exists
 * only while running the dev server. These helpers keep the admin pages
 * unchanged while making every one of them 404 in a production build.
 */
const isDev = process.env.NODE_ENV !== "production";

export async function getSession(): Promise<Session | null> {
  return isDev ? { email: "local" } : null;
}

export async function requireSession(): Promise<Session> {
  if (!isDev) notFound();
  return { email: "local" };
}

export async function createSession(_email: string): Promise<void> {}
export async function destroySession(): Promise<void> {}
