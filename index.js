#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { resolve, dirname } from 'path';
import { parseArgs } from 'util';

// ─── CLI Arguments ────────────────────────────────────────────────────────────
const { values: args, positionals } = parseArgs({
  options: {
    help:       { type: 'boolean', short: 'h' },
    version:    { type: 'boolean', short: 'v' },
    coverage:   { type: 'string' },
    output:     { type: 'string', default: 'coverage-badge.svg' },
    readme:     { type: 'boolean', default: false },
    format:     { type: 'string', default: 'svg' },
    label:      { type: 'string', default: 'coverage' },
    thresholds: { type: 'string', default: '90,75,60' },
    metric:     { type: 'string', default: 'lines' },
    style:      { type: 'string', default: 'flat' },
    commit:     { type: 'boolean', default: false },
    threshold:  { type: 'string' },
  },
  allowPositionals: true,
});

const VERSION = '1.0.0';

if (args.help) {
  console.log(`
code-coverage-badge v${VERSION}

USAGE
  npx code-coverage-badge [options]
  ccb [options]

OPTIONS
  --coverage <n>            Raw coverage percentage (skips file detection)
  --output <file>           SVG output path (default: coverage-badge.svg)
  --readme                  Update README.md badge automatically
  --format svg|json|text    Output format (default: svg)
  --label <text>            Badge label (default: "coverage")
  --thresholds <h,m,l>      Green/yellow/red thresholds (default: 90,75,60)
  --metric lines|branches|functions|statements
                            Which metric to badge (default: lines)
  --style flat|flat-square|for-the-badge
                            Badge style (default: flat)
  --threshold <n>           Exit code 1 if coverage below N% (CI mode)
  --commit                  Git commit badge + README after update
  -h, --help                Show this help
  -v, --version             Show version

EXAMPLES
  npx code-coverage-badge
  npx code-coverage-badge --readme
  npx code-coverage-badge --coverage 87.5
  npx code-coverage-badge --metric branches --threshold 80
  npx code-coverage-badge --style for-the-badge --readme --commit
`);
  process.exit(0);
}

if (args.version) {
  console.log(VERSION);
  process.exit(0);
}

// ─── Thresholds ───────────────────────────────────────────────────────────────
const [highT, midT, lowT] = args.thresholds.split(',').map(Number);
const HIGH = isNaN(highT) ? 90 : highT;
const MID  = isNaN(midT)  ? 75 : midT;
const LOW  = isNaN(lowT)  ? 60 : lowT;

// ─── Color Logic ──────────────────────────────────────────────────────────────
function getColor(pct) {
  if (pct >= HIGH) return '#4c1';
  if (pct >= MID)  return '#dfb317';
  if (pct >= LOW)  return '#fe7d37';
  return '#e05d44';
}

function getColorLabel(pct) {
  if (pct >= HIGH) return 'GREEN';
  if (pct >= MID)  return 'YELLOW';
  if (pct >= LOW)  return 'ORANGE';
  return 'RED';
}

