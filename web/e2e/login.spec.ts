import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should redirect to /masuk if accessing /dasbor without session', async ({ page }) => {
    await page.goto('/dasbor');
    await expect(page).toHaveURL(/\/masuk/);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/masuk');
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Check for error message - wait for it to appear
    const errorMsg = page.locator('.p-3.text-sm.text-red-300');
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
  });

  test('should login successfully with correct credentials', async ({ page }) => {
    const email = process.env.E2E_EMAIL || 'admin@mahesa.go.id';
    const password = process.env.E2E_PASSWORD || 'admin123';

    await page.goto('/masuk');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    // Wait for URL to change to /dasbor
    await expect(page).toHaveURL(/\/dasbor/, { timeout: 15000 });
  });
});
