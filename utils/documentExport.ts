import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import type { AdaptedCV } from '../types/cv'
import type { CoverLetter, ExportFormat, ExportResult } from '../types/api'

/**
 * Export document to PDF or DOCX format
 */
export async function exportDocument(
  document: AdaptedCV | CoverLetter | string,
  documentType: 'cv' | 'letter',
  format: 'pdf' | 'docx'
): Promise<ExportResult> {
  const timestamp = new Date().toISOString().slice(0, 10)
  const docTypeLabel = documentType === 'cv' ? 'CV' : 'Lettre'
  const filename = `${docTypeLabel}_${timestamp}.${format}`

  let blob: Blob

  if (format === 'pdf') {
    blob = await generatePDF(document, documentType)
  } else if (format === 'docx') {
    blob = await generateDOCX(document, documentType)
  } else {
    throw new Error(`Format non supporté: ${format}`)
  }

  const size = blob.size
  const downloadUrl = URL.createObjectURL(blob)

  return {
    downloadUrl,
    filename,
    format: format as ExportFormat,
    size,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
    metadata: {
      pages: estimatePages(document, documentType),
      wordCount: estimateWordCount(document, documentType),
      generatedAt: new Date()
    }
  }
}

/**
 * Generate PDF document using jsPDF
 */
