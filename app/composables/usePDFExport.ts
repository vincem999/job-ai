import type { AdaptedCV } from "../../types/cv"

/**
 * Composable for client-side PDF generation using html2pdf.js
 */
export const usePDFExport = () => {

  /**
   * Generate PDF from CV data by finding the CVTemplate component in the DOM
   */
  const generatePDF = async (cv: AdaptedCV): Promise<Blob> => {
    // Vérifier qu'on est côté client
    if (import.meta.server) {
      throw new Error('PDF generation can only be done on the client side')
    }

    console.log("Generating PDF for CV:", cv)

    // Import html2canvas-pro et jsPDF dynamiquement côté client uniquement
    const [html2canvas, jsPDF] = await Promise.all([
      import("html2canvas-pro").then(m => m.default),
      import("jspdf").then(m => m.jsPDF)
    ])

    // Find the CVTemplate component in the DOM
    const cvElement = document.querySelector('.cv-template') as HTMLElement

    if (!cvElement) {
      throw new Error('CVTemplate component not found in DOM. Make sure the CV is displayed before generating PDF.')
    }

    // Store original styles to restore later
    const originalStyles = {
      transform: cvElement.style.transform,
      margin: cvElement.style.margin,
      padding: cvElement.style.padding,
      boxShadow: cvElement.style.boxShadow,
      backgroundColor: cvElement.style.backgroundColor,
      width: cvElement.style.width,
      minHeight: cvElement.style.minHeight,
      maxWidth: cvElement.style.maxWidth,
    }

    const originalClasses = Array.from(cvElement.classList)

    // Temporarily optimize for PDF generation
    cvElement.style.transform = 'none'
    cvElement.style.margin = '0'
    cvElement.style.padding = '0'
    cvElement.style.boxShadow = 'none'
    cvElement.style.backgroundColor = 'white'

    // Force A4 dimensions for PDF export
    cvElement.style.width = '210mm'
    cvElement.style.minHeight = '297mm'
    cvElement.style.maxWidth = '210mm'

    // Add PDF export class for specific styles
    cvElement.classList.add('pdf-export')

    // Wait for fonts to load completely
    await document.fonts.ready

    // Small delay to ensure rendering is complete
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      // Use html2canvas-pro directly to generate the canvas from the original element
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false, // Disable logging now that it works
        imageTimeout: 15000, // Increase timeout for images/fonts
        onclone: (clonedDoc) => {
          // Fix font rendering in cloned document
          const clonedElement = clonedDoc.querySelector('.cv-template') as HTMLElement
          if (clonedElement) {
            // Ensure fonts are properly applied in cloned document
            clonedElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

            // Fix font smoothing
            clonedElement.style.setProperty('-webkit-font-smoothing', 'antialiased')
            clonedElement.style.setProperty('-moz-osx-font-smoothing', 'grayscale')

            // Fix any potential font size and line-height issues
            const allElements = clonedElement.querySelectorAll('*')
            allElements.forEach((el: any) => {
              if (el.style) {
                // Ensure line-height is explicit to prevent overlapping
                const computedStyle = window.getComputedStyle(el)
                if (!el.style.lineHeight || el.style.lineHeight === 'normal') {
                  el.style.lineHeight = computedStyle.lineHeight !== 'normal' ? computedStyle.lineHeight : '1.5'
                }
                // Ensure font-size is explicit
                if (!el.style.fontSize) {
                  el.style.fontSize = computedStyle.fontSize
                }
                // Fix potential text overlapping with better spacing
                if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
                  el.style.marginBottom = '0.5rem'
                  el.style.marginTop = '0.5rem'
                }
                if (el.tagName === 'P') {
                  el.style.marginBottom = '0.25rem'
                  el.style.marginTop = '0.25rem'
                }
              }
            })
          }
        }
      })

      // Get canvas dimensions
      const imgData = canvas.toDataURL('image/jpeg', 0.98)
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      // Create PDF with jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      // Add image to PDF (handle multiple pages if needed)
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Convert to blob
      const pdfBlob = pdf.output('blob')
      return pdfBlob
    } finally {
      // Restore original styles
      cvElement.style.transform = originalStyles.transform
      cvElement.style.margin = originalStyles.margin
      cvElement.style.padding = originalStyles.padding
      cvElement.style.boxShadow = originalStyles.boxShadow
      cvElement.style.backgroundColor = originalStyles.backgroundColor
      cvElement.style.width = originalStyles.width
      cvElement.style.minHeight = originalStyles.minHeight
      cvElement.style.maxWidth = originalStyles.maxWidth

      // Restore original classes
      cvElement.className = originalClasses.join(' ')
    }
  }

  /**
   * Generate PDF from cover letter
   */
  const generateLetterPDF = async (content: string): Promise<Blob> => {
    // Vérifier qu'on est côté client
    if (import.meta.server) {
      throw new Error('PDF generation can only be done on the client side')
    }

    // Import html2pdf dynamiquement côté client uniquement
    const html2pdf = await import("html2pdf.js").then(m => m.default)

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            padding: 40px;
            line-height: 1.6;
            color: #333;
        }
        .content {
            white-space: pre-line;
        }
    </style>
</head>
<body>
    <div class="content">${content}</div>
</body>
</html>`

    const element = document.createElement("div")
    element.innerHTML = htmlContent

    const opt = {
      margin: [1, 1, 1, 1] as [number, number, number, number],
      filename: "Lettre_Motivation.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "in" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
    }

    const pdfBlob = await html2pdf().set(opt).from(element).output("blob")
    return pdfBlob
  }

  return {
    generatePDF,
    generateLetterPDF,
  }
}
