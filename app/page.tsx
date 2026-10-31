import { LocalTime, RevealRoot, ScrollRail, ThemeToggle } from "./components/site-client";
import { site } from "@/lib/content";

function External({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5 8.5 3.5M4.5 3.5H8.5V7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Renders the intro with its emphasised phrase in brighter ink. */
function renderIntro(text: string, strong?: string) {
  if (!strong || !text.includes(strong)) return text;
  const [before, ...rest] = text.split(strong);
  return (
    <>
      {before}
      <strong>{strong}</strong>
      {rest.join(strong)}
    </>
  );
}

export default function Page() {
  const p = site.profile;
  const work = site.projects.filter((project) => project.published !== false);
  const caps = site.capabilities;

  if (!p) {
    return (
      <div className="shell">
        <div className="wrap" style={{ padding: "96px 0" }}>
          <p className="mono">No content yet — fill in content/site.json.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RevealRoot />
      <ScrollRail />

      <aside className="rail" aria-label="Section index">
        <div className="rail__mark">DP</div>

        <nav className="rail__nav">
          <a className="rail__link" href="#work" data-rail-link aria-label="Work">
            01
          </a>
          <a className="rail__link" href="#capabilities" data-rail-link aria-label="Capabilities">
            02
          </a>
          <a className="rail__link" href="#education" data-rail-link aria-label="Education">
            03
          </a>
          <a className="rail__link" href="#contact" data-rail-link aria-label="Contact">
            04
          </a>
        </nav>

        <div className="rail__foot">
          <span className="rail__dot" aria-hidden="true" />
          <span className="rail__vert">{p.location} · IST</span>
        </div>
      </aside>

      <div className="shell">
        <div className="wrap">
          <div className="topbar">
            <div className="topbar__left">
              <span className="mono" style={{ color: "var(--ink)" }}>
                {p.name}
              </span>
              <span className="mono">{p.role}</span>
            </div>
            <div className="topbar__right">
              <span className="mono">
                <LocalTime />
              </span>
              <ThemeToggle />
            </div>
          </div>

          <main id="top">
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero__load">
                <span className="hero__eyebrow">
                  <i aria-hidden="true" />
                  {p.availability} — AI engineering &amp; backend roles
                </span>

                <h1 id="hero-title">
                  {p.headline} <em>{p.headlineAccent}</em> {p.headlineTail}
                </h1>

                <p className="hero__sub">{renderIntro(p.intro, p.introStrong)}</p>

                <div className="hero__actions">
                  <a className="btn btn--solid" href="#work">
                    See the work
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <a className="btn btn--ghost" href={p.resumeUrl} download>
                    Download CV
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M8 2.5v7M5 7l3 3 3-3M3 13h10"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <dl className="spec" data-reveal style={{ ["--d" as string]: "180ms" }}>
                <div className="spec__row">
                  <dt className="spec__k">Based</dt>
                  <dd className="spec__v">{p.location}</dd>
                </div>
                <div className="spec__row">
                  <dt className="spec__k">Focus</dt>
                  <dd className="spec__v">
                    {p.focus}
                    {p.focusSub ? <small>{p.focusSub}</small> : null}
                  </dd>
                </div>
                <div className="spec__row">
                  <dt className="spec__k">Degree</dt>
                  <dd className="spec__v">
                    {p.degree}
                    <small>Graduating {p.graduation}</small>
                  </dd>
                </div>
                <div className="spec__row">
                  <dt className="spec__k">Status</dt>
                  <dd className="spec__v" style={{ color: "var(--ok)" }}>
                    {p.availability}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="section" id="work" aria-labelledby="work-title">
              <div className="section__head">
                <h2 className="section__title" id="work-title">
                  <span>01</span> Selected work
                </h2>
                <span className="mono">
                  {work.length} system{work.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="rule" data-draw />

              {work.map((project, i) => (
                <article
                  className="proj"
                  key={project.slug}
                  data-reveal
                  style={{ ["--d" as string]: `${i * 70}ms` }}
                >
                  <div className="proj__idx">{String(i + 1).padStart(2, "0")}</div>

                  <div>
                    <div className="proj__head">
                      <h3 className="proj__name">{project.name}</h3>
                      <span className="proj__stack">{project.stack}</span>
                    </div>

                    <div className="proj__body">
                      {project.coverImage ? (
                        <figure
                          className="proj__cover"
                          style={
                            {
                              "--shot-dark": `url("${project.coverImage}")`,
                              "--shot-light": `url("${project.coverImageLight || project.coverImage}")`,
                            } as React.CSSProperties
                          }
                        >
                          <figcaption>
                            <span>System diagram</span>
                            <span className="proj__cover-meta">{project.alias}</span>
                          </figcaption>
                          <div
                            className="proj__shot"
                            role="img"
                            aria-label={`${project.name} — system architecture diagram`}
                          />
                        </figure>
                      ) : null}

                      <ul className="proj__points">
                        {(project.points ?? []).map((point) => (
                          <li key={point.slice(0, 32)}>{point}</li>
                        ))}
                      </ul>

                      {(project.metrics ?? []).length ? (
                        <dl className="metrics">
                          {(project.metrics ?? []).map((m) => (
                            <div className="metric" key={m.label}>
                              <dt className="metric__label">{m.label}</dt>
                              <dd className="metric__val">
                                {m.was ? (
                                  <>
                                    <i>{m.was}</i>
                                    <i aria-hidden="true">→</i>
                                  </>
                                ) : null}
                                <u>{m.now}</u>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}

                      {project.liveUrl || project.repoUrl ? (
                        <div className="proj__links">
                          {project.liveUrl ? (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              Live demo <External />
                            </a>
                          ) : null}
                          {project.repoUrl ? (
                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                              Code <External />
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="section" id="capabilities" aria-labelledby="cap-title">
              <div className="section__head">
                <h2 className="section__title" id="cap-title">
                  <span>02</span> Capabilities
                </h2>
                <span className="mono">Working stack</span>
              </div>
              <div className="rule" data-draw />

              <dl className="caps">
                {caps.map((c, i) => (
                  <div className="cap" key={c.group} data-reveal style={{ ["--d" as string]: `${i * 45}ms` }}>
                    <dt>{c.group}</dt>
                    <dd>{c.items}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="section" id="education" aria-labelledby="edu-title">
              <div className="section__head">
                <h2 className="section__title" id="edu-title">
                  <span>03</span> Education
                </h2>
              </div>

              <dl className="edu" data-reveal>
                <dt>Degree</dt>
                <dd>
                  <strong>{p.degree}</strong> <span>— {p.institution}</span>
                </dd>
                <dt style={{ marginTop: 12 }}>Graduating</dt>
                <dd style={{ marginTop: 12 }}>{p.graduation}</dd>
              </dl>
            </section>

            <section className="contact" id="contact" aria-labelledby="contact-title">
              <div className="section__head">
                <h2 className="section__title" id="contact-title">
                  <span>04</span> Contact
                </h2>
                <span className="mono">{p.availability}</span>
              </div>
              <div className="rule" data-draw />

              <p className="contact__lead" style={{ marginTop: 28 }} data-reveal>
                Backend and AI engineering roles — systems that ship and hold up. Email is the
                fastest way to reach me.
              </p>

              <a className="contact__mail" href={`mailto:${p.email}`} data-reveal>
                {p.email}
              </a>

              <ul className="contact__links" data-reveal>
                {p.linkedin ? (
                  <li>
                    <a className="contact__link" href={p.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn <External />
                      <span className="sr-only">opens in a new tab</span>
                    </a>
                  </li>
                ) : null}
                {p.github ? (
                  <li>
                    <a className="contact__link" href={p.github} target="_blank" rel="noopener noreferrer">
                      GitHub <External />
                      <span className="sr-only">opens in a new tab</span>
                    </a>
                  </li>
                ) : null}
                <li>
                  <a className="contact__link" href={p.resumeUrl} download>
                    Résumé
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M8 2.5v7M5 7l3 3 3-3M3 13h10"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              </ul>

              <footer className="foot">
                <span className="foot__l">
                  © {new Date().getFullYear()} {p.name}
                </span>
                <span className="foot__r">
                  <span>{p.location}</span>
                  <span aria-hidden="true">/</span>
                  <span>
                    <LocalTime />
                  </span>
                </span>
              </footer>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
