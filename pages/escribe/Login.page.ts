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

  readonly signInSignInFormUsernameInputHelperTextText: Locator;
  readonly incorrectUsernameOrPasswordPleaseCheckYourText: Locator;
  readonly forgotEmailInput: Locator;
  readonly forgotSubmitButton: Locator;
  readonly forgotCancelButton: Locator;
  readonly resetNewPasswordInput: Locator;
  readonly resetConfirmPasswordInput: Locator;
  readonly resetSubmitButton: Locator;
  readonly resetSuccessText: Locator;
  

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
    this.signInSignInFormUsernameInputHelperTextText = page.getByText('Required', { exact: true });
    // Robust locator for various phrasing of credential errors
    this.incorrectUsernameOrPasswordPleaseCheckYourText = page.getByText(/invalid username|incorrect username|invalid username or password|incorrect username or password|invalid credentials/i);
    // Forgot-password form elements (may appear in a dialog or page)
    this.forgotEmailInput = page.locator('form:has(button:has-text("Send")) input[type="email"], input[placeholder*="Email" i]').first();
    this.forgotSubmitButton = page.locator('form:has(button:has-text("Send")) button:has-text("Send"), button:has-text("Submit")').first();
    this.forgotCancelButton = page.locator('form:has(button:has-text("Cancel")), button:has-text("Cancel")').first();
    // Reset password form elements
    this.resetNewPasswordInput = page.locator('input[name="newPassword"], input[placeholder*="New password" i], input[type="password"]').first();
    this.resetConfirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm" i]').first();
    this.resetSubmitButton = page.locator('button:has-text("Reset"), button:has-text("Submit")').first();
    this.resetSuccessText = page.getByText(/password reset successful|we have updated your password/i);
    
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
    await this.page.waitForLoadState('networkidle').catch(() => null);
  }

  async openForgotPassword(): Promise<void> {
    await this.clickForgotpasswordbutton();
  }

  async fillForgotEmail(email: string): Promise<void> {
    await this.forgotEmailInput.waitFor({ timeout: 5000 }).catch(() => null);
    await this.forgotEmailInput.fill(email).catch(async () => {
      await this.forgotEmailInput.click();
      await this.forgotEmailInput.type(email);
    });
  }

  async submitForgot(): Promise<void> {
    await this.forgotSubmitButton.waitFor({ timeout: 5000 }).catch(() => null);
    await this.forgotSubmitButton.click();
  }

  async cancelForgot(): Promise<void> {
    await this.forgotCancelButton.waitFor({ timeout: 2000 }).catch(() => null);
    await this.forgotCancelButton.click().catch(() => null);
  }

  async fillResetPassword(newPwd: string, confirmPwd: string): Promise<void> {
    await this.resetNewPasswordInput.waitFor({ timeout: 5000 }).catch(() => null);
    await this.resetNewPasswordInput.fill(newPwd).catch(async () => {
      await this.resetNewPasswordInput.click();
      await this.resetNewPasswordInput.type(newPwd);
    });
    await this.resetConfirmPasswordInput.fill(confirmPwd).catch(async () => {
      await this.resetConfirmPasswordInput.click();
      await this.resetConfirmPasswordInput.type(confirmPwd);
    });
  }

  async submitReset(): Promise<void> {
    await this.resetSubmitButton.waitFor({ timeout: 5000 }).catch(() => null);
    await this.resetSubmitButton.click();
  }

  async isSignInEnabled(): Promise<boolean> {
    return await this.signInButton.isEnabled().catch(() => false);
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
   * Navigate to the login page with an optional absolute URL override.
   */
  async navigateTo(url?: string): Promise<void> {
    if (url) {
      await this.page.goto(url);
    } else {
      await this.page.goto('/');
    }
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
async clickSigninsigninformusernameinputhelpertexttext(): Promise<void> {
    await this.signInSignInFormUsernameInputHelperTextText.click();
  }

  async clickIncorrectusernameorpasswordpleasecheckyourtext(): Promise<void> {
    await this.incorrectUsernameOrPasswordPleaseCheckYourText.click();
  }
}







