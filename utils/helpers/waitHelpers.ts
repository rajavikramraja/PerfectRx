const DEFAULT_TIMEOUT = Number(process.env.DEFAULT_TIMEOUT) || 30000;

export async function waitForVisible(locator, timeout = DEFAULT_TIMEOUT) {
  await locator.waitFor({ state: 'visible', timeout });
}

export async function waitForEnabled(locator, timeout = DEFAULT_TIMEOUT) {
  await locator.waitFor({ state: 'enabled', timeout });
}
