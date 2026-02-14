import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/escribe/Login.page';
import negativeData from '../../../test-data/credentials/escribe.negative.json';

negativeData.negative.forEach((data: any) => {
  test(`Negative login – ${data.scenario}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillSigninformusernameinput(data.username);
    await loginPage.fillSigninformpasswordinput(data.password);

    if (data.signInEnable === false) {
      await expect(loginPage.signInButton).toBeDisabled();
      return;
    }

    await loginPage.clickSigninbutton();
    await expect(page.getByText(data.errorMessage)).toBeVisible();
  });
});
