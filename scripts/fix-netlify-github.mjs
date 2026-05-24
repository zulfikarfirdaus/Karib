/**
 * Fixes Netlify "Host key verification failed" by reconnecting the GitHub repo
 * through Netlify's UI to regenerate a fresh deploy key.
 * Fully automated — no interactive prompts.
 */

import { webkit } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const NETLIFY_SITE = 'karib';
const GITHUB_REPO = 'zulfikarfirdaus/Karib';
const REPO_NAME = 'Karib';
const SETTINGS_URL = `https://app.netlify.com/projects/${NETLIFY_SITE}/configuration/deploys`;
const DEPLOYS_URL = `https://app.netlify.com/projects/${NETLIFY_SITE}/deploys`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function screenshot(page, name) {
  const p = join(tmpdir(), `netlify-${name}.png`);
  await page.screenshot({ path: p, fullPage: true });
  console.log(`  Screenshot: ${p}`);
}

async function run() {
  console.log('Launching Safari (WebKit)...');
  const browser = await webkit.launch({ headless: false });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. Load Netlify deploy settings ──────────────────────────────────────
  console.log('\n[1/5] Opening Netlify deploy settings...');
  await page.goto(SETTINGS_URL, { waitUntil: 'load', timeout: 30000 });
  await sleep(2000);
  await screenshot(page, '1-settings');
  console.log('  URL:', page.url());

  // Dump all button texts for debugging
  const buttons = await page.locator('button, a[role="button"]').allTextContents();
  console.log('  Buttons found:', buttons.filter(t => t.trim()).map(t => t.trim()).join(' | '));

  // ── 2. Look for "Link repository" or "Connect to Git" ───────────────────
  console.log('\n[2/5] Finding repository link control...');

  // Netlify uses various text depending on state — try them all
  const linkSelectors = [
    'button:has-text("Link repository")',
    'a:has-text("Link repository")',
    'button:has-text("Connect to Git provider")',
    'button:has-text("Link your repository")',
    'button:has-text("Add build settings")',
    '[data-testid="link-repo-button"]',
  ];

  let linked = false;
  for (const sel of linkSelectors) {
    const el = page.locator(sel).first();
    if (await el.count() > 0) {
      console.log(`  Clicking: ${sel}`);
      await el.click();
      await sleep(2500);
      linked = true;
      break;
    }
  }

  // If the repo is already connected, try unlinking first
  if (!linked) {
    console.log('  "Link" button not found — checking if repo is already connected (need to unlink first)...');
    await screenshot(page, '2-before-unlink');

    const unlinkSelectors = [
      'button:has-text("Unlink")',
      'a:has-text("Unlink")',
      'button:has-text("Disconnect")',
      'button:has-text("Edit settings")',
      'button:has-text("Manage repository")',
    ];

    for (const sel of unlinkSelectors) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) {
        console.log(`  Unlinking via: ${sel}`);
        await el.click();
        await sleep(2000);
        // Confirm dialog
        for (const conf of ['button:has-text("Unlink")', 'button:has-text("Yes")', 'button:has-text("Remove")']) {
          const c = page.locator(conf).last();
          if (await c.count() > 0) { await c.click(); await sleep(2000); break; }
        }
        break;
      }
    }

    // Now try link again
    for (const sel of linkSelectors) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) {
        console.log(`  Now clicking: ${sel}`);
        await el.click();
        await sleep(2500);
        linked = true;
        break;
      }
    }
  }

  await screenshot(page, '3-after-link-click');

  // ── 3. Choose GitHub ─────────────────────────────────────────────────────
  console.log('\n[3/5] Selecting GitHub as provider...');
  const githubBtn = page.locator('button:has-text("GitHub"), a:has-text("GitHub"), [aria-label*="GitHub"]').first();
  if (await githubBtn.count() > 0) {
    await githubBtn.click();
    await sleep(3000);
  }

  // Handle GitHub OAuth popup
  const popup = await ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null);
  if (popup) {
    console.log('  OAuth popup appeared — handling...');
    await popup.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await screenshot(popup, '4-oauth-popup');
    const authBtn = popup.locator('button:has-text("Authorize"), input[value="Authorize"]').first();
    if (await authBtn.count() > 0) {
      await authBtn.click();
      await sleep(2000);
    }
    await popup.waitForEvent('close', { timeout: 20000 }).catch(() => {});
    await sleep(2000);
  }

  await screenshot(page, '5-repo-select');

  // ── 4. Select the repo ───────────────────────────────────────────────────
  console.log('\n[4/5] Selecting repository...');

  // Search box
  const searchBox = page.locator(
    'input[placeholder*="repo"], input[placeholder*="search" i], input[placeholder*="filter" i], input[aria-label*="repo" i]'
  ).first();
  if (await searchBox.count() > 0) {
    await searchBox.fill(REPO_NAME);
    await sleep(1500);
  }

  // Click the repo row
  const repoRow = page.locator(
    `[data-repo="${GITHUB_REPO}"], li:has-text("${REPO_NAME}"), tr:has-text("${REPO_NAME}"), button:has-text("${REPO_NAME}")`
  ).first();
  if (await repoRow.count() > 0) {
    await repoRow.click();
    await sleep(1500);
  } else {
    // Try clicking any element that contains the repo name
    await page.getByText(REPO_NAME, { exact: false }).first().click().catch(() => {});
    await sleep(1500);
  }

  await screenshot(page, '6-build-settings');

  // ── 5. Save / Deploy ─────────────────────────────────────────────────────
  console.log('\n[5/5] Saving and deploying...');
  // Build settings are already in netlify.toml — just submit
  const deployBtn = page.locator(
    'button:has-text("Save and deploy"), button:has-text("Deploy site"), button[type="submit"]'
  ).first();
  if (await deployBtn.count() > 0 && await deployBtn.isEnabled()) {
    await deployBtn.click();
    await sleep(5000);
    console.log('  Submitted!');
  } else {
    console.log('  No deploy button found — may need manual action.');
  }

  await screenshot(page, '7-final');

  // ── Trigger a deploy from deploys page as fallback ───────────────────────
  await sleep(3000);
  await page.goto(DEPLOYS_URL, { waitUntil: 'load', timeout: 30000 });
  await sleep(2000);
  await screenshot(page, '8-deploys');

  const triggerBtn = page.locator('button:has-text("Trigger deploy")').first();
  if (await triggerBtn.count() > 0) {
    await triggerBtn.click();
    await sleep(800);
    const clearCache = page.locator('button:has-text("Clear cache and deploy site")').first();
    if (await clearCache.count() > 0) { await clearCache.click(); }
    else {
      const justDeploy = page.locator('button:has-text("Deploy site")').first();
      if (await justDeploy.count() > 0) await justDeploy.click();
    }
    await sleep(2000);
    console.log('  Deploy triggered!');
  }

  await screenshot(page, '9-done');
  console.log('\nDone. Check https://app.netlify.com/projects/karib/deploys');
  console.log('Screenshots saved to /tmp/netlify-*.png for debugging.\n');
  console.log('Keeping browser open for 30s so you can see the result...');
  await sleep(30000);
  await browser.close();
}

run().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
