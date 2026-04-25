# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pegawai.spec.ts >> Pegawai Management >> should display employee list and allow searching
- Location: e2e\pegawai.spec.ts:16:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dasbor/
Received string:  "http://127.0.0.1:3001/masuk?"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://127.0.0.1:3001/masuk?"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: 🏛️ MAHESA
      - generic [ref=e6]: Manajemen Human-resource & Employee System
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: Email
        - textbox "Email" [ref=e11]:
          - /placeholder: admin@mahesa.go.id
      - generic [ref=e12]:
        - generic [ref=e13]: Kata Sandi
        - textbox "Kata Sandi" [ref=e14]:
          - /placeholder: ••••••••
      - button "Masuk" [ref=e15]
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Pegawai Management', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Mocking login for faster tests if needed, or just do a real login
  6  |     const email = process.env.E2E_EMAIL || 'admin@mahesa.go.id';
  7  |     const password = process.env.E2E_PASSWORD || 'admin123';
  8  |     
  9  |     await page.goto('/masuk');
  10 |     await page.fill('#email', email);
  11 |     await page.fill('#password', password);
  12 |     await page.click('button[type="submit"]');
> 13 |     await expect(page).toHaveURL(/\/dasbor/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  14 |   });
  15 | 
  16 |   test('should display employee list and allow searching', async ({ page }) => {
  17 |     await page.goto('/dasbor/pegawai');
  18 |     await expect(page.locator('h1')).toContainText('Daftar Pegawai');
  19 |     
  20 |     // Check if table exists
  21 |     const table = page.locator('table');
  22 |     await expect(table).toBeVisible();
  23 | 
  24 |     // Test Search
  25 |     const searchInput = page.locator('input[placeholder*="Cari"]');
  26 |     await searchInput.fill('Admin');
  27 |     // Wait for filter result (assuming it filters)
  28 |     await page.waitForTimeout(500); 
  29 |     
  30 |     const rows = table.locator('tbody tr');
  31 |     const count = await rows.count();
  32 |     expect(count).toBeGreaterThan(0);
  33 |   });
  34 | 
  35 |   test('should navigate to employee detail', async ({ page }) => {
  36 |     await page.goto('/dasbor/pegawai');
  37 |     
  38 |     // Click the first detail link/button in the table
  39 |     const detailBtn = page.locator('table tbody tr').first().locator('a[href*="/pegawai/"]');
  40 |     await detailBtn.click();
  41 |     
  42 |     await expect(page).toHaveURL(/\/pegawai\/[0-9a-f-]+/);
  43 |     await expect(page.locator('h1')).toContainText('Profil Pegawai');
  44 |   });
  45 | });
  46 | 
```