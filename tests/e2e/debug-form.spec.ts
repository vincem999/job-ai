import { test, expect } from '@playwright/test'

test.describe('Debug Form Validation', () => {
  test('debug form field values and validation', async ({ page }) => {
    await page.goto('/dashboard')

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('CV Optimizer')

    // Fill the form
    await page.getByLabel('Job Title').fill('Senior Frontend Developer')
    await page.getByLabel('Company').fill('Tech Innovations Inc.')

    const jobDescription = 'We are looking for a Senior Frontend Developer to join our team. Requirements include 5+ years of experience with React, Vue.js, or Angular, strong knowledge of JavaScript and TypeScript.'

    await page.getByLabel('Job Description').fill(jobDescription)

    // Wait for reactive validation
    await page.waitForTimeout(1000)

    // Debug: Check actual field values
    const titleValue = await page.getByLabel('Job Title').inputValue()
    const companyValue = await page.getByLabel('Company').inputValue()
    const descriptionValue = await page.getByLabel('Job Description').inputValue()

    console.log('Title:', titleValue, 'Length:', titleValue.length)
    console.log('Company:', companyValue, 'Length:', companyValue.length)
    console.log('Description:', descriptionValue, 'Length:', descriptionValue.length)

    // Check if button is enabled
    const button = page.getByRole('button', { name: 'Analyze Job Offer' })
    const isDisabled = await button.getAttribute('disabled')
    console.log('Button disabled:', isDisabled)

    // Let's try without the length expectation
    console.log('Expected validation: title >= 2, company >= 2, description >= 50')
    console.log('Actual:',
      'title =', titleValue.length >= 2,
      'company =', companyValue.length >= 2,
      'description =', descriptionValue.length >= 50
    )
  })
})