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

function clean(item) {
  const url = new URL(item.url);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid URL');
  const title = String(item.title || '').trim().slice(0, 120);
  if (!title) throw new Error('Missing title');
  return {
    id: String(item.id || '').slice(0, 80), kind: 'link', title, url: url.href,
    typeKey: ['article', 'doc', 'method'].includes(item.typeKey) ? item.typeKey : 'article',
    moduleN: Math.max(0, Math.min(8, Number(item.moduleN) || 0)),
    tags: Array.isArray(item.tags) ? item.tags.filter(x => typeof x === 'string').map(x => x.trim().slice(0, 24)).filter(Boolean).slice(0, 12) : [],
    addedAt: String(item.addedAt || new Date().toISOString()), schemaVersion: 2
  };
}

if (request.action === 'upsert') {
  const item = clean(request.item);
  if (!item.id) throw new Error('Missing ID');
  const duplicate = sources.findIndex(x => x.id === item.id || x.url === item.url);
  if (duplicate >= 0) sources[duplicate] = { ...item, id: sources[duplicate].id };
  else sources.unshift(item);
} else if (request.action === 'delete') {
  const index = sources.findIndex(x => x.id === String(request.id));
  if (index >= 0) sources.splice(index, 1);
} else throw new Error('Invalid action');

fs.writeFileSync(path, JSON.stringify(sources, null, 2) + '\n');
execFileSync('git', ['add', path]);
try { execFileSync('git', ['commit', '-m', `Update public resources from issue #${event.issue.number}`]); }
catch (error) { if (error.status !== 1) throw error; }
