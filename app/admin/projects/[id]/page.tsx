import { notFound } from "next/navigation";
import { readContent } from "@/lib/content-server";
import { requireSession } from "@/lib/auth";
import { ProjectForm } from "../../_forms";
import { deleteProjectAction, updateProjectAction } from "../../actions";
import Link from "next/link";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();

  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) notFound();

  const content = await readContent();
  const project = content.projects.find((p) => p.id === projectId);
  if (!project) notFound();

  const published = (project as { published?: boolean }).published ?? true;

  const metricsText = (project.metrics ?? [])
    .map((m) => [m.label, m.was ?? "", m.now].join(" | "))
    .join("\n");

  const action = updateProjectAction.bind(null, project.id);
  const remove = deleteProjectAction.bind(null, project.id);

  return (
    <>
      <div className="ahead">
        <Link className="back" href="/admin/projects">
          ← Projects
        </Link>
        <h1>{project.name}</h1>
        <p className="ahead__sub">
          /{project.slug} · {published ? "published" : "draft"}
        </p>
      </div>

      <ProjectForm
        action={action}
        deleteAction={remove}
        project={{
          id: project.id,
          name: project.name,
          alias: project.alias,
          stack: project.stack,
          points: project.points ?? [],
          metrics: metricsText,
          coverImage: project.coverImage,
          coverImageLight: project.coverImageLight,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
          published,
        }}
      />
    </>
  );
}
