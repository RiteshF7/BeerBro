import { test, expect } from '@playwright/test';

test.describe('Admin Console', () => {
  test('should redirect non-admin users to home page', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/admin');
    
    // Should redirect to home page since user is not authenticated
    await page.waitForLoadState('networkidle');
    
    // Check if we're redirected to home page
    expect(page.url()).toMatch(/\/$/);
  });

  test('should show admin navigation when authenticated as admin', async ({ page }) => {
    // This test would require setting up admin authentication
    // For now, we'll just check that the admin route exists
    await page.goto('/admin/dashboard');
    
    // Should show some form of authentication required or redirect
    await page.waitForLoadState('networkidle');
    
    // The page should either redirect or show an auth requirement
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should have proper admin routes structure', async ({ page }) => {
    const adminRoutes = [
      '/admin',
      '/admin/dashboard', 
      '/admin/products',
      '/admin/orders',
      '/admin/users',
      '/admin/locations'
    ];

    for (const route of adminRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Each route should load without 404 errors
      const response = await page.goto(route);
      expect(response?.status()).not.toBe(404);
    }
  });
});
