import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between public pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test navigation to different pages
    const publicRoutes = [
      '/',
      '/cart',
      '/checkout'
    ];

    for (const route of publicRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Each route should load successfully
      const response = await page.goto(route);
      expect(response?.status()).not.toBe(404);
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 page or redirect
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should have proper page titles', async ({ page }) => {
    const routes = [
      { path: '/', expectedTitle: /BeerBro/ },
      { path: '/cart', expectedTitle: /Cart|BeerBro/ },
      { path: '/checkout', expectedTitle: /Checkout|BeerBro/ },
      { path: '/login', expectedTitle: /Login|BeerBro/ }
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveTitle(route.expectedTitle);
    }
  });
});
