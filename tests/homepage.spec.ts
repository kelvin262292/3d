import { test, expect } from '@playwright/test';

test.describe('Trang chủ', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Điều hướng đến trang chủ
    await page.goto('/');

    // Kiểm tra title của trang
    await expect(page).toHaveTitle(/3D/);

    // Kiểm tra header có hiển thị
    await expect(page.locator('header')).toBeVisible();

    // Kiểm tra footer có hiển thị
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    // Click vào link đăng nhập (có thể cần điều chỉnh selector)
    await page.click('text=Đăng nhập');

    // Kiểm tra đã chuyển đến trang đăng nhập
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');

    // Click vào link đăng ký (có thể cần điều chỉnh selector)
    await page.click('text=Đăng ký');

    // Kiểm tra đã chuyển đến trang đăng ký
    await expect(page).toHaveURL(/.*register/);
  });
});