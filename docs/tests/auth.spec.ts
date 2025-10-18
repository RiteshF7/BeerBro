import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access a protected route
    await page.goto('/profile');
    
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login or show login requirement
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(login|$)/);
  });

  test('should have login page accessible', async ({ page }) => {
    await page.goto('/login');
    
    await page.waitForLoadState('networkidle');
    
    // Check if login page loads
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
    
    // Should not be a 404 page
    const response = await page.goto('/login');
    expect(response?.status()).not.toBe(404);
  });

  test('should handle authentication state properly', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Check if Firebase is initialized (should see Firebase logs in console)
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('Firebase')) {
        logs.push(msg.text());
      }
    });
    
    // Wait a bit for Firebase to initialize
    await page.waitForTimeout(2000);
    
    // Should have Firebase initialization logs
    expect(logs.length).toBeGreaterThan(0);
  });
});
