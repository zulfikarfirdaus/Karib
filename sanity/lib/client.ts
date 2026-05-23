import { createClient } from "next-sanity";
import { cacheLife } from "next/cache";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeFetch<T = any>(
  query: string,
  params?: Record<string, unknown>
): Promise<T | null> {
  "use cache";
  cacheLife("minutes");
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
}
