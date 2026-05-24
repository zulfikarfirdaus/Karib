import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Karib CMS",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Konten")
          .items([
            S.listItem()
              .title("Artikel")
              .child(S.documentTypeList("artikel").title("Semua Artikel")),
            S.listItem()
              .title("Nasihat Singkat")
              .child(S.documentTypeList("nasihat").title("Semua Nasihat")),
            S.listItem()
              .title("Kategori")
              .child(S.documentTypeList("kategori").title("Kategori")),
            S.divider(),
            S.listItem()
              .title("Profil Ustadz")
              .child(
                S.editor()
                  .id("profilUstadz")
                  .schemaType("profilUstadz")
                  .documentId("profilUstadz")
              ),
          ]),
    }),
    visionTool(),
  ],
});