async function generatePDF(
  document: AdaptedCV | CoverLetter | string,
  documentType: 'cv' | 'letter'
): Promise<Blob> {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 20
  let yPosition = margin

  // Helper function to add text with line wrapping
  const addText = (text: string, fontSize = 12, isBold = false, isTitle = false) => {
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal')

    if (isTitle) {
      const textWidth = pdf.getTextWidth(text)
      const xPosition = (pageWidth - textWidth) / 2
      pdf.text(text, xPosition, yPosition)
    } else {
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      pdf.text(lines, margin, yPosition)
      return lines.length
    }
    return 1
  }

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage()
      yPosition = margin
    }
  }

  if (documentType === 'cv' && typeof document === 'object' && 'personalInfo' in document) {
    const cv = document as AdaptedCV

    // Header - Personal Info
    if (cv.personalInfo) {
      const fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`
      addText(fullName, 20, true, true)
      yPosition += 15

      addText(cv.personalInfo.email, 12)
      yPosition += 8

      if (cv.personalInfo.phone) {
        addText(cv.personalInfo.phone, 12)
        yPosition += 8
      }

      if (cv.personalInfo.address) {
        addText(`${cv.personalInfo.address.city}, ${cv.personalInfo.address.country}`, 12)
        yPosition += 8
      }

      yPosition += 10

      // Add line separator
      pdf.setDrawColor(0, 0, 0)
      pdf.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 15
    }

    // Work Experience
    if (cv.workExperience?.length) {
      checkNewPage(30)
      addText('EXPÉRIENCE PROFESSIONNELLE', 16, true)
      yPosition += 12

      cv.workExperience.forEach((exp, index) => {
        checkNewPage(40)

        addText(`${exp.position} - ${exp.company}`, 14, true)
        yPosition += 10

        addText(`${exp.startDate} - ${exp.endDate || 'Présent'}`, 10)
        yPosition += 8

        if (exp.description) {
          const lines = addText(exp.description, 12)
          yPosition += lines * 6
        }

        if (index < cv.workExperience.length - 1) {
          yPosition += 10
        }
      })
      yPosition += 15
    }

    // Skills
    if (cv.skills?.length) {
      checkNewPage(30)
      addText('COMPÉTENCES', 16, true)
      yPosition += 12

      const skillsText = cv.skills.join(', ')
      const lines = addText(skillsText, 12)
      yPosition += lines * 6 + 15
    }

    // Education
    if (cv.education?.length) {
      checkNewPage(30)
      addText('FORMATION', 16, true)
      yPosition += 12

      cv.education.forEach((edu, index) => {
        checkNewPage(30)

        addText(`${edu.degree} - ${edu.institution}`, 14, true)
        yPosition += 10

        if (edu.graduationYear) {
          addText(`Diplômé en ${edu.graduationYear}`, 12)
          yPosition += 8
        }

        if (index < cv.education.length - 1) {
          yPosition += 10
        }
      })
    }

  } else {
    // Letter content
    const content = typeof document === 'string' ? document : (document as CoverLetter).content
    const lines = content.split('\n')

    lines.forEach((line) => {
      checkNewPage(15)
      if (line.trim()) {
        const textLines = addText(line, 12)
        yPosition += textLines * 6
      } else {
        yPosition += 6 // Empty line spacing
      }
    })
  }

  return new Blob([pdf.output('blob')], { type: 'application/pdf' })
}

/**
 * Generate DOCX document
 */
async function generateDOCX(
  document: AdaptedCV | CoverLetter | string,
  documentType: 'cv' | 'letter'
): Promise<Blob> {
  const paragraphs: Paragraph[] = []

  if (documentType === 'cv' && typeof document === 'object' && 'personalInfo' in document) {
    const cv = document as AdaptedCV

    // Personal Info
    if (cv.personalInfo) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`,
              bold: true,
              size: 32
            })
          ],
          alignment: 'center',
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: cv.personalInfo.email, size: 24 })],
          alignment: 'center'
        })
      )

      if (cv.personalInfo.phone) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: cv.personalInfo.phone, size: 24 })],
            alignment: 'center'
          })
        )
      }

      if (cv.personalInfo.address) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${cv.personalInfo.address.city}, ${cv.personalInfo.address.country}`,
                size: 24
              })
            ],
            alignment: 'center',
            spacing: { after: 400 }
          })
        )
      }
    }

    // Work Experience
    if (cv.workExperience?.length) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'EXPÉRIENCE PROFESSIONNELLE',
              bold: true,
              size: 28
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      )

      cv.workExperience.forEach((exp) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.position} - ${exp.company}`,
                bold: true,
                size: 26
              })
            ],
            spacing: { before: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.startDate} - ${exp.endDate || 'Présent'}`,
                italics: true,
                size: 22
              })
            ]
          })
        )

        if (exp.description) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: exp.description, size: 24 })],
              spacing: { after: 200 }
            })
          )
        }
      })
    }

    // Skills
    if (cv.skills?.length) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'COMPÉTENCES',
              bold: true,
              size: 28
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: cv.skills.join(', '), size: 24 })],
          spacing: { after: 200 }
        })
      )
    }

    // Education
    if (cv.education?.length) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'FORMATION',
              bold: true,
              size: 28
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      )

      cv.education.forEach((edu) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree} - ${edu.institution}`,
                bold: true,
                size: 26
              })
            ],
            spacing: { before: 200 }
          })
        )

        if (edu.graduationYear) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Diplômé en ${edu.graduationYear}`,
                  size: 24
                })
              ],
              spacing: { after: 200 }
            })
          )
        }
      })
    }

  } else {
    // Letter content
    const content = typeof document === 'string' ? document : (document as CoverLetter).content
    const lines = content.split('\n')

    lines.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line || ' ', // Empty line for spacing
              size: 24
            })
          ],
          spacing: line.trim() ? { after: 200 } : { after: 100 }
        })
      )
    })
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  return new Blob([new Uint8Array(buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  })
}

/**
 * Trigger download of a file
 */
export function downloadFile(downloadUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the object URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl)
  }, 1000)
}

/**
 * Estimate number of pages
 */
function estimatePages(document: AdaptedCV | CoverLetter | string, documentType: 'cv' | 'letter'): number {
  const wordCount = estimateWordCount(document, documentType)
  // Rough estimate: 250 words per page
  return Math.ceil(wordCount / 250)
}

/**
 * Estimate word count
 */
function estimateWordCount(document: AdaptedCV | CoverLetter | string, documentType: 'cv' | 'letter'): number {
  let text: string

  if (documentType === 'cv' && typeof document === 'object' && 'personalInfo' in document) {
    const cv = document as AdaptedCV
    const parts: string[] = []

    if (cv.personalInfo) {
      parts.push(`${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`)
    }

    if (cv.workExperience?.length) {
      cv.workExperience.forEach(exp => {
        parts.push(`${exp.position} ${exp.company}`)
        if (exp.description) parts.push(exp.description)
      })
    }

    if (cv.skills?.length) {
      parts.push(cv.skills.join(' '))
    }

    if (cv.education?.length) {
      cv.education.forEach(edu => {
        parts.push(`${edu.degree} ${edu.institution}`)
      })
    }

    text = parts.join(' ')
  } else {
    text = typeof document === 'string' ? document : (document as CoverLetter).content
  }

  return text.split(/\s+/).filter(word => word.length > 0).length
}