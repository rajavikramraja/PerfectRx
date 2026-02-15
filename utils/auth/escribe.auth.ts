import { Page } from '@playwright/test';
import LoginPage from '../../pages/escribe/Login.page';
import credentials from '../../test-data/credentials/escribe.json';
import fs from 'fs';
import path from 'path';

type EscribeRole =
  | 'SYS_ADMIN'
  | 'PARTNER_ADMIN'
  | 'PRACTICE_ADMIN'
  | 'SALESGROUP_ADMIN'
  | 'SALESGROUP_REP'
  | 'DASHBOARD_ADMIN';

export async function loginEscribeAs(page: Page, role: EscribeRole) {
  const loginPage = new LoginPage(page);

  const credsAny: any = credentials as any;
  let username: string | undefined;
  let password: string | undefined;

  // First: prefer environment variables: ESCRIBE_URL, ESCRIBE_<ROLE>_USERNAME, ESCRIBE_<ROLE>_PASSWORD
  const envUsername = process.env[`ESCRIBE_${role}_USERNAME`] || process.env.ESCRIBE_USERNAME;
  const envPassword = process.env[`ESCRIBE_${role}_PASSWORD`] || process.env.ESCRIBE_PASSWORD;
  const envUrl = process.env.ESCRIBE_URL || process.env.BASE_URL || undefined;

  if (envUsername) username = envUsername;
  if (envPassword) password = envPassword;

  // If env vars not provided, fall back to test-data (supports mapping or legacy array)
  if ((!username || !password) && credsAny && typeof credsAny === 'object') {
    if (credsAny[role]) {
      username = username || credsAny[role].username;
      password = password || credsAny[role].password;
    } else if (Array.isArray(credsAny.positive)) {
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const target = normalize(role);
      const found = credsAny.positive.find((r: any) => r.role && normalize(r.role) === target);
      if (found) {
        username = username || found.username;
        password = password || found.password;
      }
    }
  }

  if (!username || !password) {
    throw new Error(`Credentials for role ${role} not found in env or test-data/credentials/escribe.json`);
  }

  // Determine optional storageState path and URL
  const roleToFileMap: Record<string, string> = {
    SYS_ADMIN: 'sysadmin.json',
    DASHBOARD_ADMIN: 'dashboard.json',
    PARTNER_ADMIN: 'partner.json',
    PRACTICE_ADMIN: 'practice.json',
    SALESGROUP_ADMIN: 'salesgroup.json',
    SALESGROUP_REP: 'salesgroup.json',
  };

  const storageDir = path.join('storageState', 'escribe');
  const storageFile = roleToFileMap[role] || `${role.toLowerCase()}.json`;
  const storagePath = path.join(storageDir, storageFile);

  // Navigate (use envUrl override if present)
  if (envUrl) {
    await loginPage.navigateTo(envUrl);
  } else {
    await loginPage.navigate();
  }

  await loginPage.login(username, password);

  // After successful login, persist storageState so other fixtures can reuse it.
  try {
    // ensure directory exists
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    await page.context().storageState({ path: storagePath });
  } catch (err) {
    // non-fatal: log and continue
    // eslint-disable-next-line no-console
    console.warn('Failed to save storageState:', err);
  }
}
