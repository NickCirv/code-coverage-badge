# code-coverage-badge — documentation research

Reviewed 21 September 2026. Public GitHub source only.

## Revision and scope

- Commit: [`66f4a2bdca664e4ad2bf1370f513942fc09dbb67`](https://github.com/NickCirv/code-coverage-badge/commit/66f4a2bdca664e4ad2bf1370f513942fc09dbb67).
- Tree: `1a118ed7ee0a6c9635be10390c1a284a8aa786bb`; truncated: `false`.
- Capture: 6 of 6 eligible text files; all eligible text files.
- Method: package and entrypoint inspection, implementation-interface review, targeted behavior/limitation inspection, and test-source review. This is not an exhaustive correctness or security audit.
- Commands run against repository code: **none**. External services, deployment and npm publication were not verified.

## Claim and evidence map

| Documentation claim | Pinned evidence | Assessment |
| --- | --- | --- |
| Runtime, executable and development commands | [package.json](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/package.json) | Source declaration inspected; runtime unverified |
| Generates local coverage badges from reports or an explicitly supplied percentage. | [index.js](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/index.js) | Implementation interfaces inspected; behavior not executed |
| Coverage-summary, LCOV and Clover readers; SVG styles; metric selection; optional threshold exit status. | [index.js](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/index.js) | Source-backed scope, not a test result |
| A supplied percentage is accepted input, not test evidence. --readme edits documentation and --commit creates a Git commit. Coverage reports must come from a separate test run. | [index.js](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/index.js) | Material limits documented; service compatibility remains open |
| Existing checks | [test/smoke.test.js](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/test/smoke.test.js) | Test source read; no passing-run claim |

## Documentation inventory and disposition

| Existing document | Decision |
| --- | --- |
| [README.md](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/README.md) | Rewritten with source-specific purpose, direct checkout setup, limitations and verification status. Old section fragments retained where practical. |

Added `docs/REFERENCE.md` for the observed implementation and command surface, and this research record. Protected license and attribution files remain in their original locations without edits. No source or product UI was changed.

## Quality dimensions

| Dimension | Status | Evidence / next step |
| --- | --- | --- |
| Pinned provenance | Verified | Captured commit, tree and per-file hashes recorded below |
| Interface documentation | Partially verified | Source inspection only; run clean-checkout quickstart |
| Runtime behavior | Unverified | No repository execution in this review |
| Test results | Unverified | Existing tests were not run |
| Deployment / package availability | Unverified | No remote publish or live-service check |
| Visual / link checks | Unverified | Portfolio renderer and independent QA are separate from this authoring step |

## Unresolved issues

A supplied percentage is accepted input, not test evidence. --readme edits documentation and --commit creates a Git commit. Coverage reports must come from a separate test run.

## Captured source inventory

This lists captured provenance, not a claim that every line received a full audit. Binary/generated/excluded files are outside the eligible text capture.

| File | SHA-256 | Bytes |
| --- | --- | --- |
| [LICENSE](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/LICENSE) | `68729cab364d82364078b08d8580ccfa51dc69c81a7d64e8d8d47a1da6c9349d` | 1072 |
| [README.md](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/README.md) | `519318851cb4987e9c1177780be7dcf4acae25759611784a791452c266b68553` | 2428 |
| [package.json](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/package.json) | `93ed38b4d9681f023cb7e5bb1b64fab5a8a66d0d18d6bf7d2cfa6cc0170436a3` | 838 |
| [.github/workflows/ci.yml](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/.github/workflows/ci.yml) | `e818f4e6bd805f798665dbbf04964d02f12fc59dd7f18903ad63d26d374ae3f0` | 380 |
| [index.js](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/index.js) | `0ed51f734fd4904272a270fd4581a537aae18808568b95238aa73d98f2221b2a` | 18439 |
| [test/smoke.test.js](https://github.com/NickCirv/code-coverage-badge/blob/66f4a2bdca664e4ad2bf1370f513942fc09dbb67/test/smoke.test.js) | `31178f9e769b3cc662acbdb5a9984a51a26132adb2f1a6ecf1b6d94cc9470c1f` | 338 |
