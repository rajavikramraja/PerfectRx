import { Page, Locator, expect } from '@playwright/test';

export default class LoginPage {
  readonly page: Page;
  readonly divElement: Locator;
  readonly signInFormUsernameInput: Locator;
  readonly signInFormPasswordInput: Locator;
  readonly pathElement: Locator;
  readonly signInFormAgreementInputCheckbox: Locator;
  readonly forgotPasswordButton: Locator;
  readonly privacyPolicyButton: Locator;
  readonly signInButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.divElement = page.locator(`.MuiGrid-root`);
    // Flexible selectors: Try type-based, placeholder, name attribute
    this.signInFormUsernameInput = page.locator('input[type="email"], input[placeholder*="Email" i], input[placeholder*="Username" i], input[name*="email" i], input[name*="username" i]').first();
    this.signInFormPasswordInput = page.locator('input[type="password"], input[placeholder*="Password" i], input[name*="password" i]').first();
    this.pathElement = page.locator(`xpath=//*[local-name()='path']`);
    // Try checkbox by type or role
    this.signInFormAgreementInputCheckbox = page.locator('input[type="checkbox"], [role="checkbox"]').first();
    // Try buttons by text or aria-label
    this.forgotPasswordButton = page.locator('button:has-text("Forgot"), [role="button"]:has-text("Forgot"), a:has-text("Forgot")').first();
    this.privacyPolicyButton = page.locator('a:has-text("privacy"), button:has-text("privacy"), [role="button"]:has-text("privacy")').first();
    this.signInButton = page.locator('button:has-text("Sign"), button:has-text("Login"), [role="button"]:has-text("Sign"), [role="button"]:has-text("Login")').first();
    this.closeButton = page.locator('button:has-text("Close"), [aria-label*="Close" i], button[aria-label*="close" i]').first();
  }

  async clickDivelement(): Promise<void> {
    await this.divElement.click();
  }

  async fillSigninformusernameinput(value: string): Promise<void> {
    await this.signInFormUsernameInput.waitFor({ timeout: 5000 }).catch(() => null);
    await this.signInFormUsernameInput.fill(value).catch(async () => {
      // Fallback: try typing if fill fails
      await this.signInFormUsernameInput.click();
      await this.signInFormUsernameInput.type(value);
    });
  }

  async fillSigninformpasswordinput(value: string): Promise<void> {
    await this.signInFormPasswordInput.waitFor({ timeout: 5000 }).catch(() => null);
    await this.signInFormPasswordInput.fill(value).catch(async () => {
      // Fallback: try typing if fill fails
      await this.signInFormPasswordInput.click();
      await this.signInFormPasswordInput.type(value);
    });
  }

  async clickPathelement(): Promise<void> {
    await this.pathElement.click();
  }

  async checkSigninformagreementinputcheckbox(): Promise<void> {
    const checkbox = this.signInFormAgreementInputCheckbox;
    await checkbox.waitFor({ timeout: 5000 }).catch(() => null);
    const isChecked = await checkbox.isChecked().catch(() => false);
    if (!isChecked) {
      await checkbox.check().catch(async () => {
        // Fallback: try clicking if check fails
        await checkbox.click();
      });
    }
  }

  async clickForgotpasswordbutton(): Promise<void> {
    await this.forgotPasswordButton.click();
  }

  async clickPrivacypolicybutton(): Promise<void> {
    await this.privacyPolicyButton.click();
  }

  async clickSigninbutton(): Promise<void> {
    await this.signInButton.waitFor({ timeout: 5000 }).catch(() => null);
    await this.signInButton.click();
  }

  async clickClosebutton(): Promise<void> {
    await this.closeButton.click();
  }

  /**
   * Navigate to the login page.
   * Uses Playwright `baseURL` when available by navigating to '/'.
   */
  async navigate(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform the standard login flow: fill username, password, check agreement, click Sign In.
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillSigninformusernameinput(username);
    await this.fillSigninformpasswordinput(password);
    await this.checkSigninformagreementinputcheckbox();
    await this.clickSigninbutton();
  }

  /**
   * Verify that the key login UI elements are visible and ready for interaction.
   */
  async verifyLoginUI(): Promise<void> {
    await expect(this.signInFormUsernameInput).toBeVisible();
    await expect(this.signInFormPasswordInput).toBeVisible();
    await expect(this.signInFormAgreementInputCheckbox).toBeVisible();
    await expect(this.forgotPasswordButton).toBeVisible();
    await expect(this.privacyPolicyButton).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.closeButton).toBeVisible();
  }

}


