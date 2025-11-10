import { test, expect } from '@playwright/test'

test.describe('Playwright Setup Verification', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    // Verify the page loads successfully
    await expect(page).toHaveTitle(/CV Optimizer/)

    // Check if the page content is loaded
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have correct viewport', async ({ page }) => {
    await page.goto('/')

    const viewport = page.viewportSize()
    expect(viewport).toBeTruthy()
    expect(viewport?.width).toBeGreaterThan(0)
    expect(viewport?.height).toBeGreaterThan(0)
  })
})