import { Page, Locator } from '@playwright/test';

export class CookieConsentPage {
  private readonly page: Page;
  
  // Selectors
  private readonly customizeButton: Locator;
  private readonly savePreferencesButton: Locator;
  private readonly titleDiv: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.customizeButton = page.getByRole('button', { name: 'Customize' });
    this.savePreferencesButton = page.getByRole('button', { name: 'Save My Preferences' });
    this.titleDiv = page.locator('#titlediv');
  }

  async navigate(url: string = 'https://www.thethinkingtraveller.com/'): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openCustomizeModal(): Promise<void> {
    await this.customizeButton.click();
    // Wait for the customize modal to appear and stabilize
    await this.page.waitForTimeout(1000);
  }

  async handleDesktopSpecificInteractions(platform: string | undefined): Promise<void> {
    if (platform === 'desktop') {
      try {
        await this.titleDiv.hover({ timeout: 3000 });
        await this.titleDiv.getByRole('emphasis').click({ timeout: 3000 });
      } catch (error) {
        console.log('Desktop-specific elements not found or already handled, continuing...');
      }
    }
  }

  async savePreferences(): Promise<void> {
    await this.savePreferencesButton.click();
    // Wait for cookies to be set and stabilize
    await this.page.waitForTimeout(3000);
  }

  async getCookies(): Promise<any[]> {
    return await this.page.context().cookies();
  }

  async customizeCookieSelection(platform?: string): Promise<{ before: any[], after: any[] }> {
    const cookiesBefore = await this.getCookies();
    
    await this.openCustomizeModal();
    await this.handleDesktopSpecificInteractions(platform);
    await this.savePreferences();
    
    const cookiesAfter = await this.getCookies();
    
    return { before: cookiesBefore, after: cookiesAfter };
  }
}
