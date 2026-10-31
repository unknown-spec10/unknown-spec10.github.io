import Link from "next/link";
import { readContent } from "@/lib/content-server";
import { requireSession } from "@/lib/auth";
import { createProjectAction, moveProjectAction, togglePublishAction } from "../actions";

export default async function ProjectsPage() {
  await requireSession();

  const content = await readContent();
  const rows = content.projects;

  return (
    <>
      <div className="ahead">
        <h1>Projects</h1>
        <p className="ahead__sub">{rows.length} total · order here is the order on the site</p>
      </div>

      <form action={createProjectAction}>
        <button className="btn btn--primary" type="submit">
          + New project
        </button>
      </form>

      <ul className="plist">
        {rows.map((row, i) => {
          const published = (row as { published?: boolean }).published ?? true;

          return (
            <li className="prow" key={row.id}>
              <span className="prow__idx">{String(i + 1).padStart(2, "0")}</span>

              <Link className="prow__name" href={`/admin/projects/${row.id}`}>
                {row.name}
                {row.alias ? <span className="prow__alias">{row.alias}</span> : null}
              </Link>

              <span className={`pill ${published ? "pill--on" : "pill--off"}`}>
                {published ? "Published" : "Draft"}
              </span>

              <div className="prow__acts">
                <form
                  action={async () => {
                    "use server";
                    await moveProjectAction(row.id, "up");
                  }}
                >
                  <button className="icon-btn" type="submit" disabled={i === 0} aria-label="Move up">
                    ↑
                  </button>
                </form>

                <form
                  action={async () => {
                    "use server";
                    await moveProjectAction(row.id, "down");
                  }}
                >
                  <button className="icon-btn" type="submit" disabled={i === rows.length - 1} aria-label="Move down">
                    ↓
                  </button>
                </form>

                <form
                  action={async () => {
                    "use server";
                    await togglePublishAction(row.id);
                  }}
                >
                  <button className="ghost-btn" type="submit">
                    {published ? "Unpublish" : "Publish"}
                  </button>
                </form>

                <Link className="ghost-btn" href={`/admin/projects/${row.id}`}>
                  Edit
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {!rows.length ? <p className="empty">No projects yet. Create the first one.</p> : null}
    </>
  );
}
