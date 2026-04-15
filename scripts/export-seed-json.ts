/**
 * Export seed data as JSON for backend dev consumers.
 *
 * Usage:
 *   npx tsx scripts/export-seed-json.ts
 *
 * Output:
 *   ./seed-data/stations.json
 *   ./seed-data/tasks.json
 *   ./seed-data/zones.json
 *   ./seed-data/manifest.json   (counts + git sha + generated timestamp)
 */
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { seedStations } from '../src/data/seedStations';
import { seedTasks } from '../src/data/seedTasks';
import { seedZones } from '../src/data/seedZones';

const OUT_DIR = join(process.cwd(), 'seed-data');
mkdirSync(OUT_DIR, { recursive: true });

const sha = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
})();

const branch = (() => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
})();

const write = (name: string, data: unknown) => {
  const path = join(OUT_DIR, name);
  writeFileSync(path, JSON.stringify(data, null, 2));
  return path;
};

const stationsPath = write('stations.json', seedStations);
const tasksPath = write('tasks.json', seedTasks);
const zonesPath = write('zones.json', seedZones);

const manifest = {
  generatedAt: new Date().toISOString(),
  gitSha: sha,
  gitBranch: branch,
  counts: {
    stations: seedStations.length,
    tasks: seedTasks.length,
    zones: seedZones.length,
  },
};
const manifestPath = write('manifest.json', manifest);

console.log('Wrote:');
console.log('  ' + stationsPath, `(${seedStations.length} rows)`);
console.log('  ' + tasksPath, `(${seedTasks.length} rows)`);
console.log('  ' + zonesPath, `(${seedZones.length} rows)`);
console.log('  ' + manifestPath);
console.log('\nManifest:', JSON.stringify(manifest, null, 2));
