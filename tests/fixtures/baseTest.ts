import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type EscribeRole = 'SYS_ADMIN' | 'DASHBOARD_ADMIN' | 'PARTNER_ADMIN' | 'PRACTICE_ADMIN' | 'SALESGROUP_ADMIN' | 'SALESGROUP_REP';

const roleToFileMap: Record<EscribeRole, string> = {
  SYS_ADMIN: 'sysadmin.json',
  DASHBOARD_ADMIN: 'dashboard.json',
  PARTNER_ADMIN: 'partner.json',
  PRACTICE_ADMIN: 'practice.json',
  SALESGROUP_ADMIN: 'salesgroup.json',
  SALESGROUP_REP: 'salesgroup.json',
};

/**
 * Create a path to the storageState file for a role
 */
function createStorageStatePath(role: EscribeRole): string {
  return path.join('storageState', 'escribe', roleToFileMap[role]);
}

/**
 * Check if a valid storageState file exists for a role (not empty)
 */
function storageStateExists(role: EscribeRole): boolean {
  const filePath = createStorageStatePath(role);
  return fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
}

export const test = base.extend({
  sysAdminPage: async ({ browser }, use) => {
    const storageState = storageStateExists('SYS_ADMIN') ? createStorageStatePath('SYS_ADMIN') : undefined;
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  
  dashboardAdminPage: async ({ browser }, use) => {
    const storageState = storageStateExists('DASHBOARD_ADMIN') ? createStorageStatePath('DASHBOARD_ADMIN') : undefined;
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  
  partnerAdminPage: async ({ browser }, use) => {
    const storageState = storageStateExists('PARTNER_ADMIN') ? createStorageStatePath('PARTNER_ADMIN') : undefined;
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  
  practiceAdminPage: async ({ browser }, use) => {
    const storageState = storageStateExists('PRACTICE_ADMIN') ? createStorageStatePath('PRACTICE_ADMIN') : undefined;
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  
  salesgroupAdminPage: async ({ browser }, use) => {
    const storageState = storageStateExists('SALESGROUP_ADMIN') ? createStorageStatePath('SALESGROUP_ADMIN') : undefined;
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  
  salesgroupRepPage: async ({ browser }, use) => {
    const storageState = storageStateExists('SALESGROUP_REP') ? createStorageStatePath('SALESGROUP_REP') : undefined;
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
