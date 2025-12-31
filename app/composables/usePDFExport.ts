import type { AdaptedCV } from "../../types/cv"

/**
 * Composable for client-side PDF generation using html2pdf.js
 */
export const usePDFExport = () => {
  /**
   * Generate PDF from CV data using server-side Puppeteer for ATS-compatible text extraction
   */
  const generatePDF = async (cv: AdaptedCV): Promise<Blob> => {
    // Vérifier qu'on est côté client
    if (import.meta.server) {
      throw new Error("PDF generation can only be done on the client side")
    }

    console.log("Generating PDF for CV:", cv)

    try {
      // Find the CVTemplate component in the DOM
      const cvElement = document.querySelector(".cv-wrapper") as HTMLElement

      if (!cvElement) {
        throw new Error(
          "CVTemplate component not found in DOM. Make sure the CV is displayed before generating PDF."
        )
      }

      // Clone the element to avoid modifying the original
      const clonedElement = cvElement.cloneNode(true) as HTMLElement

      // Optimize clone for PDF generation
      clonedElement.style.transform = "none"
      clonedElement.style.boxShadow = "none"
      clonedElement.style.margin = "0"
      clonedElement.style.width = "210mm"
      clonedElement.style.height = "297mm"
      clonedElement.style.maxHeight = "297mm"
      clonedElement.style.minHeight = "297mm"
      clonedElement.style.overflow = "hidden"

      // Extract all CSS styles from the document
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n")
          } catch (_e) {
            // Handle CORS errors on external stylesheets
            return ""
          }
        })
        .join("\n")

      // Create standalone HTML document
      const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: white;
        }

        .cv-wrapper {
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background: white !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
        }

        .cv-header {
            max-height: 80mm !important;
            overflow: hidden !important;
        }

        .main-content {
            max-height: 200mm !important;
            overflow: hidden !important;
        }

        .profile-bio {
            max-height: 35mm !important;
            overflow: hidden !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
        }

        .experience-item,
        .education-item,
        .project-item,
        section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        ${styles}
    </style>
</head>
<body>
    ${clonedElement.outerHTML}
</body>
</html>`

      console.log("📦 HTML size:", new Blob([fullHTML]).size, "bytes")

      // Send HTML to server for PDF generation
      const blob = (await $fetch("/api/generate-cv-pdf", {
        method: "POST",
        body: { html: fullHTML },
        responseType: "blob",
      })) as Blob

      return blob
    } catch (error) {
      console.error("❌ PDF generation failed:", error)
      throw new Error(
        `PDF generation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  //   /**
  //    * Generate PDF from cover letter
  //    */
  //   const generateLetterPDF = async (content: string): Promise<Blob> => {
  //     // Vérifier qu'on est côté client
  //     if (import.meta.server) {
  //       throw new Error("PDF generation can only be done on the client side")
  //     }

  //     // Import html2pdf dynamiquement côté client uniquement
  //     const html2pdf = await import("html2pdf.js").then((m) => m.default)

  //     const htmlContent = `
  // <!DOCTYPE html>
  // <html>
  // <head>
  //     <meta charset="UTF-8">
  //     <style>
  //         body {
  //             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  //             padding: 40px;
  //             line-height: 1.6;
  //             color: #333;
  //         }
  //         .content {
  //             white-space: pre-line;
  //         }
  //     </style>
  // </head>
  // <body>
  //     <div class="content">${content}</div>
  // </body>
  // </html>`

  //     const element = document.createElement("div")
  //     element.innerHTML = htmlContent

  //     const opt = {
  //       margin: [1, 1, 1, 1] as [number, number, number, number],
  //       filename: "Lettre_Motivation.pdf",
  //       image: { type: "jpeg" as const, quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: {
  //         unit: "in" as const,
  //         format: "a4" as const,
  //         orientation: "portrait" as const,
  //       },
  //     }

  //     const pdfBlob = await html2pdf().set(opt).from(element).output("blob")
  //     return pdfBlob
  //   }

  return {
    generatePDF,
    // generateLetterPDF,
  }
}
