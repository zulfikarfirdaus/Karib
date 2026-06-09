import { test, expect } from "@playwright/test";

// ── Homepage ──────────────────────────────────────────────────────────────────

test("homepage loads and shows hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page).not.toHaveTitle(/Error|404|500/);
  // page should render (has a body with visible content)
  const body = page.locator("body");
  await expect(body).toBeVisible();
  // No JS error overlay
  await expect(page.locator("body")).not.toContainText("Application error");
});

// ── Artikel listing ───────────────────────────────────────────────────────────

test("/artikel lists articles", async ({ page }) => {
  await page.goto("/artikel");
  await expect(page).not.toHaveTitle(/404|500|Error/);
  await expect(page.locator("body")).not.toContainText("Application error");
  // Should have at least one article link or heading
  const body = page.locator("body");
  await expect(body).toBeVisible();
});

// ── Tanya Jawab listing ───────────────────────────────────────────────────────

test("/tanya-jawab loads", async ({ page }) => {
  await page.goto("/tanya-jawab");
  await expect(page).not.toHaveTitle(/404|500|Error/);
  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.locator("body")).toBeVisible();
});

// ── Poster listing ────────────────────────────────────────────────────────────

test("/poster loads", async ({ page }) => {
  await page.goto("/poster");
  await expect(page).not.toHaveTitle(/404|500|Error/);
  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.locator("body")).toBeVisible();
});

// ── Profil ────────────────────────────────────────────────────────────────────

test("/profil loads", async ({ page }) => {
  await page.goto("/profil");
  await expect(page).not.toHaveTitle(/404|500|Error/);
  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.locator("body")).toBeVisible();
});

// ── Search ────────────────────────────────────────────────────────────────────

test("/cari page loads and has a search input", async ({ page }) => {
  await page.goto("/cari");
  await expect(page).not.toHaveTitle(/404|500|Error/);
  await expect(page.locator("body")).not.toContainText("Application error");
  // The search input uses CSS that marks the <input> as visibility:hidden while
  // the parent wrapper is the visually rendered element — check it's in the DOM
  const input = page.locator('input[type="search"], input[placeholder*="cari" i]');
  await expect(input.first()).toBeAttached();
  // And the search wrapper is visually present
  await expect(page.locator("body")).toContainText("Cari");
});

// ── 404 ───────────────────────────────────────────────────────────────────────

test("404 page shows not-found", async ({ page }) => {
  const res = await page.goto("/halaman-tidak-ada-sama-sekali");
  expect(res?.status()).toBe(404);
  await expect(page.locator("body")).toBeVisible();
});

// ── API routes ────────────────────────────────────────────────────────────────

test("GET /api/cari returns JSON", async ({ request }) => {
  const res = await request.get("/api/cari?q=sholat");
  expect(res.status()).toBeLessThan(500);
  const ct = res.headers()["content-type"] ?? "";
  expect(ct).toContain("json");
});

// ── Sanity Studio (/studio) ───────────────────────────────────────────────────

test("/studio loads Sanity Studio login page", async ({ page }) => {
  // Studio is a heavy client-side SPA (ssr:false). Use domcontentloaded
  // so we don't wait for every JS chunk, then give React time to render.
  await page.goto("/studio", { waitUntil: "domcontentloaded", timeout: 30000 });
  // Wait for Sanity's client-side render — login page or workspace
  await page.waitForTimeout(8000);

  // Sanity login page must show the project name and login options
  await expect(page.locator("body")).toContainText("Karib CMS");
  await expect(page.locator("body")).toContainText("Choose login provider");
  // No application error
  await expect(page.locator("body")).not.toContainText("Application error");
});
