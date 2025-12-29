#!/usr/bin/env node
/**
 * Build script for theme-toggle.js
 * Compiles src/components/theme-toggle.ts to public/theme-toggle.js
 */

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function buildThemeToggle() {
  try {
    await build({
      entryPoints: [join(rootDir, 'src/components/theme-toggle.ts')],
      bundle: true,
      outfile: join(rootDir, 'public/theme-toggle.js'),
      format: 'iife',
      target: 'es2020',
      platform: 'browser',
      minify: false,
      sourcemap: false,
    });
    console.log('✓ Built public/theme-toggle.js');
  } catch (error) {
    console.error('Failed to build theme-toggle.js:', error);
    process.exit(1);
  }
}

buildThemeToggle();
