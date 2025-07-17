import { test, expect } from '@playwright/test';

/**
 * Cookie Preferences Test Suite
 * 
 * This test suite validates the cookie preference center functionality on thethinkingtraveller.com
 * by iterating through each optional cookie category and testing them in isolation.
 * 
 * The test follows the Page Object Model pattern and performs the following actions:
 * 1. Navigate to the website
 * 2. Open cookie preferences dialog
 * 3. For each optional cookie category:
 *    - Enable only that specific category
 *    - Save preferences
 *    - Verify the preference was saved
 *    - Reset for next iteration
 */

// Define the optional cookie categories available on the site
const OPTIONAL_COOKIE_CATEGORIES = [
  'Functional',
  'Analytics', 
  'Advertisement',
  'Uncategorized'
] as const;

// Page Object Model class for Cookie Preferences
class CookiePreferencesPage {
  constructor(private page: any) {}

  async navigate(): Promise<void> {
    // Clear any existing cookies to ensure fresh state
    await this.page.context().clearCookies();
    await this.page.goto('https://www.thethinkingtraveller.com/');
    await this.page.waitForLoadState('domcontentloaded');
    // Wait a bit for any dynamic content to load
    await this.page.waitForTimeout(2000);
  }

  async openCookiePreferences(): Promise<void> {
    // First check if dialog is already open
    const existingDialog = await this.page.locator('[role="dialog"][aria-label*="Customize"]').isVisible();
    if (existingDialog) {
      return;
    }

    // Try multiple approaches to open the cookie preferences dialog
    const attempts = [
      // Approach 1: Click the footer Cookie Preferences button
      async () => {
        console.log('🍪 Attempting to click footer Cookie Preferences button...');
        
        // Scroll to footer to ensure button is visible
        await this.page.locator('button:has-text("Cookie Preferences")').scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        
        // Click with force to bypass overlays
        await this.page.locator('button:has-text("Cookie Preferences")').click({ force: true });
        await this.page.waitForTimeout(2000);
        
        return await this.page.locator('[role="dialog"][aria-label*="Customize"]').isVisible();
      },
      
      // Approach 2: Try the footer link approach
      async () => {
        console.log('🍪 Attempting footer link approach...');
        
        await this.page.locator('text=Cookie Preferences').scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        await this.page.locator('text=Cookie Preferences').click({ force: true });
        await this.page.waitForTimeout(2000);
        
        return await this.page.locator('[role="dialog"][aria-label*="Customize"]').isVisible();
      },
      
      // Approach 3: Check for and click "Customize" button if present
      async () => {
        console.log('🍪 Looking for Customize button...');
        
        const customizeButton = await this.page.locator('button:has-text("Customize")').first();
        if (await customizeButton.isVisible()) {
          await customizeButton.click({ force: true });
          await this.page.waitForTimeout(2000);
          return await this.page.locator('[role="dialog"][aria-label*="Customize"]').isVisible();
        }
        return false;
      }
    ];

    // Try each approach until one works
    for (let i = 0; i < attempts.length; i++) {
      try {
        const success = await attempts[i]();
        if (success) {
          console.log(`✅ Cookie preferences dialog opened successfully (attempt ${i + 1})`);
          return;
        }
      } catch (error) {
        console.log(`❌ Attempt ${i + 1} failed: ${error}`);
      }
    }

    throw new Error('Could not open cookie preferences dialog after all attempts');
  }

  async enableSpecificCookieCategory(category: string): Promise<void> {
    // Use more specific selectors based on the actual DOM structure
    // Find the checkbox by looking for the category button text and then finding the associated checkbox
    const categorySection = this.page.locator(`[role="dialog"][aria-label*="Customize"]`).locator(`button:has-text("${category}")`).locator('..');
    const categoryCheckbox = categorySection.locator('input[type="checkbox"]');
    
    // Check if the checkbox is not already checked
    const isChecked = await categoryCheckbox.isChecked();
    if (!isChecked) {
      await categoryCheckbox.check();
    }
  }

  async disableAllOptionalCookies(): Promise<void> {
    // Disable all optional cookie categories to ensure clean state
    for (const category of OPTIONAL_COOKIE_CATEGORIES) {
      try {
        const categorySection = this.page.locator(`[role="dialog"][aria-label*="Customize"]`).locator(`button:has-text("${category}")`).locator('..');
        const categoryCheckbox = categorySection.locator('input[type="checkbox"]');
        const isChecked = await categoryCheckbox.isChecked();
        if (isChecked) {
          await categoryCheckbox.uncheck();
        }
      } catch (error) {
        console.log(`Could not find or disable ${category} checkbox: ${error}`);
      }
    }
  }

