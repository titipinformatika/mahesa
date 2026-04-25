# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Login Flow >> should login successfully with correct credentials
- Location: e2e\login.spec.ts:20:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dasbor/
Received string:  "http://127.0.0.1:3001/masuk?"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    18 × unexpected value "http://127.0.0.1:3001/masuk?"

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
  3  | test.describe('Login Flow', () => {
  4  |   test('should redirect to /masuk if accessing /dasbor without session', async ({ page }) => {
  5  |     await page.goto('/dasbor');
  6  |     await expect(page).toHaveURL(/\/masuk/);
  7  |   });
  8  | 
  9  |   test('should show error on invalid credentials', async ({ page }) => {
  10 |     await page.goto('/masuk');
  11 |     await page.fill('#email', 'wrong@example.com');
  12 |     await page.fill('#password', 'wrongpassword');
  13 |     await page.click('button[type="submit"]');
  14 |     
  15 |     // Check for error message - wait for it to appear
  16 |     const errorMsg = page.locator('.p-3.text-sm.text-red-300');
  17 |     await expect(errorMsg).toBeVisible({ timeout: 10000 });
  18 |   });
  19 | 
  20 |   test('should login successfully with correct credentials', async ({ page }) => {
  21 |     const email = process.env.E2E_EMAIL || 'admin@mahesa.go.id';
  22 |     const password = process.env.E2E_PASSWORD || 'admin123';
  23 | 
  24 |     await page.goto('/masuk');
  25 |     await page.fill('#email', email);
  26 |     await page.fill('#password', password);
  27 |     await page.click('button[type="submit"]');
  28 | 
  29 |     // Wait for URL to change to /dasbor
> 30 |     await expect(page).toHaveURL(/\/dasbor/, { timeout: 15000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  31 |   });
  32 | });
  33 | 
```