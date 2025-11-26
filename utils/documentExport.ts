import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import type { AdaptedCV } from '../types/cv'
import type { CoverLetter, ExportFormat, ExportResult } from '../types/api'

/**
 * Export document to DOCX format (server-side)
 */
export async function exportDocument(
  document: AdaptedCV | CoverLetter | string,
  documentType: 'cv' | 'letter',
  format: 'docx'
): Promise<ExportResult> {
  const timestamp = new Date().toISOString().slice(0, 10)
  const docTypeLabel = documentType === 'cv' ? 'CV' : 'Lettre'
  const filename = `${docTypeLabel}_${timestamp}.${format}`

  if (format !== 'docx') {
    throw new Error(`Format non supporté côté serveur: ${format}. Utilisez le composable côté client pour le PDF.`)
  }

  const blob = await generateDOCX(document, documentType)
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

        if (edu.endDate) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Diplômé en ${new Date(edu.endDate).getFullYear()}`,
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