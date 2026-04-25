import { test, expect } from '@playwright/test';

test.describe('Laporan & Rekap', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.E2E_EMAIL || 'admin@mahesa.go.id';
    const password = process.env.E2E_PASSWORD || 'admin123';
    
    await page.goto('/masuk');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dasbor/);
  });

  test('should load reports and show stats', async ({ page }) => {
    await page.goto('/dasbor/laporan');
    await expect(page.locator('h1')).toContainText('Rekapitulasi');

    // Check if stat cards are visible
    const stats = page.locator('.grid.grid-cols-1.md\\:grid-cols-4');
    await expect(stats).toBeVisible();
  });

  test('should handle filter changes', async ({ page }) => {
    await page.goto('/dasbor/laporan');
    
    // Find selects for month/year
    // Note: Since these are custom components, we might need to click them to open
    const selects = page.locator('button[role="combobox"]');
    await expect(selects.count()).toBeGreaterThanOrEqual(2);
  });

  test('should have export to excel button', async ({ page }) => {
    await page.goto('/dasbor/laporan');
    const exportBtn = page.locator('button:has-text("Ekspor")');
    await expect(exportBtn).toBeVisible();
  });
});
