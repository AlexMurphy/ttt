import { BrowserUtils } from './utils/browser.utils';
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.thethinkingtraveller.com/');
  await page.getByRole('button', { name: 'Accept all' }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.locator('form').filter({ hasText: /^Search Villas$/ }).getByLabel('button').click();
  BrowserUtils.handleDesktopSpecificFilterUI(this.page, this.platform);
  await page.locator('div').filter({ hasText: /^Add filters£ GBPSort by Recommended$/ }).getByRole('button').click();
  await page.getByRole('checkbox', { name: 'Italy' }).click();
  await page.getByRole('link', { name: 'Next page' }).click();
  await page.getByRole('link', { name: 'Next page' }).click();
  await page.getByRole('link', { name: 'Next page' }).click();
  await page.getByRole('link', { name: 'Next page' }).click();
  await expect(page.getByRole('main')).toContainText('Sicily');
});