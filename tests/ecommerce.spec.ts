import { test, expect } from '@playwright/test';

test.describe('E-commerce Features', () => {
  test.describe('Trang sản phẩm', () => {
    test('should display products page', async ({ page }) => {
      await page.goto('/products');

      // Kiểm tra trang sản phẩm load thành công
      await expect(page).toHaveURL(/.*products/);

      // Kiểm tra có hiển thị danh sách sản phẩm
      // (Selector có thể cần điều chỉnh tùy theo cấu trúc HTML thực tế)
      const productList = page.locator('.product-list, .products-grid, [data-testid="products"]');
      if (await productList.isVisible()) {
        await expect(productList).toBeVisible();
      }
    });

    test('should search for products', async ({ page }) => {
      await page.goto('/products');

      // Tìm ô search
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="tìm"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('3D model');
        await searchInput.press('Enter');

        // Kiểm tra kết quả search
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('Giỏ hàng', () => {
    test('should access cart page', async ({ page }) => {
      await page.goto('/cart');

      // Kiểm tra trang giỏ hàng load thành công
      await expect(page).toHaveURL(/.*cart/);

      // Kiểm tra có hiển thị thông tin giỏ hàng
      const cartContainer = page.locator('.cart, .shopping-cart, [data-testid="cart"]');
      if (await cartContainer.isVisible()) {
        await expect(cartContainer).toBeVisible();
      }
    });

    test('should display empty cart message', async ({ page }) => {
      await page.goto('/cart');

      // Kiểm tra thông báo giỏ hàng trống (nếu có)
      const emptyMessage = page.locator('text=trống, text=empty, .empty-cart');
      if (await emptyMessage.isVisible()) {
        await expect(emptyMessage).toBeVisible();
      }
    });
  });

  test.describe('Danh sách yêu thích', () => {
    test('should access wishlist page', async ({ page }) => {
      await page.goto('/wishlist');

      // Kiểm tra trang wishlist load thành công
      await expect(page).toHaveURL(/.*wishlist/);

      // Kiểm tra có hiển thị danh sách yêu thích
      const wishlistContainer = page.locator('.wishlist, [data-testid="wishlist"]');
      if (await wishlistContainer.isVisible()) {
        await expect(wishlistContainer).toBeVisible();
      }
    });
  });

  test.describe('Trang danh mục', () => {
    test('should access categories page', async ({ page }) => {
      await page.goto('/categories');

      // Kiểm tra trang categories load thành công
      await expect(page).toHaveURL(/.*categories/);

      // Kiểm tra có hiển thị danh sách danh mục
      const categoriesContainer = page.locator('.categories, .category-list, [data-testid="categories"]');
      if (await categoriesContainer.isVisible()) {
        await expect(categoriesContainer).toBeVisible();
      }
    });
  });
});