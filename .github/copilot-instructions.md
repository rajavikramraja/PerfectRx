# Copilot / AI Agent Instructions — PerfectRX

This file contains targeted guidance for AI coding agents working in this repository. Keep suggestions precise and edit only discoverable patterns.

- **Big picture**: Playwright E2E test suite organized around a Page Object Model (POM). Tests live under `tests/` and use Playwright fixtures in `tests/fixtures/`. Page objects are in `pages/` and `pom/`. Helpers and auth flows live under `utils/` and `test-data/` contains credentials and JSON fixtures.

- **Key files to read before edits**:
  - [playwright.config.ts](playwright.config.ts#L1-L200) — test runner configuration and projects
  - [tests/fixtures/baseTest.ts](tests/fixtures/baseTest.ts#L1-L40) — custom fixtures and `storageState` usage
  - [pages/escribe/Login.page.ts](pages/escribe/Login.page.ts#L1-L70) — example POM (note: currently inconsistent with helper expectations)
  - [utils/auth/escribe.auth.ts](utils/auth/escribe.auth.ts#L1-L40) — how tests call page objects (expects `navigate()` + `login()` interface)
  - [package.json](package.json#L1-L50) — dependencies (no test scripts present; use `npx playwright test`)

- **Developer workflows / commands**:
  - Run tests: `npx playwright test` (project uses `@playwright/test` as a devDependency).
  - Run a single test file: `npx playwright test tests/path/to/file.spec.ts`.
  - Open the HTML report after a run: `npx playwright show-report`.
  - Tests rely on pre-generated storage states under `storageState/` — see `tests/fixtures/baseTest.ts`.

- **Project-specific conventions & gotchas**:
  - POM interface expectation: helpers in `utils/auth/` call page objects using `new LoginPage(page); await loginPage.navigate(); await loginPage.login(username, password);` (see [utils/auth/escribe.auth.ts](utils/auth/escribe.auth.ts#L1-L40)). When editing or adding POMs, implement `navigate()` and `login()` unless updating all call sites.
  - There are inconsistent/partial POM implementations (for example, [pages/escribe/Login.page.ts](pages/escribe/Login.page.ts#L1-L70) defines `Loginpagets` methods differently). Prefer aligning POM exports to a default class matching the helper usage.
  - `storageState` is used to seed authenticated contexts. Tests expect JSON files inside `storageState/escribe/` — generate and commit these via `await page.context().storageState({ path: 'storageState/...json' })` (helper: `utils/auth/storageState.ts`).
  - `utils/auth/` contains multiple files; some are placeholders or empty (`pom.auth.ts`, `apiToken.ts`). Treat them as incomplete and avoid heavy refactors unless requested.

- **Integration points**:
  - API-style tests live under `api/` and `tests/apiPlatform/` and reference `utils/helpers/api.helper.ts` and `utils/auth/apiToken.ts` for token flows (some token helpers are unimplemented).
  - Credentials and test data: `test-data/credentials/*.json` and `test-data/urls.json` supply environment-specific values.

- **When making changes**:
  - Keep edits minimal and preserve public APIs. If you modify POM interfaces (e.g., rename `login()`), update all `utils/auth/*` callers and tests.
  - Avoid adding project-level scripts to `package.json` without author approval — the repo currently uses direct `npx playwright` commands.
  - Run `npx playwright test` locally to verify changes and check `playwright.config.ts` for project-specific flags.

- **Examples to copy from**:
  - Use `tests/fixtures/baseTest.ts` to see how contexts are created with `storageState`.
  - Use `utils/auth/escribe.auth.ts` as the canonical way tests perform login flows.

If anything here is unclear or you'd like the agent to follow a stricter style (export patterns, naming), tell me which conventions to enforce and I will update this file.
