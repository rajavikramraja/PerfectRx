import { test, expect } from '@playwright/test';
import { loginEscribeAs } from '../../../utils/auth/escribe.auth';

test('Sys Admin can login to Escribe', async ({ page }) => {
  await loginEscribeAs(page, 'SYS_ADMIN');
  await expect(page).toHaveURL(/dashboard/);
});
