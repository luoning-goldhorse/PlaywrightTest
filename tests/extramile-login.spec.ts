import { test, expect } from '@playwright/test';

/** 与 tests/testcase 描述一致（英文界面下对应「重点交易」的标题为 Highlight Transactions） */
const LOGIN_URL = 'https://t-extramile.easyview.xyz/login';
const USERNAME = 'lntest02';
const PASSWORD = 'Aa123456,';

/** 设为 `0` 时仅校验模块展示，不强制要求有成交数据（默认与 testcase 一致：必须有数据） */
const REQUIRE_HIGHLIGHT_DATA = process.env.EXTRAMILE_REQUIRE_HIGHLIGHT_DATA !== '0';

test.describe('登录', () => {
  test('登录成功且首页重点交易模块有数据', async ({ page }) => {
    await page.goto(LOGIN_URL);

    await page.getByRole('textbox', { name: 'Enter Username or Email' }).fill(USERNAME);
    await page.getByRole('textbox', { name: 'Enter Password' }).fill(PASSWORD);
    await page.locator('span').filter({ hasText: 'Login' }).first().click();

    await expect(page).not.toHaveURL(/\/login\/?(\?.*)?$/, { timeout: 30_000 });
    await expect(page.getByText('lntest02').first()).toBeVisible({ timeout: 15_000 });

    const keyTradesHeading = page.getByRole('heading', {
      name: /Highlight Transactions|重点交易/,
    });
    await expect(keyTradesHeading.first()).toBeVisible({ timeout: 20_000 });

    const moduleRoot = keyTradesHeading.first().locator('..').locator('..');

    if (REQUIRE_HIGHLIGHT_DATA) {
      await expect(
        moduleRoot.getByText('No Data', { exact: true }),
        '首页重点交易 / Highlight Transactions 不应为空（当前环境可能无 72h 内成交）',
      ).toHaveCount(0);

      const rowCount = await moduleRoot
        .locator('tbody > tr, .ant-table-tbody > tr, [role="row"]')
        .count();
      const listCount = await moduleRoot.locator('[class*="list-item"], li').count();
      expect(
        rowCount > 0 || listCount > 0,
        '重点交易模块内应存在列表或表格数据',
      ).toBeTruthy();
    } else {
      await expect(moduleRoot).toBeVisible();
    }
  });
});
