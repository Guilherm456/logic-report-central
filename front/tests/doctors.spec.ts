import { expect, test } from '@playwright/test';

test.describe('Gestão de Médicos', () => {
  let dynamicCouncilNumber = Math.floor(Math.random() * 1000000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/doctors');
  });

  test('Deve criar médico com dados válidos', async ({ page }) => {
    await page.locator('#create-doctor-button').click();

    await page.locator('#name-input').fill(`Dr. Silva ${Date.now()}`);
    await page
      .locator('#council-number-input')
      .fill(dynamicCouncilNumber.toString());

    await page.locator('#council-autocomplete').click();
    await page.waitForResponse(
      (res) => res.url().includes('/council') && res.ok()
    );
    await page
      .getByRole('option', {
        name: 'Conselho Regional de Medicina',
        exact: true,
      })
      .click();

    await page.locator('#state-autocomplete').click();
    await page.getByRole('option', { name: 'Paraná' }).click();

    await page.locator('#user-autocomplete').click();
    await page.waitForResponse(
      (res) => res.url().includes('/users') && res.ok()
    );
    await page
      .getByRole('option', { name: /^(?!.*admin).*$/ })
      .first()
      .click();

    await page.locator('#doctor-type-autocomplete').click();
    await page.getByRole('option', { name: 'Executante' }).click();

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/doctors') &&
          res.ok() &&
          res.request().method() === 'POST'
      ),
      page.locator('#submit-button').click(),
    ]);

    await expect(page).toHaveURL('/doctors');
  });

  test('Deve impedir duplicidade de conselho médico', async ({ page }) => {
    await page.locator('#create-doctor-button').click();

    await page.locator('#name-input').fill(`Dr. Silva ${Date.now()}`);
    await page
      .locator('#council-number-input')
      .fill(dynamicCouncilNumber.toString());

    await page.locator('#council-autocomplete').click();
    await page.waitForResponse(
      (res) => res.url().includes('/council') && res.ok()
    );
    await page
      .getByRole('option', {
        name: 'Conselho Regional de Medicina',
        exact: true,
      })
      .click();

    await page.locator('#state-autocomplete').click();
    await page.getByRole('option', { name: 'Paraná' }).click();

    await page.locator('#user-autocomplete').click();
    await page.waitForResponse(
      (res) => res.url().includes('/users') && res.ok()
    );
    await page
      .getByRole('option', { name: /^(?!.*admin).*$/ })
      .first()
      .click();

    await page.locator('#doctor-type-autocomplete').click();
    await page.getByRole('option', { name: 'Executante' }).click();

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/doctors') && res.request().method() === 'POST'
      ),
      page.locator('#submit-button').click(),
    ]);

    await expect(page).toHaveURL('/doctors/new');

    await expect(
      page.locator('text=Conselho já cadastrado para esse estado')
    ).toBeVisible();
  });

  test('Deve filtrar por tipo de médico', async ({ page }) => {
    await page.locator('#search-input').fill('Silva');

    await page.waitForResponse(
      (res) =>
        res.url().includes('/doctors') &&
        res.url().includes('search=Silva') &&
        res.ok()
    );

    const doctors = await page.locator('[id^="doctor-card-"]').count();
    expect(doctors).toBeGreaterThan(0);
  });

  test('Deve validar campos obrigatórios', async ({ page }) => {
    await page.locator('#create-doctor-button').click();
    await page.locator('#submit-button').click();

    await expect(
      page.locator('text=Por favor, preencha todos os campos obrigatórios.')
    ).toBeVisible();
  });

  test('Deve editar médico sem alterar dados', async ({ page }) => {
    await page.waitForResponse(
      (res) => res.url().includes('/doctors') && res.ok()
    );
    await page.locator('[id^="edit-doctor"]').first().click();

    await page.waitForResponse(
      (res) => res.url().includes('/doctors') && res.ok()
    );

    await page.locator('#submit-button').click();

    await expect(page).toHaveURL('/doctors');
  });
});
