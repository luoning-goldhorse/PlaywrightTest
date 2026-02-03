import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://t-extramile.easyview.xyz/login');
  await page.getByRole('textbox', { name: 'Enter Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Username or Email' }).fill('lntest02');
  await page.getByRole('textbox', { name: 'Enter Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('Aa123456,');
  await page.locator('span').filter({ hasText: 'Login' }).first().click();
  await page.locator('.highlight-card').first().click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('cicc');
  await page.getByRole('listitem').click();
  await page.locator('span').filter({ hasText: '提交' }).first().click();
  await page.getByText('查看详情').click();
});