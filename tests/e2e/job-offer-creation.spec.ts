import { test, expect } from '@playwright/test'

test.describe('Job Offer Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard page before each test
    await page.goto('/dashboard')

    // Wait for the page to load completely
    await expect(page.locator('h1')).toContainText('CV Optimizer')
  })

  test('should display the job offer form correctly', async ({ page }) => {
    // Check that the main form elements are present
    await expect(page.getByRole('heading', { name: 'Analyser l\'offre d\'emploi' })).toBeVisible()

    // Check form fields are present
    await expect(page.getByLabel('Job Title')).toBeVisible()
    await expect(page.getByLabel('Company')).toBeVisible()
    await expect(page.getByLabel('Job Description')).toBeVisible()
    await expect(page.getByLabel('Location')).toBeVisible()
    await expect(page.getByLabel('Salary Range')).toBeVisible()

    // Check action buttons
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Analyze Job Offer' })).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Analyze Job Offer' }).click()

    // Form should not submit and button should be disabled
    await expect(page.getByRole('button', { name: 'Analyze Job Offer' })).toBeDisabled()
  })

  test('should show validation feedback for short description', async ({ page }) => {
    // Fill in minimum required fields but with short description
    await page.getByLabel('Job Title').fill('Frontend Developer')
    await page.getByLabel('Company').fill('Tech Corp')
    await page.getByLabel('Job Description').fill('Short description')

    // Wait a bit for the validation to trigger
    await page.waitForTimeout(500)

    // Submit button should still be disabled for short description
    await expect(page.getByRole('button', { name: 'Analyze Job Offer' })).toBeDisabled()
  })

  test('should enable submit button with valid data', async ({ page }) => {
    // Fill required fields step by step
    const titleInput = page.getByLabel('Job Title')
    await titleInput.click()
    await titleInput.fill('Senior Frontend Developer')

    const companyInput = page.getByLabel('Company')
    await companyInput.click()
    await companyInput.fill('Tech Innovations Inc.')

    const jobDescription = 'We are looking for a Senior Frontend Developer to join our team. Requirements include 5+ years of experience with React, Vue.js, or Angular, strong knowledge of JavaScript and TypeScript.'

    const descInput = page.getByLabel('Job Description')
    await descInput.click()
    await descInput.fill(jobDescription)

    // Wait for validation and check if button becomes enabled
    await expect(page.getByRole('button', { name: 'Analyze Job Offer' })).toBeEnabled({ timeout: 3000 })
  })

  test('should successfully submit job offer and proceed to next step', async ({ page }) => {
    // Fill form with complete valid data
    await page.getByLabel('Job Title').fill('Senior Frontend Developer')
    await page.getByLabel('Company').fill('Tech Innovations Inc.')

    const jobDescription = `We are looking for a Senior Frontend Developer to join our team.

Requirements:
- 5+ years of experience with React, Vue.js, or Angular
- Strong knowledge of JavaScript, TypeScript, HTML5, CSS3
- Experience with modern build tools (Webpack, Vite)
- Familiarity with state management (Redux, Pinia, Vuex)
- Understanding of responsive design and cross-browser compatibility

Responsibilities:
- Develop and maintain high-quality frontend applications
- Collaborate with designers and backend developers
- Write clean, maintainable, and well-documented code`

    await page.getByLabel('Job Description').fill(jobDescription)
    await page.getByLabel('Location').fill('Remote')
    await page.getByLabel('Salary Range').fill('$120,000 - $160,000')

    // Submit the form
    await page.getByRole('button', { name: 'Analyze Job Offer' }).click()

    // Should show success message
    await expect(page.locator('text=Offre d\'emploi analysée')).toBeVisible()

    // CV generation button should now be enabled
    await expect(page.getByRole('button', { name: 'Générer le CV adapté' })).toBeEnabled()
  })

  test('should clear form when clear button is clicked', async ({ page }) => {
    // Fill form with data
    await page.getByLabel('Job Title').fill('Test Job')
    await page.getByLabel('Company').fill('Test Company')
    await page.getByLabel('Job Description').fill('Test description that is long enough to pass validation requirements for the job description field')
    await page.getByLabel('Location').fill('Test Location')
    await page.getByLabel('Salary Range').fill('$50,000')

    // Click clear button
    await page.getByRole('button', { name: 'Clear' }).click()

    // All fields should be empty
    await expect(page.getByLabel('Job Title')).toHaveValue('')
    await expect(page.getByLabel('Company')).toHaveValue('')
    await expect(page.getByLabel('Job Description')).toHaveValue('')
    await expect(page.getByLabel('Location')).toHaveValue('')
    await expect(page.getByLabel('Salary Range')).toHaveValue('')

    // Submit button should be disabled again
    await expect(page.getByRole('button', { name: 'Analyze Job Offer' })).toBeDisabled()
  })

  test('should handle form validation errors gracefully', async ({ page }) => {
    // Fill form with invalid data
    await page.getByLabel('Job Title').fill('A') // Too short
    await page.getByLabel('Company').fill('B') // Too short
    await page.getByLabel('Job Description').fill('Short') // Too short

    // Try to submit
    await page.getByRole('button', { name: 'Analyze Job Offer' }).click()

    // Should show validation feedback
    await expect(page.locator('text=Input too short')).toBeVisible()
    await expect(page.locator('text=Description too short')).toBeVisible()

    // Form should not be submitted
    await expect(page.getByRole('button', { name: 'Analyze Job Offer' })).toBeDisabled()
  })

  test('should show loading state during submission', async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel('Job Title').fill('Frontend Developer')
    await page.getByLabel('Company').fill('Tech Corp Inc.')
    await page.getByLabel('Job Description').fill('We are seeking a talented frontend developer to join our growing team. The ideal candidate should have strong experience with modern JavaScript frameworks and be passionate about creating exceptional user experiences.')

    // Submit the form
    await page.getByRole('button', { name: 'Analyze Job Offer' }).click()

    // Should show loading state briefly
    await expect(page.getByRole('button', { name: 'Analyze Job Offer' })).toHaveAttribute('aria-busy', 'true')

    // Wait for submission to complete
    await expect(page.locator('text=Job offer submitted!')).toBeVisible()
  })
})