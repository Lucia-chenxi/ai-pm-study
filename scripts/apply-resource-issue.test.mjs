import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aipm-modules-'));
const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'apply-resource-issue.mjs');
const run = (command, args, env = {}) => execFileSync(command, args, { cwd: root, env: { ...process.env, ...env } });
try {
  fs.mkdirSync(path.join(root, 'data'));
  fs.writeFileSync(path.join(root, 'data/modules.json'), JSON.stringify({ names: {}, hidden: [], custom: [], nextId: 9, updatedAt: '' }));
  fs.writeFileSync(path.join(root, 'data/resources.json'), JSON.stringify([{ id: 'one', title: 'Keep me', url: 'https://example.com', moduleN: 1 }]));
  run('git', ['init', '-q']);
  run('git', ['config', 'user.name', 'Test']);
  run('git', ['config', 'user.email', 'test@example.com']);
  run('git', ['add', '.']);
  run('git', ['commit', '-qm', 'Fixture']);
  const config = { names: { 2: '新名称' }, hidden: [1], custom: [{ n: 9, title: '我的模块', stage: 6 }], nextId: 10, updatedAt: '2026-11-01T00:00:00.000Z' };
  const body = `<!-- AIPM_SOURCE\n${JSON.stringify({ action: 'module_config', summary: 'test', config })}\nAIPM_SOURCE -->`;
  const eventPath = path.join(root, 'event.json');
  fs.writeFileSync(eventPath, JSON.stringify({ issue: { number: 1, user: { login: 'Owner' }, body } }));
  run('node', [script], { GITHUB_EVENT_PATH: eventPath, GITHUB_REPOSITORY_OWNER: 'Owner' });
  const savedModules = JSON.parse(fs.readFileSync(path.join(root, 'data/modules.json')));
  const savedSources = JSON.parse(fs.readFileSync(path.join(root, 'data/resources.json')));
  assert.equal(savedModules.custom[0].title, '我的模块');
  assert.equal(savedModules.names[2], '新名称');
  assert.equal(savedSources[0].title, 'Keep me');
  assert.equal(savedSources[0].moduleN, 0);
  const item = { id: 'two', kind: 'link', title: 'Custom resource', url: 'https://example.org', typeKey: 'article', moduleN: 9, tags: [], addedAt: '2026-11-01T00:00:00.000Z' };
  fs.writeFileSync(eventPath, JSON.stringify({ issue: { number: 2, user: { login: 'Owner' }, body: `<!-- AIPM_SOURCE\n${JSON.stringify({ action: 'upsert', item })}\nAIPM_SOURCE -->` } }));
  run('node', [script], { GITHUB_EVENT_PATH: eventPath, GITHUB_REPOSITORY_OWNER: 'Owner' });
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'data/resources.json')))[0].moduleN, 9);
  console.log('module sync and resource preservation passed');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
