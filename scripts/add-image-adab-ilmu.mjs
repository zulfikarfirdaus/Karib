import { createClient } from "@sanity/client";
import { createWriteStream, createReadStream } from "fs";
import { unlink } from "fs/promises";
import { get as httpsGet } from "https";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    function fetch(u) {
      httpsGet(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
        file.on("error", reject);
      }).on("error", reject);
    }
    fetch(url);
  });
}

const tmpPath = join(tmpdir(), "old-books-library.jpg");

process.stdout.write("↓ Downloading image… ");
await download(
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
  tmpPath
);
console.log("done");

process.stdout.write("↑ Uploading to Sanity… ");
const asset = await client.assets.upload("image", createReadStream(tmpPath), {
  filename: "old-books-library.jpg",
  contentType: "image/jpeg",
});
console.log(`done (${asset._id})`);

await client.patch("artikel-adab-ilmu").set({
  gambarUtama: {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt: "Buku-buku kitab kuno di perpustakaan",
  },
}).commit();

await unlink(tmpPath);
console.log("✓ Image assigned to artikel-adab-ilmu");
