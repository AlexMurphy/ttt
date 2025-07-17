import { Page } from '@playwright/test';

export class BrowserUtils {
  
  static async handleDesktopSpecificUI(page: Page, platform: string | undefined): Promise<void> {
    if (platform === 'desktop') {
      try {
        await page.locator('#titlediv').hover({ timeout: 3000 });
        await page.locator('#titlediv').getByRole('emphasis').click({ timeout: 3000 });
      } catch (error) {
        console.log('Desktop-specific elements not found or already handled, continuing...');
      }
    }
  }

  static async handleBrowserSpecificWaits(page: Page, projectName: string): Promise<void> {
    if (projectName === 'Microsoft Edge') {
      console.log('Microsoft Edge detected - adding extra wait time for tracking cookies...');
      await page.waitForTimeout(2000);
    }
  }

  static async waitForNetworkIdle(page: Page, timeout: number = 5000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout }).catch(() => {
      console.log('Network did not reach idle state, continuing...');
    });
  }
}
