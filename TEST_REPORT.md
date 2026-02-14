# Test Execution Report — PerfectRX E2E Tests

**Date:** February 9, 2026  
**Test Suite:** `tests/escribe/auth/login.negative.spec.ts`  
**Environment:** QA (`https://qa.portal.perfectrx.com/`)

---

## Summary

| Metric | Value |
|--------|-------|
| **Test Cases** | 18 (6 scenarios × 3 browsers: chromium, firefox, webkit) |
| **Status** | All 18 **FAILED** (timeouts) |
| **Duration** | ~120 seconds total |
| **Artifacts** | 18 screenshots, 18 videos |

---

## Fixes Applied

### 1. ✅ Playwright Configuration ([playwright.config.ts](playwright.config.ts#L1-L40))
- **Before:** `baseURL` was commented out; tests failed with "Invalid url: '/'"
- **After:** Configured `baseURL` from environment map (dev/qa/stage/prod)
  ```typescript
  const baseURL = process.env.ESCRIBE_URL || urlMap[env] || 'https://qa.portal.perfectrx.com/';
  ```
- **Result:** Tests successfully navigate to QA URL

### 2. ✅ Test Data Structure Fixed
- **escribe.json:** Closed JSON object (was missing closing `}`)
- **escribe.negative.json:** Wrapped `negative` array in object structure
- **apiPlatform.json & pom.json:** Initialized with empty `positive`/`negative` arrays
- **urls.json:** Populated with environment-specific endpoints

### 3. ✅ TypeScript Configuration ([tsconfig.json](tsconfig.json))
- Added minimal valid compiler options for test transpilation

### 4. ✅ Test Code ([tests/escribe/auth/login.negative.spec.ts](tests/escribe/auth/login.negative.spec.ts#L1-L22))
- Updated to use `negativeData.negative` array (JSON structure)
- Replaced invalid locator calls with proper POM methods:
  - `loginPage.emailInput.fill()` → `loginPage.fillSigninformusernameinput()`
  - `loginPage.passwordInput.fill()` → `loginPage.fillSigninformpasswordinput()`
  - `loginPage.signInButton.click()` → `loginPage.clickSigninbutton()`

### 5. ✅ Dependencies
- Installed `dotenv` for environment variable loading

---

## Current Test Status

### Navigation ✅
Tests successfully navigate to `https://qa.portal.perfectrx.com/`. However, they **timeout waiting for form elements** (30s):

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Email *', exact: true })
```

### Root Cause
The page selectors in [pages/escribe/Login.page.ts](pages/escribe/Login.page.ts#L17-L21) do not match the actual QA site DOM:
```typescript
// Current selector (doesn't match QA site)
this.signInFormUsernameInput = page.getByRole('textbox', { name: 'Email *', exact: true });
```

### Screenshots & Videos
All 18 test runs produced:
- **18 screenshots** in `reports/fail/` showing the QA login page  
- **18 videos** in `reports/fail/` (webm format) showing the wait timeout

---

## Next Steps

### To Fix Tests:
1. **Inspect QA login page DOM** — Use browser DevTools or Playwright Inspector to find correct selectors
2. **Update page locators** in [pages/escribe/Login.page.ts](pages/escribe/Login.page.ts) to match actual form elements
3. **Re-run tests** with corrected selectors

### Example Inspector Command:
```bash
$env:ENV='qa'; npx playwright test tests/escribe/auth/login.negative.spec.ts --debug
```

### Alternate Selector Strategies:
- Use `data-testid` attributes if available on QA site
- Use `placeholder` text instead of role + label
- Use CSS selectors or XPath if role-based queries fail

---

## Artifacts

| Type | Location | Count |
|------|----------|-------|
| Screenshots | [reports/fail/](reports/fail) | 18 PNG files |
| Videos | [reports/fail/](reports/fail) | 18 WebM files |
| Error Context | [reports/fail/](reports/fail) | 18 MD files |
| JSON Test Report | [reports/test-run.json](reports/test-run.json) | 1 file |

---

## Environment Configuration

### .env Files Loaded ✅
- [.env.qa](.env.qa) — QA environment variables
- [.env.dev](.env.dev) — Dev environment variables  
- [.env.stage](.env.stage) — Stage environment variables
- [.env.prod](.env.prod) — Prod environment variables

### Playwright Config
```
ENV=qa
ESCRIBE_URL=https://qa.portal.perfectrx.com/
POM_URL=https://qa.operations.perfectrx.com/
API_BASE_URL=https://test.apis.perfectrx.com/v1/
```

---

## Run Command

```bash
# Run with QA environment
$env:ENV='qa'; npx playwright test tests/escribe/auth/login.negative.spec.ts

# Run with debug inspector
$env:ENV='qa'; npx playwright test tests/escribe/auth/login.negative.spec.ts --debug

# View HTML report
npx playwright show-report
```

---

**Status:** ✅ Infrastructure Fixed | ⏳ Waiting for Selector Correction
