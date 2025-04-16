import { expect, test } from '@playwright/test';

test.describe('Usuários', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('Deve criar um novo usuário válido', async ({ page }) => {
    await page.locator('#create-user-button').click();
    await expect(page).toHaveURL('/users/new');

    await page.locator('#username-input').fill('Dr. João Silva');
    await page
      .locator('#email-input')
      .fill(`joao.silva${Date.now()}@gmail.com`);
    await page.locator('#password-input').fill('senhaSegura123');

    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes('/users') &&
          response.request().method() === 'POST'
      ),
      ,
      page.locator('#submit-button').click(),
    ]);

    await expect(page).toHaveURL('/users');
  });

  test('Deve filtrar usuários corretamente', async ({ page }) => {
    await page.locator('#user-search').fill('admin');

    await page.waitForResponse(
      (response) =>
        response.url().includes('/users') &&
        response.url().includes('search=admin') &&
        response.request().method() === 'GET'
    );

    await expect(page.locator('#no-users-message')).not.toBeVisible();
    await expect(page.locator('[id^="user-"]')).toHaveCount(1);
  });

  test('Deve validar formulário de usuário', async ({ page }) => {
    await page.locator('#create-user-button').click();

    await page.locator('#submit-button').click();

    await expect(
      page.locator('text=Por favor, preencha todos os campos obrigatórios.')
    ).toBeVisible();
  });

  test('Editar usuário sem alterar dados', async ({ page }) => {
    await page.waitForResponse(
      (response) =>
        response.url().includes('/users') &&
        response.request().method() === 'GET'
    );
    await page.locator('[id^="edit-user"]').first().click();

    await page.waitForResponse(
      (response) =>
        response.url().includes('/users') &&
        response.ok() &&
        response.request().method() === 'GET'
    );

    await page.locator('#submit-button').click();

    await expect(page).toHaveURL('/users');
  });
});
