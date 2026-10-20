/**
 * Contract Form Page - صفحة نموذج العقد (نسخة مبسطة)
 * استخراج جميع تفاصيل العقد بكود مباشر بسيط جداً
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';


interface ContractDetails {
  contractNumber: string;
  contractStatus: string;
  contractStartDateGregorian: string;
  contractEndDateGregorian: string;
  contractStartDateHijri: string;
  contractEndDateHijri: string;
  productBaseClassification: string;
  calendarType: string;
  pricing: string;
  contractDurationYears: string;
}

export class ContractFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * استخرج جميع تفاصيل العقد - كود مباشر بسيط
   */
  async extractAllContractDetails(): Promise<ContractDetails> {

    
      // ========== استخراج البيانات مباشرة ==========
try {
      // انتظر الـ main form
      await this.page.locator('[data-id="editFormRoot"]').waitFor({
        state: 'visible',
        timeout: 5000
      });

      
//main form
//  Contract ID/Number
   const contractNumber = await this.page
    .getByLabel('Contract Number', { exact: true })
    .evaluate((input: HTMLInputElement) => input.value);
//contractStatus

 const contractStatus= await this.page
  .getByRole('combobox', { name: 'Contract Status', exact: true })
  .evaluate((select: HTMLSelectElement) => {
    const selectedOption = Array.from(select.options).find(
      (opt) => opt.getAttribute('data-selected') === 'true'
    );
    return selectedOption?.textContent?.trim() || '';
  });



    
//  Product Base Classification
 const productBaseClassification = await this.page
    .locator('[data-id="ldv_productmainfamily.fieldControl-LookupResultsDropdown_ldv_productmainfamily_selected_tag"]')
    .evaluate((el: HTMLElement) => el.textContent?.trim() || '');
      



// Wait the form to upload instead offixed timeout
  await this.page.locator('[data-id="editFormRoot"]').waitFor({ 
    state: 'visible', 
    timeout: 5000 
  });


   // افتح "Contract Pricing Details" section
      await this.page.getByText('Contract Pricing Details', { exact: false }).click();
      await this.page.waitForTimeout(500);
// تصغير الصفحة بنسبة مئوية
await this.page.evaluate(() => {
  document.body.style.zoom = '80%'; // 80% من الحجم الأصلي
});

  //contract Start Date gregorian
const contractStartDateGregorian = await this.page
  .getByLabel('Contract Starting Date',{exact: true})
  .evaluate((input: HTMLInputElement) => input.value);
//contract End Date gregorian
const contractEndDateGregorian = await this.page
  .getByLabel('Contract Expiry Date',{exact: true})
  .evaluate((input: HTMLInputElement) => input.value);






//  Contract Starting Date (Hijri)
const contractStartDateHijri = await this.page
  .getByRole('textbox', { name: 'Contract Starting Date (Hijri)', exact: true })
  .inputValue();

//  Contract Expiry Date (Hijri)
const  contractEndDateHijri = await this.page
  .getByRole('textbox', { name: 'Contract Expiry Date (Hijri)', exact: true })
  .inputValue();
 


  //  Calendar Type
const calendarType = await this.page
    .locator('[data-id="ldv_pricingdate.fieldControl-option-set-select"]')
    .evaluate((select: HTMLSelectElement) => {
      const selectedOption = Array.from(select.options).find(
        (opt) => opt.getAttribute('data-selected') === 'true'
      );
      return selectedOption?.textContent?.trim() || 'غير محدد';
    });

  //  Pricing (Lookup Field)
  const  pricing = await this.page
    .locator('[data-id="ldv_pricing.fieldControl-LookupResultsDropdown_ldv_pricing_selected_tag_text"]')
    .evaluate((el: HTMLElement) => el.textContent?.trim() || '');

//  duration yaers
const  contractDurationYears = await this.page
  .locator('[data-id="ldv_contractdurationinyears.fieldControl-whole-number-text-input"]')
  .evaluate((el: HTMLInputElement) => el.value || '');
  
const contractDurationYearsNum = Number(contractDurationYears);



   

      

  
   

      
      

      // إنشء كائن البيانات
      const details: ContractDetails = {
        contractNumber: contractNumber.trim(),
        contractStatus,
        contractStartDateGregorian: contractStartDateGregorian.trim(),
        contractEndDateGregorian: contractEndDateGregorian.trim(),
        contractStartDateHijri: contractStartDateHijri.trim(),
        contractEndDateHijri: contractEndDateHijri.trim(),
      
        productBaseClassification,
        calendarType: calendarType.trim(),
        pricing: pricing.trim(),
        contractDurationYears: contractDurationYears.trim(),
      };

      // طباعة البيانات
      this.printContractDetails(details);

      return details;
    } catch (error) {
      console.error('\n❌ فشل استخراج البيانات:', error);
      throw error;
    }
  }

  /**
   * طباعة تفاصيل العقد بشكل جميل
   */
  private printContractDetails(details: ContractDetails): void {
    console.log('📋 تفاصيل العقد المستخرجة:\n');

    console.log('{');
    console.log(`  contractNumber: '${details.contractNumber}',`);
    console.log(`  contractStatus: '${details.contractStatus}',`);
    console.log(`  contractStartDateGregorian: '${details.contractStartDateGregorian}',`);
    console.log(`  contractEndDateGregorian: '${details.contractEndDateGregorian}',`);
    console.log(`  contractStartDateHijri: '${details.contractStartDateHijri}',`);
    console.log(`  contractEndDateHijri: '${details.contractEndDateHijri}',`);
    console.log(`  calendarType: '${details.calendarType}',`);
    console.log(`  productBaseClassification: '${details.productBaseClassification}',`);
    console.log(`  pricing: '${details.pricing}',`);
    console.log(`  contractDurationYears: '${details.contractDurationYears}',`);
    console.log('}');


 
}}
