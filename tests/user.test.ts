import { test, expect } from '@playwright/test';

const user = {
   name: 'E2E User',
   email: 'e2e_email@email.com',
   password: '123456'
}

export function userResgister() {
   test.setTimeout(20000); // Set timeout to 20 seconds

   test('User can register', async ({ page }) => {
      // Go to register page and fill in the form
      await page.goto('/register');

      await page.fill('input[name="name"]', user.name);
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/login');
   })
}

export function userLogin() {
   test('User can login', async ({ page }) => {
      // Go to login page and fill in the form
      await page.goto('/login');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/admin');
   })
}

export function userLogout() {
   test('User can be logged out', async ({ page }) => {
      // Login the user
      await page.goto('/login');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/admin');

      // Logout the user
      await page.getByRole('button', { name: 'logout' }).click();

      await expect(page).toHaveURL('/');
   })
}