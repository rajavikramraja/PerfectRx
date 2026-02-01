import { Page, Locator } from '@playwright/test';
import { waitForVisible, waitForEnabled } from '../../utils/helpers/wait.helper';

export default class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly termCheckbox: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.termCheckbox = page.getByRole('checkbox');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async navigate() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await waitForVisible(this.emailInput);
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.termCheckbox.check();
    await waitForEnabled(this.signInButton);
    await this.signInButton.click();
  }
}