function getColorSymbol(pct) {
  if (pct >= HIGH) return '✓';
  if (pct >= MID)  return '△';
  return '✗';
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function progressBar(pct, width = 19) {
  const filled = Math.round((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// ─── SVG Generators ───────────────────────────────────────────────────────────
function generateFlat(label, value, color) {
  const labelWidth = Math.max(label.length * 7 + 10, 40);
  const valueWidth = Math.max(value.length * 7 + 10, 36);
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">
    <text x="${Math.round(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}" lengthAdjust="spacing">${label}</text>
    <text x="${Math.round(labelWidth / 2) * 10}" y="140" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}" lengthAdjust="spacing">${label}</text>
    <text x="${(labelWidth + Math.round(valueWidth / 2)) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(valueWidth - 10) * 10}" lengthAdjust="spacing">${value}</text>
    <text x="${(labelWidth + Math.round(valueWidth / 2)) * 10}" y="140" transform="scale(.1)" textLength="${(valueWidth - 10) * 10}" lengthAdjust="spacing">${value}</text>
  </g>
</svg>`;
}

function generateFlatSquare(label, value, color) {
  const labelWidth = Math.max(label.length * 7 + 10, 40);
  const valueWidth = Math.max(value.length * 7 + 10, 36);
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <g>
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">
    <text x="${Math.round(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}" lengthAdjust="spacing">${label}</text>
    <text x="${Math.round(labelWidth / 2) * 10}" y="140" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}" lengthAdjust="spacing">${label}</text>
    <text x="${(labelWidth + Math.round(valueWidth / 2)) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(valueWidth - 10) * 10}" lengthAdjust="spacing">${value}</text>
    <text x="${(labelWidth + Math.round(valueWidth / 2)) * 10}" y="140" transform="scale(.1)" textLength="${(valueWidth - 10) * 10}" lengthAdjust="spacing">${value}</text>
  </g>
</svg>`;
}

function generateForTheBadge(label, value, color) {
  const l = label.toUpperCase();
  const v = value.toUpperCase();
  const labelWidth = Math.max(l.length * 9 + 20, 80);
  const valueWidth = Math.max(v.length * 9 + 20, 60);
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="28">
  <g>
    <rect width="${labelWidth}" height="28" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="28" fill="${color}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="100" font-weight="bold" letter-spacing="10">
    <text x="${Math.round(labelWidth / 2) * 10}" y="195" transform="scale(.1)">${l}</text>
    <text x="${(labelWidth + Math.round(valueWidth / 2)) * 10}" y="195" transform="scale(.1)">${v}</text>
  </g>
</svg>`;
}

function generateSVG(label, pct, color, style) {
  const value = `${pct}%`;
  switch (style) {
    case 'flat-square':    return generateFlatSquare(label, value, color);
    case 'for-the-badge':  return generateForTheBadge(label, value, color);
    default:               return generateFlat(label, value, color);
  }
}

// ─── Coverage Parsers ─────────────────────────────────────────────────────────
function parseCoverageSummary(filePath, metric) {
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));
  const total = raw.total;
  if (!total) throw new Error('No "total" key in coverage-summary.json');

  const metrics = {};
  for (const key of ['lines', 'branches', 'functions', 'statements']) {
    if (total[key]?.pct !== undefined) {
      metrics[key] = Math.round(total[key].pct * 10) / 10;
    }
  }

  const pct = metrics[metric] ?? metrics.lines ?? metrics.statements;
  if (pct === undefined) throw new Error(`Metric "${metric}" not found in coverage-summary.json`);
  return { pct, metrics, source: 'coverage/coverage-summary.json (Jest/Vitest)' };
}

function parseLcov(filePath, metric) {
  const content = readFileSync(filePath, 'utf8');
  let linesFound = 0, linesHit = 0;
  let branchesFound = 0, branchesHit = 0;
  let functionsFound = 0, functionsHit = 0;

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('LF:'))  linesFound     += parseInt(trimmed.slice(3), 10) || 0;
    if (trimmed.startsWith('LH:'))  linesHit       += parseInt(trimmed.slice(3), 10) || 0;
    if (trimmed.startsWith('BRF:')) branchesFound  += parseInt(trimmed.slice(4), 10) || 0;
    if (trimmed.startsWith('BRH:')) branchesHit    += parseInt(trimmed.slice(4), 10) || 0;
    if (trimmed.startsWith('FNF:')) functionsFound += parseInt(trimmed.slice(4), 10) || 0;
    if (trimmed.startsWith('FNH:')) functionsHit   += parseInt(trimmed.slice(4), 10) || 0;
  }

  const metrics = {};
  if (linesFound > 0)     metrics.lines     = Math.round((linesHit / linesFound) * 1000) / 10;
  if (branchesFound > 0)  metrics.branches  = Math.round((branchesHit / branchesFound) * 1000) / 10;
  if (functionsFound > 0) metrics.functions = Math.round((functionsHit / functionsFound) * 1000) / 10;
  metrics.statements = metrics.lines;

  const pct = metrics[metric] ?? metrics.lines;
  if (pct === undefined) throw new Error('Could not compute coverage from lcov.info');
  return { pct, metrics, source: 'coverage/lcov.info (LCOV)' };
}

function parseClover(filePath, metric) {
  const content = readFileSync(filePath, 'utf8');
  // Extract metrics element: <metrics statements="N" coveredstatements="N" .../>
  const metricsMatch = content.match(/<metrics[^>]+project[^>]*/i) || content.match(/<metrics[^>]+>/i);
  if (!metricsMatch) throw new Error('No <metrics> element found in clover.xml');

  const m = metricsMatch[0];
  const attr = (name) => {
    const match = m.match(new RegExp(`${name}="([\\d.]+)"`));
    return match ? parseFloat(match[1]) : null;
  };

  const stmts = attr('statements'), coveredStmts = attr('coveredstatements');
  const branches = attr('conditionals'), coveredBranches = attr('coveredconditionals');
  const methods = attr('methods'), coveredMethods = attr('coveredmethods');

  const metrics = {};
  if (stmts > 0)   metrics.statements = metrics.lines = Math.round((coveredStmts / stmts) * 1000) / 10;
  if (branches > 0) metrics.branches   = Math.round((coveredBranches / branches) * 1000) / 10;
  if (methods > 0)  metrics.functions  = Math.round((coveredMethods / methods) * 1000) / 10;

  const pct = metrics[metric] ?? metrics.statements;
  if (pct === undefined) throw new Error('Could not compute coverage from clover.xml');
  return { pct, metrics, source: 'coverage/clover.xml (Clover)' };
}

// ─── Coverage Detection ───────────────────────────────────────────────────────
function detectCoverage(metric) {
  const candidates = [
    { path: 'coverage/coverage-summary.json', parser: parseCoverageSummary },
    { path: 'coverage/lcov.info',             parser: parseLcov },
    { path: 'coverage/clover.xml',            parser: parseClover },
  ];

  for (const { path, parser } of candidates) {
    if (existsSync(path)) {
      return parser(path, metric);
    }
  }

  throw new Error(
    'No coverage file found. Expected one of:\n' +
    '  coverage/coverage-summary.json\n' +
    '  coverage/lcov.info\n' +
    '  coverage/clover.xml\n\n' +
    'Or provide --coverage <percentage> directly.'
  );
}

// ─── README Updater ───────────────────────────────────────────────────────────
function updateReadme(badgePath, label) {
  const readmePath = 'README.md';
  const badgeMarkdown = `![${label}](./${badgePath})`;
  const markerPattern = /!\[coverage\]\([^)]+\)/i;

  if (!existsSync(readmePath)) {
    writeFileSync(readmePath, `${badgeMarkdown}\n`);
    return { action: 'created', path: readmePath };
  }

  let content = readFileSync(readmePath, 'utf8');

  if (markerPattern.test(content)) {
    content = content.replace(markerPattern, badgeMarkdown);
    writeFileSync(readmePath, content);
    return { action: 'updated', path: readmePath };
  }

  // Add to top
  writeFileSync(readmePath, `${badgeMarkdown}\n\n${content}`);
  return { action: 'prepended', path: readmePath };
}

// ─── Git Commit ───────────────────────────────────────────────────────────────
function gitCommit(files) {
  try {
    execFileSync('git', ['add', ...files], { stdio: 'inherit' });
    execFileSync('git', ['commit', '-m', 'chore: update coverage badge'], { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error('Git commit failed:', err.message);
    return false;
  }
}

// ─── JSON / Text Output ───────────────────────────────────────────────────────
function outputJson(data) {
  // Never log secrets — coverage data is safe
  console.log(JSON.stringify(data, null, 2));
}

function outputText(pct, label, color, source) {
  const bar = progressBar(pct);
  const sym = getColorSymbol(pct);
  const cl  = getColorLabel(pct);
  console.log(`\n${label}: ${pct}% ${bar} ${sym} ${cl}  (${source})`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  let coverageData;
  const metric = args.metric;

  if (args.coverage !== undefined) {
    const raw = parseFloat(args.coverage);
    if (isNaN(raw) || raw < 0 || raw > 100) {
      console.error('Error: --coverage must be a number between 0 and 100');
      process.exit(1);
    }
    const pct = Math.round(raw * 10) / 10;
    coverageData = {
      pct,
      metrics: { lines: pct, statements: pct, branches: pct, functions: pct },
      source: `--coverage flag (${pct}%)`,
    };
  } else {
    try {
      coverageData = detectCoverage(metric);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  }

  const { pct, metrics, source } = coverageData;
  const color = getColor(pct);
  const label = args.label;

  // ── CI threshold check ────────────────────────────────────────────────────
  if (args.threshold !== undefined) {
    const t = parseFloat(args.threshold);
    if (!isNaN(t) && pct < t) {
      console.error(`Coverage ${pct}% is below threshold ${t}%`);
      process.exit(1);
    }
  }

  // ── Terminal output ───────────────────────────────────────────────────────
  const divider = '━'.repeat(35);
  console.log(`\ncode-coverage-badge`);
  console.log(divider);
  console.log(`  Detected: ${source}`);

  const metricOrder = ['lines', 'branches', 'functions', 'statements'];
  for (const m of metricOrder) {
    if (metrics[m] !== undefined) {
      const active = m === metric ? ' ◀' : '';
      const sym = getColorSymbol(metrics[m]);
      const cl  = getColorLabel(metrics[m]);
      const bar = progressBar(metrics[m]);
      const label_padded = m.charAt(0).toUpperCase() + m.slice(1);
      console.log(`  ${label_padded.padEnd(12)} ${String(metrics[m]).padStart(5)}% ${bar}  ${sym} ${cl}${active}`);
    }
  }

  // ── Format handling ───────────────────────────────────────────────────────
  const format = args.format;
  const outputFile = args.output;
  const commitFiles = [];

  if (format === 'json') {
    outputJson({ pct, metrics, source, color, label, metric });
    return;
  }

  if (format === 'text') {
    outputText(pct, label, color, source);
    return;
  }

  // Default: SVG
  const svg = generateSVG(label, pct, color, args.style);
  writeFileSync(outputFile, svg, 'utf8');
  commitFiles.push(outputFile);
  console.log(`\n  Badge saved: ${outputFile}`);

  // ── README update ─────────────────────────────────────────────────────────
  if (args.readme) {
    const result = updateReadme(outputFile, label);
    console.log(`  README ${result.action}: ${result.path}`);
    commitFiles.push(result.path);
  }

  console.log(divider + '\n');

  // ── Git commit ────────────────────────────────────────────────────────────
  if (args.commit && commitFiles.length > 0) {
    const ok = gitCommit(commitFiles);
    if (ok) console.log('  Committed badge update.\n');
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
