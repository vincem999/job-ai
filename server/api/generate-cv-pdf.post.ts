import { defineEventHandler, readBody, setHeader } from "h3"
import puppeteer from "puppeteer"

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    })
  }

  try {
    const { html } = await readBody(event)

    if (!html || typeof html !== "string") {
      throw createError({
        statusCode: 400,
        statusMessage: "HTML content is required",
      })
    }

    console.log("📥 Received HTML size:", new Blob([html]).size, "bytes")

    // Convert relative paths to absolute URLs for Puppeteer
    const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const htmlWithAbsolutePaths = html.replace(
      /src="\/([^"]+)"/g,
      `src="${baseUrl}/$1"`
    )

    console.log("🔗 Converting relative paths to absolute URLs with base:", baseUrl)

    let browser
    try {
      // Launch Puppeteer browser
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      })

      const page = await browser.newPage()

      // Set A4 viewport with proper scaling for PDF
      await page.setViewport({
        width: 794, // A4 width at 96 DPI
        height: 1123, // A4 height at 96 DPI
        deviceScaleFactor: 2,
      })

      // Set content and wait for complete loading
      await page.setContent(htmlWithAbsolutePaths, {
        waitUntil: ["networkidle0", "domcontentloaded"],
        timeout: 30000,
      })

      // Wait for fonts to load
      await page.evaluate(() => document.fonts.ready)

      // Small delay to ensure complete rendering
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate PDF with optimized settings
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        margin: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        timeout: 30000,
        scale: 1,
      })

      console.log("✅ PDF generated successfully")

      // Set response headers
      setHeader(event, "Content-Type", "application/pdf")
      setHeader(event, "Content-Disposition", 'attachment; filename="cv.pdf"')

      return pdf
    } finally {
      // Always close browser to prevent memory leaks
      if (browser) {
        await browser.close()
      }
    }
  } catch (error) {
    console.error("❌ PDF generation failed:", error)
    throw createError({
      statusCode: 500,
      statusMessage: `PDF generation failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    })
  }
})
