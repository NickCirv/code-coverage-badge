<div align="center">

# code-coverage-badge

**Generate self-hosted SVG coverage badges from Jest, Vitest, LCOV, or Clover output — no external services.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?labelColor=0B0A09)](LICENSE)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?labelColor=0B0A09)](package.json)
[![Node: >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen?labelColor=0B0A09)](package.json)

</div>

## Install

```bash
npx github:NickCirv/code-coverage-badge
```

## Usage

```bash
# Auto-detect coverage file and generate badge
npx github:NickCirv/code-coverage-badge

# Update README.md badge inline
npx github:NickCirv/code-coverage-badge --readme

# Provide coverage directly (skips file detection)
npx github:NickCirv/code-coverage-badge --coverage 87.5

# CI mode: exit 1 if coverage is below threshold
npx github:NickCirv/code-coverage-badge --threshold 80 --readme --commit
```

| Flag | Default | Description |
|------|---------|-------------|
| `--coverage <n>` | — | Raw percentage (skips file detection) |
| `--readme` | false | Update `README.md` badge automatically |
| `--threshold <n>` | — | Exit 1 if coverage below N% (CI gate) |
| `--metric lines\|branches\|functions\|statements` | `lines` | Which metric to badge |
| `--thresholds <h,m,l>` | `90,75,60` | Green / yellow / red cutoffs |
| `--style flat\|flat-square\|for-the-badge` | `flat` | Badge style |
| `--format svg\|json\|text` | `svg` | Output format |
| `--output <file>` | `coverage-badge.svg` | SVG output path |
| `--label <text>` | `coverage` | Badge label text |
| `--commit` | false | Git-commit the badge + README after update |

## What it does

Reads your existing coverage report (`coverage/coverage-summary.json`, `coverage/lcov.info`, or `coverage/clover.xml`), extracts the requested metric, and writes a colour-coded SVG badge — green above your high threshold, yellow above medium, orange above low, red below. Use `--readme` to automatically splice the badge into your `README.md`, and `--threshold` to fail CI builds that drop below a coverage floor.

## GitHub Actions example

```yaml
- name: Generate coverage badge
  run: |
    npm test -- --coverage
    npx github:NickCirv/code-coverage-badge --readme --threshold 80 --commit
```

---

<sub>Zero dependencies · Node >=18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>
