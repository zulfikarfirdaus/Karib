/**
 * Copies the @opennextjs/cloudflare worker and all its runtime dependencies
 * into .open-next/assets/ so CF Pages Advanced Mode (_worker.js) can find them.
 *
 * Also creates a wrapper _worker.js that serves static assets via env.ASSETS
 * before passing requests to the OpenNext worker. This is required because
 * CF Pages Advanced Mode routes ALL requests through the Worker, unlike the
 * Workers+Assets model where static files are served before the Worker runs.
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

// 1. Copy worker.js as _open-next-worker.js (the actual OpenNext handler)
copyFile(path.join(src, "worker.js"), path.join(dest, "_open-next-worker.js"));
console.log("✓ _open-next-worker.js");

// 2. cloudflare/ helpers (images.js, init.js, skew-protection.js, next-env.mjs)
copyDir(path.join(src, "cloudflare"), path.join(dest, "cloudflare"));
console.log("✓ cloudflare/");

// 3. middleware/ (handler.mjs + open-next.config.mjs + any wasm assets)
copyDir(path.join(src, "middleware"), path.join(dest, "middleware"));
console.log("✓ middleware/");

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

// 6. Create the _worker.js wrapper that handles static assets via env.ASSETS.
//    In CF Pages Advanced Mode the Worker receives ALL requests. The OpenNext
//    worker was designed for Workers+Assets where Cloudflare routes static
//    requests to the asset store before the Worker runs. We replicate that here
//    by trying env.ASSETS.fetch() for every GET request first.
const wrapper = `
// CF Pages Advanced Mode wrapper — serves static assets via env.ASSETS,
// then falls through to the OpenNext worker for dynamic routes.
import worker, {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./_open-next-worker.js";

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge };

export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET" && env.ASSETS) {
      try {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;
      } catch {}
    }
    return worker.fetch(request, env, ctx);
  },
};
`.trimStart();

fs.writeFileSync(path.join(dest, "_worker.js"), wrapper);
console.log("✓ _worker.js (assets wrapper)");

console.log("\nWorker bundle ready at .open-next/assets/_worker.js");
