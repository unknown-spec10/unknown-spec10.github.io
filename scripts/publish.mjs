#!/usr/bin/env node
/**
 * Publishes a content change.
 *
 * GitHub Actions builds and deploys on every push to main, so this only has to
 * commit the content and push — there is no build or upload step locally.
 */
import { execFileSync } from "node:child_process";

const run = (args, opts = {}) =>
  execFileSync("git", args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });

const quiet = (args) =>
  execFileSync("git", args, { encoding: "utf8", shell: process.platform === "win32" }).trim();

run(["add", "-A", "content", "public/uploads"]);

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
