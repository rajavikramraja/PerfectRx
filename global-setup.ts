 import { chromium } from '@playwright/test';
import { loginEscribeAs } from './utils/auth/escribe.auth';
import { saveStorage } from './utils/auth/storage';

export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await loginEscribeAs(page, 'SYS_ADMIN');
  await saveStorage(page, 'storageState/escribe/sysadmin.json');

  await browser.close();
};
