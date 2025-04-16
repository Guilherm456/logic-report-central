import { test as setup } from '@playwright/test';

setup('Login', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email-input').fill('admin@example.com');
  await page.locator('#password-input').fill('admin123');

  await page.locator('#submit-button').click();

  await page.waitForURL('/users');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
