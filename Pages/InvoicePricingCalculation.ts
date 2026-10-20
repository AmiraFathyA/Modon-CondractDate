/**
 * فئة احتساب فرق الأيام الهجري-الميلادي للفواتير
 * Invoice Pricing Calculation - صيغة معقدة لاحتساب فرق الأيام
 *
 * الهدف:
 * ١. الذهاب إلى Pricing Form من خلال Contract Form
 * ٢. الذهاب إلى Active Quote من Pricing Form
 * ٣. الذهاب إلى ERP Invoices من Quotation Form
 * ٤. استخراج بيانات الفواتير (Start Date, End Date)
 * ٥. حساب فرق الأيام باستخدام المعادلة الخاصة
 * ٦. تحديث تاريخ النهاية الجديد للفاتورة
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

interface InvoiceData {
  invoiceNumber: string;
  invoiceStartDate: string; // تاريخ بداية الفاتورة (ميلادي)
  invoiceEndDate: string; // تاريخ نهاية الفاتورة (ميلادي)
}

interface PricingFormData {
  pricingName: string;
  contractDuration: number; // عدد سنوات العقد
  yearNumber: number; // السنة الحالية (1, 2, 3, 4, 5...)
}

interface QuoteData {
  quoteId: string;
  status: string;
}

interface FutureInvoice {
  invoiceNumber: number; // 1, 2, 3, 4
  startDate: string; // تاريخ البداية (MM/DD/YYYY)
  endDate: string; // تاريخ النهاية (MM/DD/YYYY)
  daysCount: number; // عدد الأيام (365)
}

export class InvoicePricingCalculation extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * ٢. الذهاب إلى Pricing Form من خلال حقل Pricing في Contract Form
   * خطوات:
   * 1. البحث عن حقل Pricing
   * 2. استخراج رقم Pricing (مثل: CP-01272-29-12-25)
   * 3. الضغط عليه
   * 4. انتظار تحميل صفحة Pricing Form
   */
  async navigateToPricingForm(): Promise<string> {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     📋 الانتقال إلى صفحة Pricing Form                   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
      // انتظر ظهور قسم Contract Pricing Details
      await this.page.locator('[data-id="editFormRoot"]').waitFor({
        state: 'visible',
        timeout: 5000
      });

      // استخراج رقم Pricing
      const pricingLink = await this.page
        .getByRole('link')
        .filter({ has: this.page.locator('text=CP-') })
        .first();

      const pricingNumber = await pricingLink.textContent();
      console.log(`✅ تم العثور على Pricing: ${pricingNumber}`);

      // الضغط على رابط Pricing
      await pricingLink.click();
      console.log(`\n⏳ جاري الانتقال إلى صفحة Pricing...`);

      // انتظر تحميل صفحة Pricing Form
      await this.page.waitForURL(/ldv_contractpricing/, { timeout: 10000 });

      console.log(`✅ تم الانتقال إلى صفحة Pricing بنجاح\n`);

      return pricingNumber?.trim() || '';
    } catch (error) {
      console.error('❌ فشل الانتقال إلى صفحة Pricing:', error);
      throw new Error('فشل الانتقال إلى صفحة Pricing Form');
    }
  }

  /**
   * ٣. استخراج بيانات Pricing Form
   */
  async extractPricingFormData(): Promise<PricingFormData> {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     📝 استخراج بيانات صفحة Pricing Form                ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
      // استخراج Name
      const name = await this.page
        .getByLabel('Name', { exact: true })
        .inputValue();

      // استخراج Contract Duration
      const contractDuration = parseInt(
        await this.page
          .locator('[data-id="ldv_contractduration.fieldControl-whole-number-text-input"]')
          .inputValue() || '0'
      );

      // استخراج Year Number
      const yearNumber = parseInt(
        await this.page
          .locator('[data-id="ldv_yearnumber.fieldControl-whole-number-text-input"]')
          .inputValue() || '0'
      );

    

      // استخراج Contract ID

      const data: PricingFormData = {
        pricingName: name.trim(),
        contractDuration,
        yearNumber,
       
      };

      console.log('📊 بيانات Pricing Form المستخرجة:');
      console.log(JSON.stringify(data, null, 2));
      console.log('');

      return data;
    } catch (error) {
      console.error('❌ فشل استخراج بيانات Pricing Form:', error);
      throw error;
    }
  }

  /**
   * ٤. الانتقال إلى Active Quote من خلال Quotes Tab في Pricing Form
   */
  async navigateToActiveQuote(): Promise<string> {
    console.log('║     🎯 الانتقال إلى Active Quote                       ║');

    try {
      // البحث عن Quotes tab
      const quotesTab = this.page.getByRole('tab').filter({
        hasText: /Quotes|جدول الأسعار/i
      });

      // انقر على Quotes tab
      await quotesTab.click();

      // انتظر لظهور جدول الـ Quotes
      await this.page.waitForTimeout(500);

      // البحث عن Active Quote (الأول أو الحالي)
      const activeQuoteLink = this.page
        .locator('text=QUO-')
       // .filter({ hasText: /Active/i })
        .first();

      let quoteId = await activeQuoteLink.textContent();
      console.log(` تم العثور على Active Quote: ${quoteId}`);


  
      // الضغط على Quote
      await activeQuoteLink.dblclick();

      // انتظر تحميل صفحة Quote
      await this.page.waitForURL(/quote/, { timeout: 10000 });

      console.log(`✅ تم الانتقال إلى صفحة Quote بنجاح\n`);

      return quoteId?.trim() || '';
    } catch (error) {
      console.error('❌ فشل الانتقال إلى Active Quote:', error);
      throw new Error('فشل الانتقال إلى صفحة Active Quote');
    }
  }

  /**
   * ٥. استخراج بيانات Quote
   */
  async extractQuoteData(): Promise<QuoteData> {

    try {
      let quoteId = await this.page
        .locator('text=QUO-') .textContent();
  

      const data: QuoteData = {
        quoteId: quoteId?.trim() || '',
        status: 'Active',
      };

      console.log('📊 بيانات Quote المستخرجة:');
      console.log(JSON.stringify(data, null, 2));
      console.log('');

      return data;
    } catch (error) {
      console.error('❌ فشل استخراج بيانات Quote:', error);
      throw error;
    }
  }

  /**
   * ٦. الانتقال إلى ERP Logs من Related section في صفحة Quote
   */
  async navigateToERPLogs(): Promise<void> {

    console.log('║     🔗 الانتقال إلى ERP Logs                           ║');

    try {
      // ابحث عن قائمة Related
      const relatedMenu = await this.page.locator('[data-id="tablist-tab_related3b554255-7717-4d17-bb7f-9936fb1e75ca"]').click();
await this.page.waitForTimeout(300);
  
  

await this.page.evaluate(() => {
    document.body.style.zoom = '60%';
}); 

      // ابحث عن خيار ERP Logs في القائمة
      const erpLogsOption = this.page
        .locator('[dataId="form-tab-relatedEntity-nav_ldv_quote_ldv_erpinvoice_quote"]')
        .or(this.page.getByText("ERP Logs", { exact: true }));

      // انقر على ERP Logs
      await erpLogsOption.click();

      // انتظر تحميل صفحة ERP Logs
      await this.page.waitForTimeout(1000);

      console.log('✅ تم الانتقال إلى ERP Logs بنجاح\n');
    } catch (error) {
      console.error('❌ فشل الانتقال إلى ERP Logs:', error);
      throw new Error('فشل الانتقال إلى صفحة ERP Logs');
    }
  }

  /**
   * ٧. استخراج بيانات الفواتير من ERP Logs
   */
  async extractInvoiceData(): Promise<InvoiceData> {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     📋 استخراج بيانات الفواتير من ERP                  ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
      // استخراج بيانات الفاتورة الأولى (أو الحالية)
      const invoiceRows = this.page.locator('[role="row"]');
    await this.waitForElement('[role="grid"]', 5000);
   // Array to store all invoices
    const invoices: { invoiceNumber: string;
       invoiceStartDate: string;
        invoiceEndDate: string;
         type: string; }[] = [];
  

      for (let i = 1; i < await invoiceRows.count(); i++) {
        let row = invoiceRows.nth(i);
        // Get the Type cell
         const  type = await row.locator('[role="gridcell"][aria-colindex="3"]').getAttribute('title') ?? 'empty';

       if (type !== 'Invoice') { continue;}

       const cells = row.locator('[role="gridcell"]');

       const  invoiceNumber = await row.locator('[role="gridcell"][aria-colindex="5"]').getAttribute('title')?? 'empty';
       const  invoiceStartDate =await row.locator('[role="gridcell"][aria-colindex="14"]').getAttribute('title')?? 'empty';
       const  invoiceEndDate = await row.locator('[role="gridcell"][aria-colindex="15"]').getAttribute('title')?? 'empty';

       // Store invoice data in the array
        invoices.push({ invoiceNumber, invoiceStartDate, invoiceEndDate, type });


      }
        



     const rows = this.page.locator('[role="row"]');

for (let i = 1; i < await rows.count(); i++) {

    // تحديد الصف الحالي
    const row = rows.nth(i);

    // تحديد Type cell داخل الصف الحالي فقط
    const typeCell = row.locator(
        '[role="gridcell"][aria-colindex="3"]'
    );

    const type = await typeCell.getAttribute('title');

    console.log(`Row ${i} - Type: ${type}`);
}
// Print all extracted invoices
 console.log('Total Invoices:', invoices.length); 
 console.log('Extracted Invoice Data:');
  for (const invoice of invoices)
     { console.log('-----------------------------');
       console.log('Invoice Type:', invoice.type);
        console.log('Invoice Number:', invoice.invoiceNumber);
         console.log('Start Date:', invoice.invoiceStartDate);
          console.log('End Date:', invoice.invoiceEndDate); }

      // سيتم حسابها لاحقاً
     const data: InvoiceData = {
   invoiceNumber: 'invoiceNumber',
       invoiceStartDate: 'invoiceStartDate',
      invoiceEndDate: 'invoiceEndDate',
      };

      return data;
    } catch (error) {
      console.error('❌ فشل استخراج بيانات الفواتير:', error);
      throw error;
    }
  }

 

  
}
