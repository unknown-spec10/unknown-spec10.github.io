import { readContent } from "@/lib/content-server";
import { requireSession } from "@/lib/auth";
import { ProfileForm } from "../_forms";
import { saveProfileAction } from "../actions";

export default async function ProfilePage() {
  await requireSession();

  const content = await readContent();
  const row = content.profile;

  if (!row) {
    return (
      <p className="notice notice--err">
        content/site.json has no <code>profile</code> block — restore it from version control.
      </p>
    );
  }

  const values = {
    name: row.name,
    role: row.role,
    headline: row.headline,
    headlineAccent: row.headlineAccent,
    headlineTail: row.headlineTail,
    intro: row.intro,
    introStrong: row.introStrong,
    location: row.location,
    availability: row.availability,
    email: row.email,
    linkedin: row.linkedin,
    github: row.github,
    resumeUrl: row.resumeUrl,
    degree: row.degree,
    institution: row.institution,
    graduation: row.graduation,
  };

  return (
    <>
      <div className="ahead">
        <h1>Profile &amp; contact</h1>
        <p className="ahead__sub">Everything here renders on the public page.</p>
      </div>
      <ProfileForm action={saveProfileAction} profile={values} />
    </>
  );
}
