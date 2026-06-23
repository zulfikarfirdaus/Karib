#!/usr/bin/env node
/**
 * One-shot setup script:
 *   1. Renames the Sanity project to "Karib"
 *   2. Configures Cloudflare Pages (build command, output dir, env vars, GitHub source)
 *   3. Triggers an immediate deployment
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=xxx SANITY_API_TOKEN=xxx npm run pages:setup
 *
 * NEXT_PUBLIC_* vars are read from .env.local automatically.
 */

import { readFileSync, existsSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Project constants
// ---------------------------------------------------------------------------

const CF_ACCOUNT_ID  = 'c057790ce7e574569a70da0c021e9037';
const CF_PROJECT     = 'karib';
const GITHUB_OWNER   = 'zulfikarfirdaus';
const GITHUB_REPO    = 'Karib';
const SITE_URL       = 'https://karib.org';
const SANITY_API_VER = '2024-01-01';

// ---------------------------------------------------------------------------
// Env loading
// ---------------------------------------------------------------------------

function loadDotenv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return out;
}

const dotenv = loadDotenv('.env.local');
const env = (key, fallback) => process.env[key] ?? dotenv[key] ?? fallback;

function need(key) {
  const v = env(key);
  if (!v) {
    console.error(`\n  Missing: ${key}`);
    console.error('  Set it via environment variable or add it to .env.local\n');
    process.exit(1);
  }
  return v;
}

const CF_TOKEN          = need('CLOUDFLARE_API_TOKEN');
const SANITY_PROJECT_ID = need('NEXT_PUBLIC_SANITY_PROJECT_ID');
const SANITY_DATASET    = env('NEXT_PUBLIC_SANITY_DATASET', 'production');
const SANITY_TOKEN      = need('SANITY_API_TOKEN');

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

async function cfFetch(path, method = 'GET', body) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}${path}`,
    {
      method,
      headers: { Authorization: `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }
  );
  return res.json();
}

async function sanityFetch(path, method = 'GET', body) {
  const res = await fetch(
    `https://api.sanity.io/v${SANITY_API_VER}${path}`,
    {
      method,
      headers: { Authorization: `Bearer ${SANITY_TOKEN}`, 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }
  );
  return res.json();
}

// ---------------------------------------------------------------------------
// Step 1 — Rename Sanity project
// ---------------------------------------------------------------------------

async function renameSanityProject() {
  process.stdout.write('  [1/3] Renaming Sanity project to "Karib"… ');

  const res = await sanityFetch(`/projects/${SANITY_PROJECT_ID}`, 'PATCH', {
    displayName: 'Karib',
  });

  if (res.displayName === 'Karib' || res.id) {
    console.log(`done  (id: ${SANITY_PROJECT_ID})`);
    return true;
  }

  // Insufficient permissions — editor tokens can't rename projects
  // Need the personal/management token (robot token with org permissions)
  const msg = res.message ?? res.error ?? JSON.stringify(res);
  console.log(`skipped`);
  console.warn(`         Rename requires a token with admin/manage permissions.`);
  console.warn(`         To rename manually: sanity.io/manage → project → Settings → rename to "Karib".`);
  console.warn(`         Error: ${msg}`);
  return false;
}

// ---------------------------------------------------------------------------
// Step 2 — Configure Cloudflare Pages
// ---------------------------------------------------------------------------

const envVars = {
  NEXT_TELEMETRY_DISABLED:       { value: '1',               type: 'plain_text'  },
  NEXT_PUBLIC_SANITY_PROJECT_ID: { value: SANITY_PROJECT_ID, type: 'plain_text'  },
  NEXT_PUBLIC_SANITY_DATASET:    { value: SANITY_DATASET,    type: 'plain_text'  },
  NEXT_PUBLIC_SITE_URL:          { value: SITE_URL,          type: 'plain_text'  },
  NODE_VERSION:                  { value: '22',              type: 'plain_text'  },
  SANITY_API_TOKEN:              { value: SANITY_TOKEN,      type: 'secret_text' },
};

async function configureCloudflare() {
  process.stdout.write('  [2/3] Configuring Cloudflare Pages… ');

  // Try full PATCH (build config + GitHub source + env vars)
  let result = await cfFetch(`/pages/projects/${CF_PROJECT}`, 'PATCH', {
    source: {
      type: 'github',
      config: {
        owner: GITHUB_OWNER,
        repo_name: GITHUB_REPO,
        production_branch: 'main',
        pr_comments_enabled: false,
        deployments_enabled: true,
      },
    },
    build_config: {
      build_command: 'npx @cloudflare/next-on-pages',
      destination_dir: '.vercel/output/static',
      build_caching: true,
      root_dir: '',
    },
    deployment_configs: {
      production: { env_vars: envVars },
      preview:    { env_vars: envVars },
    },
  });

  // If GitHub source was rejected, retry without it
  if (!result.success) {
    const isSourceErr = result.errors?.some(e =>
      /source|github|repository|installation/i.test(e.message ?? '')
    );

    if (isSourceErr) {
      result = await cfFetch(`/pages/projects/${CF_PROJECT}`, 'PATCH', {
        build_config: {
          build_command: 'npx @cloudflare/next-on-pages',
          destination_dir: '.vercel/output/static',
          build_caching: true,
          root_dir: '',
        },
        deployment_configs: {
          production: { env_vars: envVars },
          preview:    { env_vars: envVars },
        },
      });

      if (result.success) {
        console.log('done  (env vars + build config set)');
        console.warn('');
        console.warn('         GitHub repo not yet connected (GitHub App authorization needed).');
        console.warn('         Visit this URL once to authorize, then re-run this script:');
        console.warn(`         https://dash.cloudflare.com/${CF_ACCOUNT_ID}/pages/view/${CF_PROJECT}/settings/builds-deployments`);
        console.warn('');
        return true;
      }
    }

    console.log('failed');
    for (const e of result.errors ?? []) console.error(`         ${e.code}: ${e.message}`);
    return false;
  }

  const bc = result.result?.build_config ?? {};
  console.log('done');
  console.log(`         Build : ${bc.build_command}`);
  console.log(`         Output: ${bc.destination_dir}`);
  console.log(`         Vars  : NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,`);
  console.log(`                 NEXT_PUBLIC_SITE_URL, SANITY_API_TOKEN (secret), NODE_VERSION`);
  return true;
}

// ---------------------------------------------------------------------------
// Step 3 — Trigger deployment
// ---------------------------------------------------------------------------

async function triggerDeployment() {
  process.stdout.write('  [3/3] Triggering deployment… ');

  const res = await cfFetch(`/pages/projects/${CF_PROJECT}/deployments`, 'POST', {});

  if (res.success) {
    const id = res.result?.id ?? '?';
    console.log(`done  (id: ${id})`);
    console.log(`         https://dash.cloudflare.com/${CF_ACCOUNT_ID}/pages/view/${CF_PROJECT}`);
    return true;
  }

  const msg = res.errors?.[0]?.message ?? JSON.stringify(res.errors);
  console.log('skipped');
  console.warn(`         ${msg}`);
  console.warn('         Push a commit to main or click "Create deployment" in the dashboard.');
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n  Karib — Cloudflare Pages setup\n');

  await renameSanityProject();
  const ok = await configureCloudflare();
  if (!ok) process.exit(1);
  await triggerDeployment();

  console.log('\n  All done. Future pushes to main will deploy automatically.\n');
}

main().catch(e => { console.error(e); process.exit(1); });
