/**
 * Login Page - صفحة تسجيل الدخول
 * تتعامل مع تسجيل الدخول إلى Dynamics 365
 */

import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class LoginPage extends BasePage {
  // Selectors
  readonly emailInput = 'input[type="email"]';
  readonly passwordInput = 'input[type="password"]';
  readonly signInButton = 'button[type="submit"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * انتقل إلى صفحة تسجيل الدخول
   */
  async navigateToLogin(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

 async login(email: string, password: string): Promise<void> {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.getByRole('button', { name:'sign in' }).click();
    await this.waitForPageLoad();
  }



}
