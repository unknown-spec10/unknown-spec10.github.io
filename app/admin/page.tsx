import Link from "next/link";
import { readContent } from "@/lib/content-server";
import { requireSession } from "@/lib/auth";

export default async function AdminHome() {
  await requireSession();

  const content = await readContent();
  const rows = content.projects;
  const caps = content.capabilities;
  const prof = content.profile;

  const published = rows.filter((r) => (r as { published?: boolean }).published ?? true).length;

  return (
    <>
      <div className="ahead">
        <h1>Overview</h1>
        <p className="ahead__sub">Editing content/site.json — rebuild to publish.</p>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat__n">{rows.length}</span>
          <span className="stat__k">Projects</span>
          <span className="stat__s">{published} published</span>
        </div>
        <div className="stat">
          <span className="stat__n">{caps.length}</span>
          <span className="stat__k">Capability groups</span>
          <span className="stat__s">shown on the site</span>
        </div>
        <div className="stat">
          <span className="stat__n">{prof ? "1" : "0"}</span>
          <span className="stat__k">Profile</span>
          <span className="stat__s">{prof?.email || "not set"}</span>
        </div>
      </div>

      <div className="quick">
        <Link className="quick__item" href="/admin/projects">
          <span className="quick__t">Projects</span>
          <span className="quick__d">Add, edit, reorder and publish work.</span>
        </Link>
        <Link className="quick__item" href="/admin/profile">
          <span className="quick__t">Profile &amp; contact</span>
          <span className="quick__d">Headline, intro, email, links, education.</span>
        </Link>
        <Link className="quick__item" href="/admin/capabilities">
          <span className="quick__t">Capabilities</span>
          <span className="quick__d">The skill groups listed under Capabilities.</span>
        </Link>
      </div>

      {!prof ? (
        <p className="notice notice--err">
          content/site.json has no <code>profile</code> block — restore it from version control.
        </p>
      ) : null}
    </>
  );
}
