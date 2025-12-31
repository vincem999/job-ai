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
        deviceScaleFactor: 1,
      })

      // Set content and wait for complete loading
      await page.setContent(html, {
        waitUntil: ["networkidle0", "domcontentloaded"],
        timeout: 30000,
      })

      // Wait for fonts to load
      await page.evaluate(() => document.fonts.ready)

      // Add CSS to force single page and optimize layout
      // await page.addStyleTag({
      //   content: `
      //     @page {
      //       size: A4;
      //       margin: 0;
      //     }

      //     body {
      //       margin: 0 !important;
      //       padding: 0 !important;
      //       overflow: hidden !important;
      //     }

      //     .cv-wrapper {
      //       width: 210mm !important;
      //       height: 297mm !important;
      //       max-height: 297mm !important;
      //       min-height: 297mm !important;
      //       overflow: hidden !important;
      //       page-break-after: avoid !important;
      //       page-break-inside: avoid !important;
      //       box-sizing: border-box !important;
      //     }

      //     .cv-header {
      //       max-height: 80mm !important;
      //       overflow: hidden !important;
      //     }

      //     .main-content {
      //       max-height: 200mm !important;
      //       overflow: hidden !important;
      //     }

      //     .timeline-item,
      //     .education-item,
      //     section {
      //       page-break-inside: avoid !important;
      //       break-inside: avoid !important;
      //     }

      //     .profile-bio {
      //       max-height: 40mm !important;
      //       overflow: hidden !important;
      //       display: -webkit-box !important;
      //       -webkit-line-clamp: 4 !important;
      //       -webkit-box-orient: vertical !important;
      //     }
      //   `
      // })

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
        scale: 0.9,
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
