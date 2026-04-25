# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Login Flow >> should redirect to /masuk if accessing /dasbor without session
- Location: e2e\login.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/masuk/
Received string:  "http://127.0.0.1:3001/dasbor"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://127.0.0.1:3001/dasbor"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - heading "Panel Kontrol" [level=2] [ref=e6]
      - generic [ref=e7]:
        - button "Toggle theme" [ref=e8]:
          - img
          - generic [ref=e9]: Toggle theme
        - button [ref=e10]:
          - generic [ref=e12]:
            - img
    - main [ref=e13]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]:
            - heading "Dasbor Analitik" [level=1] [ref=e18]
            - paragraph [ref=e19]: Pantau kesehatan organisasi dan kehadiran pegawai secara real-time.
          - generic [ref=e20]:
            - generic [ref=e21]: Memuat...
            - button "Keluar" [ref=e22]:
              - img
              - text: Keluar
        - generic [ref=e28]:
          - generic [ref=e31]:
            - generic [ref=e32]:
              - img [ref=e33]
              - text: Tren Kehadiran Mingguan
            - generic [ref=e36]:
              - generic [ref=e37]: Hadir
              - generic [ref=e39]: Cuti
              - generic [ref=e41]: DL
          - generic [ref=e45]:
            - generic [ref=e47]:
              - img [ref=e48]
              - text: Aktivitas Terbaru
            - generic [ref=e51]:
              - generic [ref=e52]:
                - generic [ref=e53]: "1"
                - generic [ref=e54]:
                  - paragraph [ref=e55]: Pegawai 1 melakukan presensi
                  - paragraph [ref=e56]: 08:5 WIB • Unit Kerja A
              - generic [ref=e57]:
                - generic [ref=e58]: "2"
                - generic [ref=e59]:
                  - paragraph [ref=e60]: Pegawai 2 melakukan presensi
                  - paragraph [ref=e61]: 08:10 WIB • Unit Kerja B
              - generic [ref=e62]:
                - generic [ref=e63]: "3"
                - generic [ref=e64]:
                  - paragraph [ref=e65]: Pegawai 3 melakukan presensi
                  - paragraph [ref=e66]: 08:15 WIB • Unit Kerja C
              - generic [ref=e67]:
                - generic [ref=e68]: "4"
                - generic [ref=e69]:
                  - paragraph [ref=e70]: Pegawai 4 melakukan presensi
                  - paragraph [ref=e71]: 08:20 WIB • Unit Kerja D
              - generic [ref=e72]:
                - generic [ref=e73]: "5"
                - generic [ref=e74]:
                  - paragraph [ref=e75]: Pegawai 5 melakukan presensi
                  - paragraph [ref=e76]: 08:25 WIB • Unit Kerja E
              - button "Lihat Semua Aktivitas" [ref=e77]
        - generic [ref=e78]:
          - generic [ref=e80]:
            - img [ref=e81]
            - text: Perbandingan Performa Unit Kerja
          - table [ref=e86]:
            - rowgroup [ref=e87]:
              - row "Nama Unit Tingkat Kehadiran Status Aksi" [ref=e88]:
                - columnheader "Nama Unit" [ref=e89]
                - columnheader "Tingkat Kehadiran" [ref=e90]
                - columnheader "Status" [ref=e91]
                - columnheader "Aksi" [ref=e92]
            - rowgroup [ref=e93]:
              - row "Kantor Dinas 98% Normal Detail" [ref=e94]:
                - cell "Kantor Dinas" [ref=e95]
                - cell "98%" [ref=e96]:
                  - generic [ref=e100]: 98%
                - cell "Normal" [ref=e101]
                - cell "Detail" [ref=e102]:
                  - button "Detail" [ref=e103]
              - row "UPT Soreang 95% Normal Detail" [ref=e104]:
                - cell "UPT Soreang" [ref=e105]
                - cell "95%" [ref=e106]:
                  - generic [ref=e110]: 95%
                - cell "Normal" [ref=e111]
                - cell "Detail" [ref=e112]:
                  - button "Detail" [ref=e113]
              - row "SDN 01 Soreang 88% Perhatian Detail" [ref=e114]:
                - cell "SDN 01 Soreang" [ref=e115]
                - cell "88%" [ref=e116]:
                  - generic [ref=e120]: 88%
                - cell "Perhatian" [ref=e121]
                - cell "Detail" [ref=e122]:
                  - button "Detail" [ref=e123]
              - row "SMPN 01 Soreang 92% Normal Detail" [ref=e124]:
                - cell "SMPN 01 Soreang" [ref=e125]
                - cell "92%" [ref=e126]:
                  - generic [ref=e130]: 92%
                - cell "Normal" [ref=e131]
                - cell "Detail" [ref=e132]:
                  - button "Detail" [ref=e133]
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Login Flow', () => {
  4  |   test('should redirect to /masuk if accessing /dasbor without session', async ({ page }) => {
  5  |     await page.goto('/dasbor');
> 6  |     await expect(page).toHaveURL(/\/masuk/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  30 |     await expect(page).toHaveURL(/\/dasbor/, { timeout: 15000 });
  31 |   });
  32 | });
  33 | 
```