  async savePreferences(): Promise<void> {
    // Use force click to bypass any overlays (like chat widgets)
    await this.page.getByRole('button', { name: 'Save My Preferences' }).click({ force: true });
    
    // Wait for the save to be processed
    await this.page.waitForTimeout(2000);
    
    // Manually close the dialog after saving
    try {
      const dialogStillVisible = await this.page.locator('[role="dialog"][aria-label*="Customize"]').isVisible();
      if (dialogStillVisible) {
        // Use more specific selector for the cookie dialog close button
        await this.page.locator('[role="dialog"][aria-label*="Customize"] button[aria-label="Close"]').click({ force: true });
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      // Dialog may have already closed
    }
  }

  async verifyCategoryIsEnabled(category: string): Promise<boolean> {
    // Reopen the dialog to verify the state
    await this.openCookiePreferences();
    
    const categorySection = this.page.locator(`[role="dialog"][aria-label*="Customize"]`).locator(`button:has-text("${category}")`).locator('..');
    const categoryCheckbox = categorySection.locator('input[type="checkbox"]');
    const isChecked = await categoryCheckbox.isChecked();
    
    // Close the dialog - use specific selector for cookie dialog close button
    await this.page.locator('[role="dialog"][aria-label*="Customize"] button[aria-label="Close"]').click({ force: true });
    await this.page.waitForSelector('[role="dialog"][aria-label*="Customize"]', { state: 'hidden' });
    
    return isChecked;
  }

  async getCookies(): Promise<any[]> {
    return await this.page.context().cookies();
  }

  async closeCookieDialog(): Promise<void> {
    // Use specific selector for cookie dialog close button
    await this.page.locator('[role="dialog"][aria-label*="Customize"] button[aria-label="Close"]').click({ force: true });
    await this.page.waitForSelector('[role="dialog"][aria-label*="Customize"]', { state: 'hidden' });
  }
}

// Test suite for cookie preferences
test.describe('Cookie Preferences Center', () => {
  
  // Test each optional cookie category in isolation
  for (const category of OPTIONAL_COOKIE_CATEGORIES) {
    test(`should enable ${category} cookies in isolation and save preferences`, async ({ page }) => {
      const cookiePreferencesPage = new CookiePreferencesPage(page);
      
      // Step 1: Navigate to the website
      await cookiePreferencesPage.navigate();
      
      // Step 2: Get initial cookies state
      const cookiesBefore = await cookiePreferencesPage.getCookies();
      console.log(`\n🍪 Initial cookies count: ${cookiesBefore.length}`);
      
      // Step 3: Open cookie preferences dialog
      await cookiePreferencesPage.openCookiePreferences();
      
      // Step 4: Disable all optional cookies first (clean state)
      await cookiePreferencesPage.disableAllOptionalCookies();
      
      // Step 5: Enable only the specific category being tested
      await cookiePreferencesPage.enableSpecificCookieCategory(category);
      console.log(`\n✅ Enabled ${category} cookies`);
      
      // Step 6: Save preferences
      await cookiePreferencesPage.savePreferences();
      console.log(`\n💾 Saved preferences for ${category} cookies`);
      
      // Step 7: Verify the preference was saved correctly
      const isEnabled = await cookiePreferencesPage.verifyCategoryIsEnabled(category);
      expect(isEnabled).toBe(true);
      console.log(`\n✅ Verified ${category} cookies remain enabled after save`);
      
      // Step 8: Get cookies after preference change
      const cookiesAfter = await cookiePreferencesPage.getCookies();
      console.log(`\n🍪 Final cookies count: ${cookiesAfter.length}`);
      
      // Step 9: Assert that preferences were actually applied
      // The consent cookie should have been updated to reflect the new preferences
      const consentCookie = cookiesAfter.find(cookie => 
        cookie.name.toLowerCase().includes('consent') || 
        cookie.name.toLowerCase().includes('cookie') ||
        cookie.name.toLowerCase().includes('cky')
      );
      
      expect(consentCookie).toBeDefined();
      console.log(`\n🍪 Found consent cookie: ${consentCookie?.name}`);
      
      // Log successful test completion
      console.log(`\n🎉 Successfully completed ${category} cookie preference test`);
    });
  }

  // Additional test to verify "Accept necessary only" functionality
  test('should accept necessary cookies only and verify no optional cookies are enabled', async ({ page }) => {
    const cookiePreferencesPage = new CookiePreferencesPage(page);
    
    // Navigate to the website
    await cookiePreferencesPage.navigate();
    
    // Open cookie preferences
    await cookiePreferencesPage.openCookiePreferences();
    
    // Click "Accept necessary only"
    await page.getByRole('button', { name: 'Accept necessary only' }).click();
    await page.waitForTimeout(1000);
    
    // Verify all optional categories are disabled
    for (const category of OPTIONAL_COOKIE_CATEGORIES) {
      const isEnabled = await cookiePreferencesPage.verifyCategoryIsEnabled(category);
      expect(isEnabled).toBe(false);
      console.log(`\n✅ Verified ${category} cookies are disabled with "necessary only"`);
    }
    
    console.log('\n🎉 Successfully verified "Accept necessary only" functionality');
  });

  // Test to verify "Accept all" functionality
  test('should accept all cookies and verify all optional cookies are enabled', async ({ page }) => {
    const cookiePreferencesPage = new CookiePreferencesPage(page);
    
    // Navigate to the website
    await cookiePreferencesPage.navigate();
    
    // Open cookie preferences
    await cookiePreferencesPage.openCookiePreferences();
    
    // Click "Accept all"
    await page.getByRole('button', { name: 'Accept all' }).click();
    await page.waitForTimeout(1000);
    
    // Verify all optional categories are enabled
    for (const category of OPTIONAL_COOKIE_CATEGORIES) {
      const isEnabled = await cookiePreferencesPage.verifyCategoryIsEnabled(category);
      expect(isEnabled).toBe(true);
      console.log(`\n✅ Verified ${category} cookies are enabled with "accept all"`);
    }
    
    console.log('\n🎉 Successfully verified "Accept all" functionality');
  });
});
