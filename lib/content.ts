import raw from "@/content/site.json";

export type Metric = { label: string; was?: string; now: string };

export type Project = {
  id: number;
  slug: string;
  name: string;
  alias: string;
  stack: string;
  points: string[];
  metrics: Metric[];
  coverImage: string;
  coverImageLight: string;
  liveUrl: string;
  repoUrl: string;
  published?: boolean;
};

export type Capability = { id: number; group: string; items: string };

export type Profile = {
  name: string;
  role: string;
  headline: string;
  headlineAccent: string;
  headlineTail: string;
  intro: string;
  introStrong: string;
  location: string;
  availability: string;
  email: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  degree: string;
  institution: string;
  graduation: string;
  focus: string;
  focusSub: string;
};

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  capabilities: Capability[];
};

/**
 * The whole site's content, read from content/site.json at build time.
 * There is no database: editing content means editing that file (or using the
 * local admin at /admin in `npm run studio`) and rebuilding.
 */
export const site = raw as SiteContent;
