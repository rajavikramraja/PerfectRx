import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/escribe/Login.page';
import negativeData from '../../../test-data/credentials/escribe.negative.json';

negativeData.negative.forEach((data: any) => {
  test(`Negative login – ${data.scenario}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillSigninformusernameinput(data.username);
    await loginPage.fillSigninformpasswordinput(data.password);

    // Click agreement checkbox (some apps require this to enable Sign In)
    await loginPage.checkSigninformagreementinputcheckbox();

    // If test data expects sign-in to remain disabled, assert that and verify required helper text
    if (data.signInEnable === false) {
      await expect(loginPage.signInButton).toBeDisabled();
      // The form should show a 'Required' helper for empty fields
      await expect(page.getByText('Required')).toBeVisible();
      return;
    }

    // Otherwise the Sign In button should be enabled once username/password and checkbox are set
    await expect(loginPage.signInButton).toBeEnabled();
    await loginPage.clickSigninbutton();

    // For invalid credentials, assert the expected error message is visible.
    if (data.errorMessage) {
      // prefer exact match from test data, fallback to generic locator
      const msgLocator = page.getByText(data.errorMessage, { exact: false });
      await expect(msgLocator).toBeVisible();
    }
  });
});
