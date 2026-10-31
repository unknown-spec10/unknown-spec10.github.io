#!/usr/bin/env node
/**
 * Publishes content changes: builds to catch mistakes, commits the content and
 * any new images, then tells you the deploy command.
 *
 * Run with `npm run publish`.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

// Windows refuses to spawn .cmd shims without a shell, so every command runs
// through cmd.exe. All arguments here are fixed strings, never user input.
const run = (cmd, args, opts = {}) =>
  process.platform === "win32"
    ? execFileSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", [cmd, ...args].join(" ")], {
        stdio: "inherit",
        ...opts,
      })
    : execFileSync(cmd, args, { stdio: "inherit", ...opts });

console.log("\n› building (this also type-checks the content file)");
run("npm", ["run", "build"]);

const hasGit = existsSync(".git");

if (!hasGit) {
  console.log("\n! no git repository — skipping commit.");
  console.log("  run: git init && git add -A && git commit -m \"initial\"");
} else {
  try {
    run("git", ["add", "-A", "content", "public/uploads"]);
    const staged = execFileSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf8" }).trim();
    if (!staged) {
      console.log("\n› nothing to commit — content is unchanged.");
    } else {
      console.log("\n› changed:\n" + staged.split("\n").map((f) => "  " + f).join("\n"));
      run("git", ["commit", "-m", `content: update ${new Date().toISOString().slice(0, 16).replace("T", " ")}`]);
    }
  } catch (err) {
    console.error("\n! commit failed:", err.message);
    process.exitCode = 1;
  }
}

console.log("\n› next: deploy the built container to Cloud Run");
