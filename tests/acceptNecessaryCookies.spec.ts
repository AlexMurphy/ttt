import { test, expect } from '@playwright/test';

test('accept only necessary cookies', async ({ page }, testInfo) => {
  await page.goto('https://www.thethinkingtraveller.com/');
  await page.waitForLoadState('domcontentloaded');
  
  await page.getByRole('button', { name: 'Accept necessary only' }).click();
  await page.waitForTimeout(2000);
  
  const cookiesAfter = await page.context().cookies();
  
  // Essential cookie validation
  const consentCookie = cookiesAfter.find(cookie => cookie.name === 'cookieyes-consent');
  expect(consentCookie, 'Consent cookie should be present').toBeDefined();
  expect(consentCookie!.value, 'Consent should indicate necessary cookies accepted')
    .toContain('necessary:yes');
  expect(consentCookie!.value, 'Analytics should be disabled')
    .toContain('analytics:no');
  expect(consentCookie!.value, 'Advertisement should be disabled')
    .toContain('advertisement:no');
  
  // Ensure no privacy-violating cookies are set
  const googleAnalyticsCookies = cookiesAfter.filter(cookie => cookie.domain.includes('google-analytics.com'));
  const googleTagManagerCookies = cookiesAfter.filter(cookie => cookie.domain.includes('googletagmanager.com'));
  const facebookCookies = cookiesAfter.filter(cookie => cookie.domain.includes('facebook.com'));
  
  expect(googleAnalyticsCookies.length + googleTagManagerCookies.length, 
    'No Google Analytics/Tag Manager cookies should be present').toBe(0);
  expect(facebookCookies.length, 
    'No Facebook tracking cookies should be present').toBe(0);
});