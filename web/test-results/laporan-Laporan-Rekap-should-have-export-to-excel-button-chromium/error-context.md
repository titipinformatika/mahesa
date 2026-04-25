# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: laporan.spec.ts >> Laporan & Rekap >> should have export to excel button
- Location: e2e\laporan.spec.ts:33:7

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
  3  | test.describe('Laporan & Rekap', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     const email = process.env.E2E_EMAIL || 'admin@mahesa.go.id';
  6  |     const password = process.env.E2E_PASSWORD || 'admin123';
  7  |     
  8  |     await page.goto('/masuk');
  9  |     await page.fill('#email', email);
  10 |     await page.fill('#password', password);
  11 |     await page.click('button[type="submit"]');
> 12 |     await expect(page).toHaveURL(/\/dasbor/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  13 |   });
  14 | 
  15 |   test('should load reports and show stats', async ({ page }) => {
  16 |     await page.goto('/dasbor/laporan');
  17 |     await expect(page.locator('h1')).toContainText('Rekapitulasi');
  18 | 
  19 |     // Check if stat cards are visible
  20 |     const stats = page.locator('.grid.grid-cols-1.md\\:grid-cols-4');
  21 |     await expect(stats).toBeVisible();
  22 |   });
  23 | 
  24 |   test('should handle filter changes', async ({ page }) => {
  25 |     await page.goto('/dasbor/laporan');
  26 |     
  27 |     // Find selects for month/year
  28 |     // Note: Since these are custom components, we might need to click them to open
  29 |     const selects = page.locator('button[role="combobox"]');
  30 |     await expect(selects.count()).toBeGreaterThanOrEqual(2);
  31 |   });
  32 | 
  33 |   test('should have export to excel button', async ({ page }) => {
  34 |     await page.goto('/dasbor/laporan');
  35 |     const exportBtn = page.locator('button:has-text("Ekspor")');
  36 |     await expect(exportBtn).toBeVisible();
  37 |   });
  38 | });
  39 | 
```