#!/usr/bin/env node
// Runs the corresponding feature tests after a Write or Edit inside src/features/<featureName>/

import { execSync } from 'child_process';
import { createInterface } from 'readline';

let raw = '';

const rl = createInterface({ input: process.stdin });
rl.on('line', (line) => (raw += line));
rl.on('close', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath = payload?.tool_input?.file_path ?? '';

  // Match src/features/<featureName>/ in both forward and backward slash paths
  const match = filePath.match(/[/\\]features[/\\]([^/\\]+)[/\\]/);
  if (!match) process.exit(0);

  const feature = match[1];
  const testPath = `src/features/${feature}`;

  console.log(`\n▶ Running tests for feature: ${feature}`);
  try {
    execSync(`npm test -- "${testPath}"`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch {
    // Test failures are visible via stdio — exit 0 so Claude isn't blocked
    process.exit(0);
  }
});