import { test as base } from '@playwright/test';

export const test = base.extend({
  sysAdminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'storageState/escribe/sysadmin.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
