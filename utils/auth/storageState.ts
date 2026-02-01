import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export async function saveStorage(page: Page, filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await page.context().storageState({ path: filePath });
}