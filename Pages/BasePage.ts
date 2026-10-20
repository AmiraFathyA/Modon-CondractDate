/**
 * Base Page - الصفحة الأساسية
 * تحتوي على الوظائف والمتغيرات المشتركة لجميع الصفحات
 */

import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // انتظر حتى تحميل الصفحة
  
 async waitForPageLoad(): Promise<void> {
  await this.wait(3000);  // Simple timeout instead
}

  /**
   * انتظر عنصر معين
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * أدخل نص في حقل
   */
  async fillField(selector: string, value: string): Promise<void> {
    const field = this.page.locator(selector);
    await field.fill(value);
  }

  /**
   * اختر من dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * اضغط على زر
   */
  async clickButton(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * احصل على قيمة input field
   */
  async getInputValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  /**
   * احصل على نص عنصر
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * انتظر timeout معين
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * التقط لقطة شاشة
   */
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: filename });
  }

  /**
   * احصل على قيمة من عنصر HTMLInput
   */
  async getElementValue(selector: string): Promise<string> {
    return await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLInputElement;
      return element?.value?.trim() || '';
    }, selector);
  }

  /**
   * اختبر ما إذا كان عنصر معين موجود
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }
}
