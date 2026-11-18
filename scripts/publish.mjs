#!/usr/bin/env node
/**
 * Publishes a content change.
 *
 * GitHub Actions builds and deploys on every push to main, so this only has to
 * commit the content and push — there is no build or upload step locally.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

// No shell: on Windows `shell: true` joins the argv into one string and cmd.exe re-splits it, so
// `git commit -m "content: update 2026-11-17 18:42"` became `git commit -m content: update ...`
// and failed with `pathspec 'update' did not match any file(s) known to git`.
const GIT = process.platform === "win32" ? "git.exe" : "git";

const run = (args, opts = {}) =>
  execFileSync(GIT, args, { stdio: "inherit", ...opts });

const quiet = (args) =>
  execFileSync(GIT, args, { encoding: "utf8" }).trim();

// `public/uploads` is optional — a site whose covers are remote URLs has no such directory, and
// `git add` on a missing path fails the whole publish.
const paths = ["-A", "content"];
if (existsSync("public/uploads")) paths.push("public/uploads");
run(["add", ...paths]);

const staged = quiet(["diff", "--cached", "--name-only"]);
if (!staged) {
  console.log("› nothing to publish — content is unchanged.");
  process.exit(0);
}

console.log("› changed:\n" + staged.split("\n").map((f) => "  " + f).join("\n"));

const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
run(["commit", "-m", `content: update ${stamp}`]);
run(["push", "origin", "main"]);

console.log("\n› pushed — GitHub Actions is building the site (~1 min)");
console.log("› https://unknown-spec10.github.io");
