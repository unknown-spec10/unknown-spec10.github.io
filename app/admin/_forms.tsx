"use client";

import { useActionState } from "react";
import { useState } from "react";
import type { ReactNode } from "react";

type State = { ok?: string; error?: string } | null;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="fld">
      <span className="fld__k">{label}</span>
      {children}
      {hint ? <span className="fld__hint">{hint}</span> : null}
    </label>
  );
}

function Notice({ state }: { state: State }) {
  if (!state) return null;
  if (state.error) return <p className="notice notice--err">{state.error}</p>;
  if (state.ok) return <p className="notice notice--ok">{state.ok}</p>;
  return null;
}

/* -------------------------------- profile -------------------------------- */

export function ProfileForm({
  action,
  profile,
}: {
  action: (prev: State, fd: FormData) => Promise<State>;
  profile: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form className="panel" action={formAction}>
      <Notice state={state} />

      <div className="grid2">
        <Field label="Name">
          <input name="name" defaultValue={profile.name} required />
        </Field>
        <Field label="Role label" hint="Small label beside your name in the top bar.">
          <input name="role" defaultValue={profile.role} />
        </Field>
      </div>

      <Field label="Headline — start" hint="Rendered large. Keep it short.">
        <input name="headline" defaultValue={profile.headline} required />
      </Field>

      <div className="grid2">
        <Field label="Headline — accent phrase" hint="Shown in italic serif accent colour.">
          <input name="headlineAccent" defaultValue={profile.headlineAccent} />
        </Field>
        <Field label="Headline — end">
          <input name="headlineTail" defaultValue={profile.headlineTail} />
        </Field>
      </div>

      <Field label="Intro paragraph">
        <textarea name="intro" rows={3} defaultValue={profile.intro} required />
      </Field>

      <Field label="Emphasised phrase in intro" hint="Rendered in brighter ink.">
        <input name="introStrong" defaultValue={profile.introStrong} />
      </Field>

      <div className="grid2">
        <Field label="Location">
          <input name="location" defaultValue={profile.location} />
        </Field>
        <Field label="Availability">
          <input name="availability" defaultValue={profile.availability} />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Contact email">
          <input name="email" type="email" defaultValue={profile.email} required />
        </Field>
        <Field label="Résumé URL">
          <input name="resumeUrl" defaultValue={profile.resumeUrl} />
        </Field>
      </div>

      <div className="grid2">
        <Field label="LinkedIn URL">
          <input name="linkedin" defaultValue={profile.linkedin} />
        </Field>
        <Field label="GitHub URL">
          <input name="github" defaultValue={profile.github} />
        </Field>
      </div>

      <div className="grid3">
        <Field label="Degree">
          <input name="degree" defaultValue={profile.degree} />
        </Field>
        <Field label="Institution">
          <input name="institution" defaultValue={profile.institution} />
        </Field>
        <Field label="Graduation">
          <input name="graduation" defaultValue={profile.graduation} />
        </Field>
      </div>

      <div className="actions">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------- project -------------------------------- */

export function ProjectForm({
  action,
  project,
  deleteAction,
}: {
  action: (prev: State, fd: FormData) => Promise<State>;
  project: {
    id: number;
    name: string;
    alias: string;
    stack: string;
    points: string[];
    metrics: string;
    coverImage: string;
    coverImageLight: string;
    liveUrl: string;
    repoUrl: string;
    published: boolean;
  };
  deleteAction: () => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [cover, setCover] = useState(project.coverImage);
  const [coverLight, setCoverLight] = useState(project.coverImageLight);
  const [uploading, setUploading] = useState<"dark" | "light" | null>(null);
  const [uploadError, setUploadError] = useState("");

  async function upload(file: File, apply: (url: string) => void, which: "dark" | "light") {
    setUploading(which);
    setUploadError("");
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      apply(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <form className="panel" action={formAction}>
      <Notice state={state} />
      {uploadError ? <p className="notice notice--err">{uploadError}</p> : null}

      <div className="grid2">
        <Field label="Project name">
          <input name="name" defaultValue={project.name} required />
        </Field>
        <Field label="Sub-label" hint="Shown beside the name in the list, e.g. “Career Sync”.">
          <input name="alias" defaultValue={project.alias} />
        </Field>
      </div>

      <Field label="Stack line" hint="Separate technologies with ·">
        <input name="stack" defaultValue={project.stack} />
      </Field>

      <Field label="Achievement lines" hint="One per line. Each becomes a bullet.">
        <textarea name="points" rows={6} defaultValue={project.points.join("\n")} />
      </Field>

      <Field
        label="Metrics"
        hint="One per line: Label | before | after. Leave the middle empty for a single value."
      >
        <textarea name="metrics" rows={4} defaultValue={project.metrics} />
      </Field>

      <div className="grid2">
        <Field label="Cover — dark theme" hint="Shown when the site is in dark mode.">
          <input name="coverImage" value={cover} onChange={(e) => setCover(e.target.value)} />
        </Field>
        <Field label="Cover — light theme" hint="Falls back to the dark image when empty.">
          <input name="coverImageLight" value={coverLight} onChange={(e) => setCoverLight(e.target.value)} />
        </Field>
      </div>

      <div className="grid2">
        <div className="fld">
          <span className="fld__k">Upload dark</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file, setCover, "dark");
            }}
            disabled={uploading === "dark"}
          />
          <span className="fld__hint">{uploading === "dark" ? "Uploading…" : "PNG, JPEG, WebP or AVIF · max 6 MB"}</span>
        </div>
        <div className="fld">
          <span className="fld__k">Upload light</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file, setCoverLight, "light");
            }}
            disabled={uploading === "light"}
          />
          <span className="fld__hint">{uploading === "light" ? "Uploading…" : "Same size as the dark cover reads best"}</span>
        </div>
      </div>

      <div className="grid2">
        <Field label="Live URL">
          <input name="liveUrl" defaultValue={project.liveUrl} />
        </Field>
        <Field label="Repository URL">
          <input name="repoUrl" defaultValue={project.repoUrl} />
        </Field>
      </div>

      <label className="check">
        <input type="checkbox" name="published" defaultChecked={project.published} />
        <span>Published — visible on the site</span>
      </label>

      <div className="actions">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save project"}
        </button>
        <button
          className="btn btn--danger"
          type="submit"
          formAction={deleteAction}
          onClick={(e) => {
            if (!confirm("Delete this project? This cannot be undone.")) e.preventDefault();
          }}
        >
          Delete
        </button>
      </div>
    </form>
  );
}

/* ------------------------------ capability ------------------------------- */

export function CapabilityForm({
  action,
  capability,
  deleteAction,
}: {
  action: (prev: State, fd: FormData) => Promise<State>;
  capability?: { id: number; group: string; items: string };
  deleteAction?: () => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form className="cap-form" action={formAction}>
      <Notice state={state} />
      {capability ? <input type="hidden" name="id" value={capability.id} /> : null}
      <div className="cap-form__row">
        <input className="cap-form__group" name="group" placeholder="Group" defaultValue={capability?.group ?? ""} required />
        <input className="cap-form__items" name="items" placeholder="Comma-separated skills" defaultValue={capability?.items ?? ""} required />
      </div>
      <div className="cap-form__actions">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : capability ? "Save" : "Add group"}
        </button>
        {deleteAction ? (
          <button
            className="btn btn--ghost"
            type="submit"
            formAction={deleteAction}
            onClick={(e) => {
              if (!confirm("Remove this group?")) e.preventDefault();
            }}
          >
            Remove
          </button>
        ) : null}
      </div>
    </form>
  );
}

