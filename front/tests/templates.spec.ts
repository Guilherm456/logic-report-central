import { expect, test } from '@playwright/test';

test.describe('Gestão de Templates', () => {
  let dynamicDescription: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/templates');
    dynamicDescription = `Template teste ${Date.now()}`;
  });

  test('Deve criar template vinculado a médico', async ({ page }) => {
    await page.locator('#create-template-button').click();

    await page.locator('#description-input').fill(dynamicDescription);
    await page
      .locator('#content-input')
      .fill('<p>Conteúdo HTML do template</p>');

    await page.locator('#doctor-autocomplete').click();
    await page.waitForResponse(
      (res) => res.url().includes('/doctors') && res.status() === 200
    );
    await page.getByRole('option').first().click();

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/templates') &&
          res.ok() &&
          res.request().method() === 'POST'
      ),
      page.locator('#submit-button').click(),
    ]);

    await expect(page).toHaveURL('/templates');
  });

  test('Deve validar campos obrigatórios', async ({ page }) => {
    await page.locator('#create-template-button').click();

    await page.locator('#submit-button').click();

    await expect(
      page.locator('text=Por favor, preencha todos os campos obrigatórios.')
    ).toBeVisible();
  });
});
