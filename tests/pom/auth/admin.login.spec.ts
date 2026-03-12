import { test } from '@playwright/test';

test('Admin login with Google - save session', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://qa.operations.perfectrx.com/signin');

  // Click Google Sign In
  await page.click('text=Sign in with Google');

  // 🔹 Manually complete Google login here
  // Wait until redirected back to your app dashboard
  await page.waitForURL('**/dashboard');

  // Save login session
  await context.storageState({ path: 'adminAuth.json' });
});
