/**
 * Contract List Page - صفحة قائمة العقود
 * تتعامل مع البحث والتنقل بين العقود
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContractListPage extends BasePage {
  // Selectors
  readonly searchInput = 'input[placeholder*="Search"]';
  readonly viewTitle = 'h1:has-text("Modon Contracts")';
 readonly contractRow = (contractNumber: string) =>
  `a[title="${contractNumber}"]`;

  constructor(page: Page) {
    super(page);
  }

  /**
   * انتقل إلى صفحة العقود
   */
  async navigateToContractList(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
    await this.isPageLoaded();
  }

  /**
   * تحقق من تحميل الصفحة
   */
  async isPageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.viewTitle);
  }

  /**
   * ابحث عن عقد
   */
  async searchForContract(contractNumber: string): Promise<void> {
    console.log(`🔍 البحث عن العقد: ${contractNumber}`);

    // أدخل رقم العقد في حقل البحث
    await this.fillField(this.searchInput, contractNumber);
    await this.wait(1000);

    // اضغط Enter للبحث
    await this.page.press(this.searchInput, 'Enter');
    await this.wait(2000);
  }

  /**
   * افتح عقد محدد
   */
  async openContract(contractNumber: string): Promise<void> {
    console.log(`📂 فتح العقد: ${contractNumber}`);

    const contractLocator = this.page.locator(this.contractRow(contractNumber));
    await contractLocator.first().click();
await this.wait(4000);  }

  /**
   * ابحث وافتح عقد
   */
  async searchAndOpenContract(contractNumber: string): Promise<void> {
    await this.searchForContract(contractNumber);
    await this.openContract(contractNumber);
  }
}
