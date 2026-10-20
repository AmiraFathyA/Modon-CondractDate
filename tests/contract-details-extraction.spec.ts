/**
 * Contract Details Extraction Test
 * استخراج وطباعة جميع تفاصيل العقد مع تحويل التاريخ الهجري
 */

import { test, expect } from '@playwright/test';

import { ContractListPage } from '../pages/ContractListPage';
import { ContractFormPage } from '../pages/ContractFormPage';
import { InvoicePricingCalculation } from '../pages/InvoicePricingCalculation';
//// ==================== البيانات المشتركة بين الاختبارات ====================
const testData = {
  // البيانات من Test 1
  contractNumber: '',
  entryDate: '', // تاريخ نهاية العقد (ميلادي)

  // البيانات من Test 2
  pricingName: '',
  contractDuration: 0,
  yearNumber: 0,

  // البيانات من Test 3
  quoteId: '',

  // البيانات من Test 4
  invoiceNumber: '',
  invoiceStartDate: '',
  invoiceEndDate: '',
  remainingDays: 0,
  daysDifference: 0,
  daysDifferenceRounded: 0,
  newInvoiceEndDate: '', // ✅ النتيجة الأهم

  // البيانات من Test 5
  futureInvoices: []
};

// ==================== دوال مساعدة ====================

/**
 * تحويل نص التاريخ إلى Date object
 * صيغة: MM/DD/YYYY
 */
function parseSimpleDate(dateString: string): Date {
  const parts = dateString.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  return new Date(year, month - 1, day);
}

/**
 * دالة مساعدة لحساب عدد الأيام بين تاريخين
 */
function getDaysBetween(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDifference = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDifference / millisecondsPerDay);
}

test.describe('استخراج تفاصيل العقد المتكاملة', () => {
  // 📝 قيّم هذه القيم قبل التشغيل
  const USERNAME = 'MBSDC\\crmadmin'; // أضف بيانات المستخدم
  const PASSWORD = 'linkP@ss'; // أضف كلمة المرور
  const CONTRACT_NUMBER = '26000136';
const DYNAMICS_365_URL = 'https://phase4mdqcmodon.linkdev.com/main.aspx?appid=675c50d4-8d42-ea11-a9b0-000d3a46f0d9&pagetype=entitylist&etn=ldv_contract&viewid=07e578c8-5b1c-eb11-ab0a-000d3aad8783&viewType=1039'; 
// fixtures/shared-page.ts






  test(' Get All Contract Details', async ({ page }) => {
    // تسجيل الدخول إلى Dynamics 365
    await page.goto(DYNAMICS_365_URL);
    // ملء بيانات المستخدم
    await page.fill('input[type="email"]', USERNAME);
    await page.fill('input[type="password"]', PASSWORD);
   await page.getByRole('button', { name:'sign in' }).click();
    // انتظر تحميل الصفحة الرئيسية
    //await page.waitForURL(DYNAMICS_365_URL);
    await page.waitForTimeout(3000);

    // انتقل إلى قائمة العقود
    const contractListPage = new ContractListPage(page);
   // await contractListPage.navigateToContractList(DYNAMICS_365_URL);

    // ابحث عن العقد وافتحه
    await contractListPage.searchAndOpenContract(CONTRACT_NUMBER);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('خطوة 2️⃣ : استخراج تفاصيل العقد');
    

    // استخرج جميع التفاصيل
    const contractFormPage = new ContractFormPage(page);
    const details = await contractFormPage.extractAllContractDetails();
console.log(contractFormPage.extractAllContractDetails)
    // التحقق من استخراج البيانات
    expect(details.contractNumber).toBeTruthy();
    expect(details.contractEndDateHijri).toBeTruthy();
    
    // طباعة النتائ

    console.log('✅ اكتمل الاختبار بنجاح!');
  

/**
   * Test 2️⃣: استخراج بيانات Pricing والانتقال للعرض
   
   */
  
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  Test 2️⃣: استخراج بيانات Pricing                      ║');

    const invoiceCalc = new InvoicePricingCalculation(page);

    // الانتقال إلى Pricing Form
    testData.pricingName = await invoiceCalc.navigateToPricingForm();

    // استخراج بيانات Pricing
    const pricingData = await invoiceCalc.extractPricingFormData();
    testData.contractDuration = pricingData.contractDuration;
    testData.yearNumber = pricingData.yearNumber;

    console.log('✅ البيانات المستخرجة:');
    console.log(`   اسم Pricing: ${testData.pricingName}`);
    console.log(`   عدد سنوات العقد: ${testData.contractDuration}`);
    console.log(`   السنة الحالية: ${testData.yearNumber}\n`);

    expect(testData.contractDuration).toBeGreaterThan(0);
    expect(testData.yearNumber).toBeGreaterThan(0);
  
  /**
   * Test 3️⃣: الانتقال للعرض واستخراج بيانات الفاتورة
 
   */
  
    console.log('║  Test 3️⃣: استخراج بيانات الفاتورة                     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

   // const invoiceCalc = new InvoicePricingCalculation(page);

    // الانتقال إلى Active Quote
    testData.quoteId = await invoiceCalc.navigateToActiveQuote();
    const quoteData = await invoiceCalc.extractQuoteData();

    // الانتقال إلى ERP Logs
    await invoiceCalc.navigateToERPLogs();

    // استخراج بيانات الفاتورة
    const invoiceData = await invoiceCalc.extractInvoiceData();
    testData.invoiceNumber = invoiceData.invoiceNumber;
    testData.invoiceStartDate = invoiceData.invoiceStartDate;
    testData.invoiceEndDate = invoiceData.invoiceEndDate;

    console.log('✅ بيانات الفاتورة الأصلية:');
    console.log(`   رقم الفاتورة: ${testData.invoiceNumber}`);
    console.log(`   البداية: ${testData.invoiceStartDate}`);
    console.log(`   النهاية الحالية: ${testData.invoiceEndDate}\n`);


  });




});


