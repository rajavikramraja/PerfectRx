import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/escribe/Login.page';
import credentials from '../../test-data/credentials/escribe.json';
import negativeData from '../../test-data/credentials/escribe.negative.json';

// Enable video and screenshot capture for these tests so we can provide artifacts
test.use({ video: 'on', screenshot: 'on' });

test.describe('Escribe — Login & Password Flows', () => {
  test.beforeEach(async ({ page }) => {
    const loginPath = '/login';
    const base = process.env.ESCRIBE_URL || process.env.BASE_URL || undefined;
    const url = base ? new URL(loginPath, base).toString() : loginPath;

    const tryGoto = async () => {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    };

    try {
      await tryGoto();
    } catch (err) {
      await new Promise((r) => setTimeout(r, 1000));
      await tryGoto();
    }
  });

  test('Valid user login should navigate to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creds: any = credentials as any;
    const sys = creds.SYS_ADMIN;

    await loginPage.navigate();
    await loginPage.fillSigninformusernameinput(sys.username);
    await loginPage.fillSigninformpasswordinput(sys.password);
    await loginPage.checkSigninformagreementinputcheckbox();
    expect(await loginPage.isSignInEnabled()).toBeTruthy();
     await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle' }),
  loginPage.clickSigninbutton()
]);

      if (sys.expectedUrl) {
        await expect(page).toHaveURL(new RegExp(sys.expectedUrl));
      }
    // await loginPage.clickSigninbutton();

    // await expect(page).toHaveURL(new RegExp(sys.expectedUrl));
  });

  test('Invalid credentials should show authentication error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const negative = negativeData.negative[0];

    await loginPage.navigate();
    await loginPage.fillSigninformusernameinput(negative.username);
    await loginPage.fillSigninformpasswordinput(negative.password);
    await loginPage.checkSigninformagreementinputcheckbox();
    expect(await loginPage.isSignInEnabled()).toBeTruthy();
    await loginPage.clickSigninbutton();

    await expect(page.getByText(negative.errorMessage, { exact: false })).toBeVisible();
  });

//   // --- Negative scenarios from test-data ---
//   for (const data of (negativeData as any).negative) {
//     test(`Negative: ${data.scenario}`, async ({ page }) => {
//       const loginPage = new LoginPage(page);
//       await loginPage.navigate();
//       await loginPage.fillSigninformusernameinput(data.username);
//       await loginPage.fillSigninformpasswordinput(data.password);
//       // If checkbox exists, click it to enable button when appropriate
//       await loginPage.checkSigninformagreementinputcheckbox();

//       if (data.signInEnable === false) {
//         // Button should be disabled and required helper visible for empty fields
//         expect(await loginPage.isSignInEnabled()).toBeFalsy();
//         await expect(page.getByText('Required', { exact: false })).toBeVisible();
//         return;
//       }

//       expect(await loginPage.isSignInEnabled()).toBeTruthy();
//       await loginPage.clickSigninbutton();
//       if (data.errorMessage) {
//         await expect(page.getByText(data.errorMessage, { exact: false })).toBeVisible();
//       }
//     });
//   }

// --- Negative scenarios from test-data ---
for (const data of negativeData.negative) {
  test(`Negative: ${data.scenario}`, async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillSigninformusernameinput(data.username);
    await loginPage.fillSigninformpasswordinput(data.password);
    await loginPage.checkSigninformagreementinputcheckbox();

    // If button should be disabled
    if (data.signInEnable === false) {

      await expect(loginPage.signInButton).toBeDisabled();

      // Validate correct error message dynamically
      if (data.errorMessage) {
        const errorLocator = page.getByText(data.errorMessage, { exact: false });

        if (data.scenario === 'Both fields empty') {
          await expect(errorLocator).toHaveCount(2);
        } else {
          await expect(errorLocator).toBeVisible();
        }
      }

      return;
    }

    // If button should be enabled
    await expect(loginPage.signInButton).toBeEnabled();
    await loginPage.clickSigninbutton();

    if (data.errorMessage) {
      await expect(
        page.getByText(data.errorMessage, { exact: false })
      ).toBeVisible();
    }

  });
}


  test('Forgot password cancel and submit flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creds: any = credentials as any;
    const sys = creds.SYS_ADMIN;

    await loginPage.navigate();
    await loginPage.openForgotPassword();
    // cancel should return to sign-in UI
    await loginPage.cancelForgot();
    await expect(page.locator('button:has-text("Sign"), button:has-text("Login")')).toBeVisible();

    // reopen and submit with valid email
    await loginPage.openForgotPassword();
    await loginPage.fillForgotEmail(sys.username);
    await loginPage.submitForgot();

    // Expect neutral confirmation
    await expect(page.getByText('If an account exists', { exact: false })).toBeVisible();
  });

  test('Reset password via token (simulate link)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // simulate visiting reset link (in real tests you'd fetch token from email service)
    await page.goto('/reset-password?token=VALID_TOKEN_EXAMPLE');
    await page.waitForLoadState('networkidle');

    await loginPage.fillResetPassword('Str0ngP@ssword!2026', 'Str0ngP@ssword!2026');
    await loginPage.submitReset();
    await expect(loginPage.resetSuccessText).toBeVisible();
  });

  // --- Positive role-based login tests ---
  const credsAny: any = credentials as any;
  for (const role of Object.keys(credsAny)) {
    test(`Positive: login as ${role}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const c = credsAny[role];
      // Verify credential shape from test-data/credentials/escribe.json
      expect(c).toBeTruthy();
      expect(c.username, `Missing username for role ${role}`).toBeTruthy();
      expect(c.password, `Missing password for role ${role}`).toBeTruthy();
      expect(c.expectedUrl, `Missing expectedUrl for role ${role}`).toBeTruthy();
      await loginPage.navigate();
      await loginPage.fillSigninformusernameinput(c.username);
      await loginPage.fillSigninformpasswordinput(c.password);
      await loginPage.checkSigninformagreementinputcheckbox();
      expect(await loginPage.isSignInEnabled()).toBeTruthy();
      //await loginPage.clickSigninbutton();
      await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle' }),
  loginPage.clickSigninbutton()
]);

      if (c.expectedUrl) {
        await expect(page).toHaveURL(new RegExp(c.expectedUrl));
      }
    });
  }
});
