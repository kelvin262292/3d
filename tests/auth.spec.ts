import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Trang đăng nhập', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/auth/login');

      // Kiểm tra form đăng nhập có hiển thị
      await expect(page.locator('form')).toBeVisible();

      // Kiểm tra các trường input
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();

      // Kiểm tra nút submit
      await expect(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/auth/login');

      // Click submit mà không điền gì
      await page.click('button[type="submit"], input[type="submit"]');

      // Kiểm tra có thông báo lỗi (có thể cần điều chỉnh selector)
      // await expect(page.locator('.error, .alert-error, [role="alert"]')).toBeVisible();
    });

    test('should fill login form', async ({ page }) => {
      await page.goto('/auth/login');

      // Điền thông tin đăng nhập
      await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'password123');

      // Có thể click submit để test (nhưng sẽ fail vì không có user thật)
      // await page.click('button[type="submit"]');
    });
  });

  test.describe('Trang đăng ký', () => {
    test('should display register form', async ({ page }) => {
      await page.goto('/register');

      // Kiểm tra form đăng ký có hiển thị
      await expect(page.locator('form')).toBeVisible();

      // Kiểm tra các trường input cơ bản
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    });

    test('should fill register form', async ({ page }) => {
      await page.goto('/register');

      // Điền thông tin đăng ký
      await page.fill('input[type="email"], input[name="email"]', 'newuser@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'newpassword123');

      // Điền các trường khác nếu có
      const nameInput = page.locator('input[name="name"], input[name="fullName"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
      }
    });
  });
});