import { test, expect } from '@playwright/test';

test('should accept cookies and verify they are set', async ({ page }, testInfo) => {
  await page.goto('https://www.thethinkingtraveller.com/');
  
  // Get project name from test info
  const projectName = testInfo.project.name || 'default';
  
  await page.getByRole('button', { name: 'Accept all' }).click();
  
  // Get cookies after accepting
  const cookiesAfter = await page.context().cookies();
  
  // Verify essential cookies are set for all projects
  const cookieNames = cookiesAfter.map(cookie => cookie.name);
  const consentCookie = cookiesAfter.find(cookie => cookie.name === 'cookieyes-consent');
  
  // Assert that consent cookie is present and contains consent:yes
  expect(consentCookie).toBeDefined();
  expect(consentCookie?.value).toContain('consent:yes');
  expect(consentCookie?.value).toContain('action:yes');
  expect(consentCookie?.value).toContain('necessary:yes');
  expect(consentCookie?.value).toContain('functional:yes');
  expect(consentCookie?.value).toContain('analytics:yes');
  expect(consentCookie?.value).toContain('performance:yes');
  expect(consentCookie?.value).toContain('advertisement:yes');
  expect(consentCookie?.value).toContain('other:yes');
  
  // Assert Microsoft Clarity tracking cookie is present for all projects
  expect(cookieNames).toContain('_clck');
  
  // Project-specific cookie assertions
  const expectedMinimumCookies = {
    'chromium': 10,
    'firefox': 15,
    'webkit': 2,
    'Mobile Safari': 2,
    'Mobile Chrome': 6,
    'Microsoft Edge': 3
  };
  
  const expectedCookiesForGA = ['chromium', 'firefox', 'webkit', 'Mobile Safari', 'Mobile Chrome'];
  // Note: Microsoft Edge is excluded from GA cookie expectations due to enhanced tracking 
  // prevention features that may block or delay analytics cookies even after consent is given
  
  // Check Google Analytics cookies for projects that should have them
  if (expectedCookiesForGA.includes(projectName)) {
    // Wait a moment for analytics cookies to load
    await page.waitForTimeout(2000);
    const updatedCookies = await page.context().cookies();
    const updatedCookieNames = updatedCookies.map(cookie => cookie.name);
    
    // Hard assertion for GA cookies
    expect(updatedCookieNames).toContain('_ga');
    expect(updatedCookieNames).toContain('_ga_2KCXCK33ST');
  }
  
  // Verify minimum number of cookies based on project
  const minimumExpected = expectedMinimumCookies[projectName] || 2;
  expect(cookiesAfter.length).toBeGreaterThanOrEqual(minimumExpected);
});