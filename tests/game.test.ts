import { test, expect } from '@playwright/test';

export function gameCreate() {
   test.setTimeout(20000); // Set timeout to 20 seconds

   test('Game can be created', async ({ page }) => {
      // Login the user
      await page.goto('/login');
      await page.fill('input[name="email"]', 'e2e_email@email.com');
      await page.fill('input[name="password"]', '123456');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/admin');

      // Add a new game
      await page.locator('#addGame').click();

      await page.fill('input[name="title"]', 'E2E Game');
      await page.fill('textarea[name="description"]', 'E2E Game Description');
      await page.fill('input[name="price"]', '59.99');
      await page.fill('input[name="rating"]', '4.6');
      await page.click('input[name="platform_pc"]');
      await page.click('input[name="platform_ps"]');
      await page.fill('input[name="genre"]', 'E2E Genre');
      await page.fill('input[name="release_date"]', '2023-05-16');

      await page.click('button[type="submit"]');

      await expect(page.locator('.card').last().locator('.card-title')).toContainText('E2E Game');
   })
}

export async function gameEdit() {
   test.setTimeout(20000); // Set timeout to 20 seconds

   test('Game can be edited', async ({ page }) => {
      // Login the user
      await page.goto('/login');
      await page.fill('input[name="email"]', 'e2e_email@email.com');
      await page.fill('input[name="password"]', '123456');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/admin');

      // Edit a game
      await page.locator('.card').last().locator('.card-actions .btn', { hasText: 'Edit' }).click();

      await page.fill('input[name="titleUpdate"]', 'E2E Game Updated');
      await page.click('button[name="submitUpdate"]');

      await expect(page.locator('.card').last().locator('.card-title')).toContainText('E2E Game Updated');
   })
}

export function gameDelete() {
   test.setTimeout(20000); // Set timeout to 20 seconds

   test('Game can be deleted', async ({ page }) => {
      // Login the user
      await page.goto('/login');
      await page.fill('input[name="email"]', 'e2e_email@email.com');
      await page.fill('input[name="password"]', '123456');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/admin');

      // Delete a game
      await page.locator('.card').last().locator('.card-actions .btn', { hasText: 'Delete' }).click();

      await page.locator('.modal-action .btn', { hasText: 'Delete' }).click();

      await expect(page.locator('.card').last().locator('.card-title')).not.toContainText('E2E Game Updated');
   })
}

export function filterGamesByTitle() {
   test.setTimeout(20000); // Set timeout to 20 seconds

   test('Games can be filtered by title', async ({ page }) => {
      await page.goto('/');

      await page.locator('#filter-title').click();
      await page.fill('input[name="search"]', 'the last');
      await expect(page.locator('.card').first().locator('.card-title')).toContainText('The Last of Us');
   })
}

export function filterGamesByPlatform() {
   test.setTimeout(20000); // Set timeout to 20 seconds

   test('Games can be filtered by platform', async ({ page }) => {
      await page.goto('/');

      await page.locator('#filter-platform').click();
      await page.locator('#platform-select').selectOption({ value: 'PlayStation' });
      await expect(page.locator('.card').first().locator('.platform')).toContainText('PlayStation');
   })
}

export function filterGamesByGenre() {
   test.setTimeout(20000); // Set timeout to 20 seconds

   test('Games can be filtered by genre', async ({ page }) => {
      await page.goto('/');

      await page.locator('#filter-genre').click();
      await page.locator('#genre-select').selectOption({ value: 'RPG' });
      await expect(page.locator('.card').first().locator('.genre')).toContainText('RPG');
   })
}