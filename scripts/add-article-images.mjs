import { createClient } from "@sanity/client";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises";
import { get as httpsGet } from "https";
import { tmpdir } from "os";
import { join } from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Nature-only Unsplash images, no humans or animals
const artikelImages = [
  {
    id: "artikel-featured",
    title: "Mengenal Rukun Iman",
    url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1200&auto=format&fit=crop",
    alt: "Matahari terbit di atas awan",
    filename: "sunrise-clouds.jpg",
  },
  {
    id: "artikel-tauhid-dasar",
    title: "Memahami Tauhid",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    alt: "Pegunungan megah berlapis",
    filename: "mountain-layers.jpg",
  },
  {
    id: "artikel-sholat-khusyuk",
    title: "Kekhusyukan dalam Shalat",
    url: "https://images.unsplash.com/photo-1439853949212-36089f7b2b8a?q=80&w=1200&auto=format&fit=crop",
    alt: "Danau tenang di pagi hari",
    filename: "calm-lake.jpg",
  },
  {
    id: "artikel-adab-bertetangga",
    title: "Adab Bertetangga",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    alt: "Hutan hijau lebat",
    filename: "forest-green.jpg",
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
    httpsGet(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
      file.on("error", reject);
    }).on("error", reject);
  });
}

async function run() {
  console.log("Adding thumbnail images to articles…\n");

  for (const item of artikelImages) {
    const tmpPath = join(tmpdir(), item.filename);

    process.stdout.write(`↓ Downloading image for "${item.title}"… `);
    await downloadFile(item.url, tmpPath);
    console.log("done");

    process.stdout.write(`↑ Uploading to Sanity… `);
    const { createReadStream } = await import("fs");
    const asset = await client.assets.upload("image", createReadStream(tmpPath), {
      filename: item.filename,
      contentType: "image/jpeg",
    });
    console.log(`done (${asset._id})`);

    await client
      .patch(item.id)
      .set({
        gambarUtama: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: item.alt,
        },
      })
      .commit();
    console.log(`✓ Patched artikel: ${item.id}\n`);

    await unlink(tmpPath);
  }

  console.log("✅ All article images uploaded and assigned.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
