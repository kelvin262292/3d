import { test, expect } from '@playwright/test';

test.describe('Homepage Hero Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display hero slider with navigation', async ({ page }) => {
    // Kiểm tra slider container
    const slider = await page.locator('.swiper');
    await expect(slider).toBeVisible();

    // Kiểm tra navigation buttons
    const prevButton = await page.locator('.swiper-button-prev');
    const nextButton = await page.locator('.swiper-button-next');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Kiểm tra pagination dots
    const pagination = await page.locator('.swiper-pagination');
    await expect(pagination).toBeVisible();
  });

  test('should navigate through slides', async ({ page }) => {
    // Lấy slide đầu tiên
    const firstSlide = await page.locator('.swiper-slide-active');
    const firstSlideTitle = await firstSlide.locator('h2').textContent();

    // Click next button
    await page.click('.swiper-button-next');
    await page.waitForTimeout(500); // Đợi animation

    // Kiểm tra slide đã thay đổi
    const secondSlide = await page.locator('.swiper-slide-active');
    const secondSlideTitle = await secondSlide.locator('h2').textContent();
    expect(secondSlideTitle).not.toBe(firstSlideTitle);

    // Click prev button
    await page.click('.swiper-button-prev');
    await page.waitForTimeout(500);

    // Kiểm tra đã quay lại slide đầu
    const currentSlide = await page.locator('.swiper-slide-active');
    const currentSlideTitle = await currentSlide.locator('h2').textContent();
    expect(currentSlideTitle).toBe(firstSlideTitle);
  });

  test('should autoplay slides', async ({ page }) => {
    // Lấy slide đầu tiên
    const firstSlide = await page.locator('.swiper-slide-active');
    const firstSlideTitle = await firstSlide.locator('h2').textContent();

    // Đợi autoplay (5 giây + buffer)
    await page.waitForTimeout(5500);

    // Kiểm tra slide đã tự động chuyển
    const currentSlide = await page.locator('.swiper-slide-active');
    const currentSlideTitle = await currentSlide.locator('h2').textContent();
    expect(currentSlideTitle).not.toBe(firstSlideTitle);
  });

  test('should display correct slide content', async ({ page }) => {
    // Kiểm tra cấu trúc của mỗi slide
    const slides = await page.locator('.swiper-slide').all();
    expect(slides.length).toBeGreaterThan(0);

    for (const slide of slides) {
      // Kiểm tra hình ảnh
      const image = await slide.locator('img');
      await expect(image).toBeVisible();

      // Kiểm tra tiêu đề
      const title = await slide.locator('h2');
      await expect(title).toBeVisible();
      expect(await title.textContent()).toBeTruthy();

      // Kiểm tra phụ đề
      const subtitle = await slide.locator('p');
      await expect(subtitle).toBeVisible();
      expect(await subtitle.textContent()).toBeTruthy();
    }
  });
}); 