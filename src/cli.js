/**
 * asset-crunch: CLI Interface
 */

import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { optimizeSvg } from './svg-optimizer.js';
import { auditMediaBudgets } from './budget-guard.js';

export async function runCli(argv = process.argv.slice(2)) {
  const options = {
    help: { type: 'boolean', short: 'h', default: false },
    version: { type: 'boolean', short: 'v', default: false },
    'optimize-svg': { type: 'string' },
    output: { type: 'string', short: 'o' },
    'max-kb': { type: 'string', default: '300' },
    strict: { type: 'boolean', short: 's', default: false },
    json: { type: 'boolean', default: false }
  };

  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: true });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.help) {
    printHelp();
    return 0;
  }

  if (values.version) {
    console.log('asset-crunch v1.0.0');
    return 0;
  }

  // Case 1: Optimize SVG file
  if (values['optimize-svg']) {
    const svgPath = resolve(values['optimize-svg']);
    const raw = readFileSync(svgPath, 'utf8');
    const result = optimizeSvg(raw);

    if (values.output) {
      writeFileSync(resolve(values.output), result.content, 'utf8');
      console.log(`✓ Saved optimized SVG to ${values.output} (${result.savingsPct}% reduction: ${result.originalSize}B -> ${result.optimizedSize}B)`);
    } else {
      process.stdout.write(result.content);
    }
    return 0;
  }

  // Case 2: Audit workspace media budget
  const rootDir = resolve(positionals[0] || '.');
  const maxBytes = parseInt(values['max-kb'], 10) * 1024;
  const report = await auditMediaBudgets(rootDir, { maxBytes });

  if (values.json) {
    console.log(JSON.stringify(report, null, 2));
    if (values.strict && report.hasViolations) process.exit(1);
    return 0;
  }

  console.log('\n🎨 asset-crunch - Media Asset Size Budget Guard');
  console.log('============================================================');
  console.log(`Audited Directory:  ${rootDir}`);
  console.log(`Scanned Media:      ${report.totalMediaFiles} files (${report.totalSizeMb} MB)`);
  console.log(`Budget Limit:       ${values['max-kb']} KB per asset`);
  console.log(`Budget Violations:  ${report.hasViolations ? `\x1b[31m${report.oversized.length}\x1b[0m` : '\x1b[32m0 (All within budget)\x1b[0m'}\n`);

  if (!report.hasViolations) {
    console.log('✅ All images, SVGs, and media files are within size budget!');
    console.log('============================================================\n');
    return 0;
  }

  for (const item of report.oversized) {
    console.log(`❌ ${item.file}: \x1b[1m${item.sizeKb} KB\x1b[0m (budget: ${item.limitKb} KB)`);
    console.log(`   👉 Recommendation: ${item.recommendation}\n`);
  }

  console.log('============================================================\n');

  if (values.strict && report.hasViolations) {
    process.exit(1);
  }

  return 0;
}

function printHelp() {
  console.log(`
asset-crunch - SVG Optimizer & Media Asset Size Budget Guard

USAGE:
  $ asset-crunch [directory] [flags]
  $ asset-crunch --optimize-svg <file.svg> [-o <out.svg>]

FLAGS:
      --optimize-svg <file>   Optimize an SVG file (strips metadata, decimals)
  -o, --output <file>         Write optimized SVG to file instead of stdout
      --max-kb <number>       Maximum allowed file size in KB (default: 300)
  -s, --strict                Exit with code 1 on budget violations (ideal for CI)
      --json                  Output structured JSON report
  -v, --version               Show version
  -h, --help                  Show help

EXAMPLES:
  # Check image size budgets in current repository:
  $ asset-crunch

  # Fail CI if any image exceeds 200 KB:
  $ asset-crunch --max-kb 200 --strict

  # Optimize bloated SVG:
  $ asset-crunch --optimize-svg icon.svg -o icon.min.svg
`);
}

