import fs from "node:fs/promises";
import path from "node:path";
import type { SiteContent } from "./content";

const FILE = path.join(process.cwd(), "content", "site.json");

/** Reads the content file. Used only by the local admin. */
export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(FILE, "utf8");
  return JSON.parse(raw) as SiteContent;
}

/** Writes the content file back, formatted so diffs stay readable. */
export async function writeContent(next: SiteContent): Promise<void> {
  const projects = next.projects.map((p, i) => ({ ...p, id: i + 1 }));
  const capabilities = next.capabilities.map((c, i) => ({ ...c, id: i + 1 }));

  const sorted: SiteContent = { profile: next.profile, projects, capabilities };
  await fs.writeFile(FILE, JSON.stringify(sorted, null, 2) + "\n");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
