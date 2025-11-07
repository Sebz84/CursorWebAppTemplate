#!/usr/bin/env node
const { execSync } = require('node:child_process');

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function getChangedFiles() {
  try {
    const staged = sh('git diff --name-only --cached');
    const files = staged.split('\n').filter(Boolean);
    if (files.length > 0) return files;
  } catch {}

  try {
    const base = sh('git merge-base origin/main HEAD').trim();
    const diff = sh(`git diff --name-only ${base}...HEAD`);
    return diff.split('\n').filter(Boolean);
  } catch {}

  try {
    const diff = sh('git diff --name-only');
    return diff.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

const CRITICAL = [
  /^prisma\/schema\.prisma$/,
  /^packages\/api\/src\/router\//,
  /^apps\/[^/]+\/app\//,
  /^packages\/config\//,
  /^packages\/ui\//,
  /^packages\/auth\//,
  /^packages\/billing\//
];

const DOCS = [
  /^ARCHITECTURE\.md$/,
  /^DECISIONS\.md$/,
  /^docs\//
];

const changed = getChangedFiles();
const touchesCritical = changed.some((file) => CRITICAL.some((regex) => regex.test(file)));
const touchesDocs = changed.some((file) => DOCS.some((regex) => regex.test(file)));

if (touchesCritical && !touchesDocs) {
  console.error('[Docs Gate] Critical changes detected without docs updates.');
  console.error('  Critical paths include:');
  CRITICAL.forEach((regex) => console.error('   -', regex));
  console.error('  Required docs updates in one of: ARCHITECTURE.md, DECISIONS.md, docs/**');
  process.exit(1);
}

console.log('[Docs Gate] OK');


