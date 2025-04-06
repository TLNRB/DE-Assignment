import { test, expect } from '@playwright/test';

const user = {
   name: 'E2E User',
   email: 'e2e_email@email.com',
   password: '123456'
}

export function userResgister() {
   test('User can register', async ({ page }) => {
      test.setTimeout(20000); // Set timeout to 20 seconds

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
      test.setTimeout(10000); // Set timeout to 10 seconds

      // Go to login page and fill in the form
      await page.goto('/login');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/admin');
   })
}