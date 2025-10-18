import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/BeerBro/);
    
    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText(/BeerBro|Premium Beverage/i);
  });

  test('should display loading state initially', async ({ page }) => {
    await page.goto('/');
    
    // Check if loading spinner is visible initially
    const loadingSpinner = page.locator('.animate-spin');
    await expect(loadingSpinner).toBeVisible();
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Discover the finest selection/);
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });
});
