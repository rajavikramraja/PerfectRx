import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/escribe/Login.page';
import negativeData from '../../../test-data/credentials/escribe.negative.json';

negativeData.forEach((data) => {
  test(`Negative login – ${data.scenario}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.emailInput.fill(data.username);
    await loginPage.passwordInput.fill(data.password);

    if (data.signInEnable === false) {
      await expect(loginPage.signInButton).toBeDisabled();
      return;
    }

    await loginPage.signInButton.click();
    await expect(page.getByText(data.errorMessage)).toBeVisible();
  });
});
