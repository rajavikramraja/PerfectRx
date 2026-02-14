import { test, expect } from '@playwright/test';

test('Inspect QA login page selectors', async ({ page }) => {
  // Navigate to QA login
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  console.log('\n=== PAGE TITLE ===');
  console.log(await page.title());

  console.log('\n=== ALL TEXTBOXES ===');
  const textboxes = await page.locator('input[type="text"]').all();
  for (let i = 0; i < textboxes.length; i++) {
    const locator = textboxes[i];
    const value = await locator.getAttribute('placeholder');
    const type = await locator.getAttribute('type');
    const id = await locator.getAttribute('id');
    const name = await locator.getAttribute('name');
    console.log(`  [${i}] placeholder="${value}", type="${type}", id="${id}", name="${name}"`);
  }

  console.log('\n=== ALL BUTTONS ===');
  const buttons = await page.locator('button').all();
  for (let i = 0; i < buttons.length; i++) {
    const locator = buttons[i];
    const text = await locator.textContent();
    const type = await locator.getAttribute('type');
    console.log(`  [${i}] text="${text}", type="${type}"`);
  }

  console.log('\n=== LABELS WITH TEXT ===');
  const labels = await page.locator('label').all();
  for (let i = 0; i < labels.length; i++) {
    const locator = labels[i];
    const text = await locator.textContent();
    console.log(`  [${i}] "${text}"`);
  }

  console.log('\n=== PAGE HTML SNIPPET ===');
  const html = await page.content();
  const formStart = html.indexOf('<form');
  if (formStart > 0) {
    console.log(html.substring(formStart, formStart + 800));
  }

  await page.pause();
});
