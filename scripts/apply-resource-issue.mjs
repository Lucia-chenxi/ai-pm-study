import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const owner = process.env.GITHUB_REPOSITORY_OWNER;
if (event.issue.user.login.toLowerCase() !== owner.toLowerCase()) process.exit(0);
const match = event.issue.body?.match(/<!-- AIPM_SOURCE\n([\s\S]*?)\nAIPM_SOURCE -->/);
if (!match) throw new Error('Missing resource request');
const request = JSON.parse(match[1]);
const path = 'data/resources.json';
const sources = JSON.parse(fs.readFileSync(path, 'utf8'));
if (!Array.isArray(sources)) throw new Error('Invalid resource file');
const modulePath = 'data/modules.json';
let moduleConfig = JSON.parse(fs.readFileSync(modulePath, 'utf8'));

function activeModuleIds(config) {
  const hidden = new Set(config.hidden || []);
  return new Set([1, 2, 3, 4, 5, 6, 7, 8, ...(config.custom || []).map(x => x.n)].filter(n => !hidden.has(n)));
}

function cleanModuleConfig(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid modules');
  const names = {};
  for (const [key, value] of Object.entries(raw.names || {})) {
    const n = Number(key), title = String(value || '').trim().slice(0, 32);
    if (Number.isInteger(n) && n >= 1 && n <= 8 && title) names[n] = title;
  }
  const seen = new Set();
  const custom = (Array.isArray(raw.custom) ? raw.custom : []).map(item => {
    const n = Number(item.n), stage = Number(item.stage);
    const title = String(item.title || '').trim().slice(0, 32);
    if (!Number.isInteger(n) || n < 9 || n > 9999 || seen.has(n) ||
        !Number.isInteger(stage) || stage < 1 || stage > 6 || !title) throw new Error('Invalid custom module');
    seen.add(n);
    return { n, title, stage };
  });
  const valid = new Set([1, 2, 3, 4, 5, 6, 7, 8, ...seen]);
  const hidden = [...new Set((Array.isArray(raw.hidden) ? raw.hidden : []).map(Number))].filter(n => valid.has(n));
  const nextId = Math.max(9, Number(raw.nextId) || 9, ...custom.map(x => x.n + 1));
  const updatedAt = new Date(raw.updatedAt).toISOString();
  return { names, hidden, custom, nextId, updatedAt };
}

function clean(item) {
  const url = new URL(item.url);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid URL');
  const title = String(item.title || '').trim().slice(0, 120);
  if (!title) throw new Error('Missing title');
  return {
    id: String(item.id || '').slice(0, 80), kind: 'link', title, url: url.href,
    typeKey: ['article', 'doc', 'method'].includes(item.typeKey) ? item.typeKey : 'article',
    moduleN: activeModuleIds(moduleConfig).has(Number(item.moduleN)) ? Number(item.moduleN) : 0,
    tags: Array.isArray(item.tags) ? item.tags.filter(x => typeof x === 'string').map(x => x.trim().slice(0, 24)).filter(Boolean).slice(0, 12) : [],
    addedAt: String(item.addedAt || new Date().toISOString()), schemaVersion: 2
  };
}

if (request.action === 'module_config') {
  const next = cleanModuleConfig(request.config);
  if (moduleConfig.updatedAt && next.updatedAt < moduleConfig.updatedAt) throw new Error('Stale module change');
  moduleConfig = next;
  const active = activeModuleIds(next);
  for (const source of sources) if (source.moduleN && !active.has(Number(source.moduleN))) source.moduleN = 0;
  fs.writeFileSync(modulePath, JSON.stringify(moduleConfig, null, 2) + '\n');
  fs.writeFileSync(path, JSON.stringify(sources, null, 2) + '\n');
  execFileSync('git', ['add', modulePath, path]);
} else if (request.action === 'upsert') {
  const item = clean(request.item);
  if (!item.id) throw new Error('Missing ID');
  const duplicate = sources.findIndex(x => x.id === item.id || x.url === item.url);
  if (duplicate >= 0) sources[duplicate] = { ...item, id: sources[duplicate].id };
  else sources.unshift(item);
} else if (request.action === 'delete') {
  const index = sources.findIndex(x => x.id === String(request.id));
  if (index >= 0) sources.splice(index, 1);
} else throw new Error('Invalid action');

if (request.action !== 'module_config') {
  fs.writeFileSync(path, JSON.stringify(sources, null, 2) + '\n');
  execFileSync('git', ['add', path]);
}
try { execFileSync('git', ['commit', '-m', `Update site data from issue #${event.issue.number}`]); }
catch (error) { if (error.status !== 1) throw error; }
