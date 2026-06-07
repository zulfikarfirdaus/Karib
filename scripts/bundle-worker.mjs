/**
 * Copies the @opennextjs/cloudflare worker and all its runtime dependencies
 * into .open-next/assets/ so CF Pages Advanced Mode (_worker.js) can find them.
 *
 * CF Pages bundles _worker.js with esbuild relative to the output directory,
 * so every import in worker.js must exist under .open-next/assets/.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, ".open-next");
const dest = path.join(src, "assets");

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name.startsWith("._")) continue; // skip macOS resource forks
    const srcPath = path.join(from, entry.name);
    const dstPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      copyFile(srcPath, dstPath);
    }
  }
}

// 1. _worker.js
copyFile(path.join(src, "worker.js"), path.join(dest, "_worker.js"));
console.log("✓ _worker.js");

// 2. cloudflare/ helpers (images.js, init.js, skew-protection.js, next-env.mjs)
copyDir(path.join(src, "cloudflare"), path.join(dest, "cloudflare"));
console.log("✓ cloudflare/");

// 3. middleware/handler.mjs
copyFile(
  path.join(src, "middleware", "handler.mjs"),
  path.join(dest, "middleware", "handler.mjs")
);
console.log("✓ middleware/handler.mjs");

// 4. .build/durable-objects/ (queue.js, sharded-tag-cache.js, bucket-cache-purge.js)
copyDir(
  path.join(src, ".build", "durable-objects"),
  path.join(dest, ".build", "durable-objects")
);
console.log("✓ .build/durable-objects/");

// 5. server-functions/default/handler.mjs (bundled Next.js server)
copyFile(
  path.join(src, "server-functions", "default", "handler.mjs"),
  path.join(dest, "server-functions", "default", "handler.mjs")
);
console.log("✓ server-functions/default/handler.mjs");

console.log("\nWorker bundle ready at .open-next/assets/_worker.js");
