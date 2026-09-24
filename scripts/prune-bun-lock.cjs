/** Prune historical React/Express-only orphan packages from Bun v2 JSON lockfile.
 * Uses root manifest dependency closure, including optional platform dependencies.
 * This script does not resolve or change package versions.
 * Always verify the frozen lockfile using Bun in an online development environment.
 */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const lockPath = path.join(root, 'bun.lock');
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const importer = lock.workspaces[''];
for (const group of ['dependencies', 'devDependencies']) {
  if (JSON.stringify(importer[group] ?? {}) !== JSON.stringify(manifest[group] ?? {})) {
    throw new Error(`bun.lock workspace ${group} does not match package.json: refresh the lockfile with Bun before pruning.`);
  }
}
const required = [...Object.keys(importer.dependencies ?? {}), ...Object.keys(importer.devDependencies ?? {})];
const visited = new Set();
const pending = [...required];
const originallyMissing = new Set();
while (pending.length) {
  const name = pending.pop();
  if (visited.has(name)) continue;
  const pkg = lock.packages[name];
  if (!pkg) throw new Error(`Required package missing in bun.lock: ${name}`);
  visited.add(name);
  const info = pkg[2] ?? {};
  for (const dep of [...Object.keys(info.dependencies ?? {}), ...Object.keys(info.optionalDependencies ?? {})]) {
    if (!lock.packages[dep]) {
      // Bun may intentionally omit platform-only optional packages and their children.
      // Never synthesize missing package metadata or fail on omissions from the original lock.
      originallyMissing.add(`${name} -> ${dep}`);
      continue;
    }
    pending.push(dep);
  }
}
const oldCount = Object.keys(lock.packages).length;
lock.packages = Object.fromEntries(Object.entries(lock.packages).filter(([name]) => visited.has(name)));
for (const removed of ['react', 'react-dom', 'lucide-react', 'motion', '@google/genai', 'express', '@types/react']) {
  if (lock.packages[removed]) throw new Error(`Stale package unexpectedly reachable: ${removed}`);
}
fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
console.log(`Pruned historical lockfile: ${oldCount} -> ${visited.size} reachable packages; ${oldCount - visited.size} orphans removed.`);
if (originallyMissing.size) console.log(`Preserved ${originallyMissing.size} originally absent transitive references (usually platform-optional).`);
