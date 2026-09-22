# code-coverage-badge — implementation reference

Source revision: `66f4a2bdca664e4ad2bf1370f513942fc09dbb67`. This reference records source declarations; it is not a transcript of a successful run.

## Entrypoint and runtime

[package.json](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/package.json) declares `index.js`. Node.js `>=20` and npm; Git is also used by the implementation.

Executable mapping: `code-coverage-badge` → `./index.js`, `ccb` → `./index.js`.

## Supported workflow

Coverage-summary, LCOV and Clover readers; SVG styles; metric selection; optional threshold exit status.

A supplied percentage is accepted input, not test evidence. --readme edits documentation and --commit creates a Git commit. Coverage reports must come from a separate test run.

## Command reference

The commands below use the installed executable name. From the pinned checkout, replace it with the `node` entrypoint shown above. Options and command branches were cross-checked against captured source; examples are not execution transcripts.

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

## Package scripts

| Script | Exact command |
| --- | --- |
| `test` | `node --test` |

## Implementation sources

[index.js](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/index.js).

## Verification boundary

No repository code, tests, network operation, hook installer or migration was executed for this review. Source inspection supports the documented interface; runtime correctness and external-service compatibility remain unverified.
