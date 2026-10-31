"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Capability, Metric, Project } from "@/lib/content";
import { readContent, slugify, writeContent } from "@/lib/content-server";
import { requireSession } from "@/lib/auth";

/**
 * `published` is not part of the public Project type (the site renders every
 * project in the file), but the admin still tracks it per project. It lives in
 * content/site.json as an optional extra key.
 */
type StoredProject = Project & { published?: boolean };

const emailSchema = z.string().trim().toLowerCase().email().max(200);

/* ------------------------------ profile ------------------------------ */

const profileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().max(80),
  headline: z.string().trim().min(1).max(200),
  headlineAccent: z.string().trim().max(80),
  headlineTail: z.string().trim().max(200),
  intro: z.string().trim().min(1).max(600),
  introStrong: z.string().trim().max(80),
  location: z.string().trim().max(120),
  availability: z.string().trim().max(80),
  email: emailSchema,
  linkedin: z.string().trim().url().max(300).or(z.literal("")),
  github: z.string().trim().url().max(300).or(z.literal("")),
  resumeUrl: z.string().trim().max(300),
  degree: z.string().trim().max(160),
  institution: z.string().trim().max(200),
  graduation: z.string().trim().max(40),
});

export async function saveProfileAction(_prev: unknown, formData: FormData) {
  await requireSession();

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the fields and try again." };
  }

  const content = await readContent();
  // Merge so keys the form doesn't render (focus, focusSub) survive the save.
  content.profile = { ...content.profile, ...parsed.data };
  await writeContent(content);

  revalidatePath("/admin/profile");
  revalidatePath("/");
  return { ok: "Profile saved." };
}

/* ------------------------------ projects ----------------------------- */

const projectSchema = z.object({
  name: z.string().trim().min(1).max(160),
  alias: z.string().trim().max(120),
  stack: z.string().trim().max(300),
  points: z.string().max(4000),
  metrics: z.string().max(2000),
  coverImage: z.string().trim().max(500),
  coverImageLight: z.string().trim().max(500),
  liveUrl: z.string().trim().max(400),
  repoUrl: z.string().trim().max(400),
  published: z.string().optional(),
});

function parseMetrics(raw: string): Metric[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, was, now] = line.split("|").map((part) => part.trim());
      return { label: label ?? "", was: was || undefined, now: now ?? "" };
    })
    .filter((m) => m.label && m.now);
}

function parsePoints(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function uniqueSlug(taken: { slug: string }[], base: string) {
  let slug = base;
  let n = 2;
  while (taken.some((p) => p.slug === slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export async function createProjectAction() {
  await requireSession();

  const content = await readContent();
  const name = "Untitled project";

  const project: StoredProject = {
    id: content.projects.length + 1,
    slug: uniqueSlug(content.projects, slugify(name) || "project"),
    name,
    alias: "",
    stack: "",
    points: ["First achievement line."],
    metrics: [{ label: "Metric", now: "0" }],
    coverImage: "",
    coverImageLight: "",
    liveUrl: "",
    repoUrl: "",
    published: false,
  };

  content.projects.push(project);
  await writeContent(content);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProjectAction(id: number, _prev: unknown, formData: FormData) {
  await requireSession();

  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the fields and try again." };
  }

  const content = await readContent();
  const index = content.projects.findIndex((p) => p.id === id);
  if (index < 0) return { error: "That project no longer exists." };

  const { points, metrics, published, ...rest } = parsed.data;

  const updated: StoredProject = {
    ...content.projects[index],
    ...rest,
    points: parsePoints(points),
    metrics: parseMetrics(metrics),
    published: published === "on",
  };
  content.projects[index] = updated;
  await writeContent(content);

  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { ok: "Project saved." };
}

export async function deleteProjectAction(id: number) {
  await requireSession();

  const content = await readContent();
  content.projects = content.projects.filter((p) => p.id !== id);
  await writeContent(content);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function moveProjectAction(id: number, direction: "up" | "down") {
  await requireSession();

  const content = await readContent();
  const index = content.projects.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= content.projects.length) return;

  [content.projects[index], content.projects[swapWith]] = [
    content.projects[swapWith],
    content.projects[index],
  ];
  await writeContent(content);

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function togglePublishAction(id: number) {
  await requireSession();

  const content = await readContent();
  const project = content.projects.find((p) => p.id === id) as StoredProject | undefined;
  if (!project) return;

  project.published = !(project.published ?? true);
  await writeContent(content);

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

/* ---------------------------- capabilities --------------------------- */

export async function saveCapabilityAction(_prev: unknown, formData: FormData) {
  await requireSession();

  const id = Number(formData.get("id") ?? 0);
  const group = String(formData.get("group") ?? "").trim();
  const items = String(formData.get("items") ?? "").trim();

  if (!group || !items) return { error: "Group and items are both required." };

  const content = await readContent();
  const index = id ? content.capabilities.findIndex((c) => c.id === id) : -1;

  if (index >= 0) {
    const current = content.capabilities[index];
    content.capabilities[index] = { ...current, group, items };
  } else {
    const row: Capability = { id: content.capabilities.length + 1, group, items };
    content.capabilities.push(row);
  }

  await writeContent(content);

  revalidatePath("/admin/capabilities");
  revalidatePath("/");
  return { ok: "Saved." };
}

export async function deleteCapabilityAction(id: number) {
  await requireSession();

  const content = await readContent();
  content.capabilities = content.capabilities.filter((c) => c.id !== id);
  await writeContent(content);

  revalidatePath("/admin/capabilities");
  revalidatePath("/");
}
