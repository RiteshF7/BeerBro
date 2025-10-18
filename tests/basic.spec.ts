import { test, expect } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test('should load homepage and show loading state', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title contains BeerBro
    await expect(page).toHaveTitle(/BeerBro/);
    
    // Check if the page has content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should handle admin route redirect', async ({ page }) => {
    // Try to access admin dashboard
    await page.goto('/admin');
    
    // Wait for any redirects
    await page.waitForLoadState('networkidle');
    
    // Should redirect to home page since user is not authenticated
    expect(page.url()).toMatch(/\/$/);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Discover the finest selection/);
  });
});
