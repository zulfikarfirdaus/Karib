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

const artikelImages = [
  {
    id: "artikel-sholat-khusyuk",
    title: "Kekhusyukan dalam Shalat",
    url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1200&auto=format&fit=crop",
    alt: "Lembah hijau dengan kabut pagi",
    filename: "valley-mist.jpg",
  },
  {
    id: "artikel-adab-bertetangga",
    title: "Adab Bertetangga",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    alt: "Jalan setapak di hutan hijau",
    filename: "forest-path.jpg",
  },
  {
    id: "artikel-ikhlas-amalan",
    title: "Ikhlas dalam Beramal",
    url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop",
    alt: "Gundukan pasir gurun",
    filename: "sand-dunes.jpg",
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    function fetch(u) {
      httpsGet(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
        file.on("error", reject);
      }).on("error", reject);
    }
    fetch(url);
  });
}

async function run() {
  for (const item of artikelImages) {
    const tmpPath = join(tmpdir(), item.filename);
    process.stdout.write(`↓ ${item.title}… `);
    await downloadFile(item.url, tmpPath);
    process.stdout.write("↑ uploading… ");
    const asset = await client.assets.upload("image", createReadStream(tmpPath), {
      filename: item.filename,
      contentType: "image/jpeg",
    });
    await client.patch(item.id).set({
      gambarUtama: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: item.alt,
      },
    }).commit();
    await unlink(tmpPath);
    console.log(`✓ done`);
  }
  console.log("\n✅ All remaining images uploaded.");
}

run().catch((err) => { console.error(err); process.exit(1); });
