import { Page } from '@playwright/test';
import LoginPage from '../../pages/escribe/Login.page';
import credentials from '../../test-data/credentials/escribe.json';

type EscribeRole =
  | 'SYS_ADMIN'
  | 'PARTNER_ADMIN'
  | 'PRACTICE_ADMIN'
  | 'SALESGROUP_ADMIN'
  | 'DASHBOARD_ADMIN';

export async function loginEscribeAs(page: Page, role: EscribeRole) {
  const loginPage = new LoginPage(page);

  const { username, password } = credentials[role];

  await loginPage.navigate();
  await loginPage.login(username, password);
}
