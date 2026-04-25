import { test, expect } from '@playwright/test';

test.describe('Pegawai Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mocking login for faster tests if needed, or just do a real login
    const email = process.env.E2E_EMAIL || 'admin@mahesa.go.id';
    const password = process.env.E2E_PASSWORD || 'admin123';
    
    await page.goto('/masuk');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dasbor/);
  });

  test('should display employee list and allow searching', async ({ page }) => {
    await page.goto('/dasbor/pegawai');
    await expect(page.locator('h1')).toContainText('Daftar Pegawai');
    
    // Check if table exists
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Test Search
    const searchInput = page.locator('input[placeholder*="Cari"]');
    await searchInput.fill('Admin');
    // Wait for filter result (assuming it filters)
    await page.waitForTimeout(500); 
    
    const rows = table.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to employee detail', async ({ page }) => {
    await page.goto('/dasbor/pegawai');
    
    // Click the first detail link/button in the table
    const detailBtn = page.locator('table tbody tr').first().locator('a[href*="/pegawai/"]');
    await detailBtn.click();
    
    await expect(page).toHaveURL(/\/pegawai\/[0-9a-f-]+/);
    await expect(page.locator('h1')).toContainText('Profil Pegawai');
  });
});
