import html2pdf from 'html2pdf.js'
import type { AdaptedCV, WorkExperience, Skill, Education } from '../../types/cv'

/**
 * Composable for client-side PDF generation using html2pdf.js
 */
export const usePDFExport = () => {
  /**
   * Generate HTML with embedded CSS for the CV template
   */
  const generateCVHTML = (cv: AdaptedCV): string => {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${cv.personalInfo?.firstName} ${cv.personalInfo?.lastName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }

        .cv-container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
        }

        .cv-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
        }

        .header-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .profile-section {
            display: grid;
            grid-template-columns: 120px 1fr auto;
            gap: 30px;
            align-items: start;
        }

        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .profile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-name {
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 5px;
            letter-spacing: -0.5px;
        }

        .profile-title {
            font-size: 1.4em;
            font-weight: 400;
            margin-bottom: 15px;
            opacity: 0.95;
        }

        .profile-bio {
            font-size: 1em;
            line-height: 1.6;
            opacity: 0.9;
            max-width: 700px;
            margin: 0;
        }

        .contact-bar {
            display: flex;
            gap: 30px;
            padding: 20px 30px;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            flex-wrap: wrap;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95em;
        }

        .main-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
            padding: 40px;
        }

        .section-title {
            font-size: 1.5em;
            color: #667eea;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            font-weight: 600;
        }

        .timeline-item {
            position: relative;
            padding-left: 30px;
            margin-bottom: 35px;
            padding-bottom: 35px;
            border-left: 2px solid #e0e0e0;
        }

        .timeline-item:last-child {
            border-left: 2px solid transparent;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .timeline-marker {
            position: absolute;
            left: -8px;
            top: 5px;
            width: 14px;
            height: 14px;
            background-color: #667eea;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 2px #667eea;
        }

        .experience-title {
            font-size: 1.3em;
            color: #333;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .company {
            font-size: 1.05em;
            color: #667eea;
            font-weight: 500;
            margin: 0 0 5px 0;
        }

        .period {
            font-size: 0.9em;
            color: #666;
            margin: 0 0 12px 0;
            font-style: italic;
        }

        .description {
            margin: 0 0 12px 0;
            line-height: 1.6;
        }

        .timeline-content ul {
            list-style: none;
            margin: 10px 0 0 0;
            padding: 0;
        }

        .timeline-content ul li {
            padding-left: 20px;
            margin-bottom: 8px;
            position: relative;
            line-height: 1.6;
        }

        .timeline-content ul li:before {
            content: "▹";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }

        .skills {
            margin-bottom: 35px;
        }

        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .skill-tag {
            display: inline-block;
            padding: 8px 16px;
            background-color: #2d3748;
            color: white;
            border-radius: 6px;
            font-size: 0.9em;
            font-weight: 500;
        }

        .education {
            margin-bottom: 35px;
        }

        .education-item {
            position: relative;
            padding-left: 25px;
            margin-bottom: 25px;
        }

        .timeline-marker-small {
            position: absolute;
            left: 0;
            top: 5px;
            width: 10px;
            height: 10px;
            background-color: #667eea;
            border-radius: 50%;
        }

        .education-item h4 {
            font-size: 1.1em;
            color: #333;
            margin: 0 0 5px 0;
            font-weight: 600;
        }

        .school {
            color: #667eea;
            font-weight: 500;
            margin: 0 0 5px 0;
        }

        /* Print-specific styles */
        @media print {
            body { margin: 0; }
            .cv-container {
                box-shadow: none;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="cv-header">
            <div class="header-content">
                <div class="profile-section">
                    <div class="profile-image">
                        <img src="/placeholder-profile.jpg" alt="${cv.personalInfo?.firstName} ${cv.personalInfo?.lastName}" class="profile-img">
                    </div>
                    <div class="profile-info">
                        <h1 class="profile-name">${cv.personalInfo?.firstName} ${cv.personalInfo?.lastName}</h1>
                        <h2 class="profile-title">Développeur</h2>
                        <p class="profile-bio">${cv.personalInfo?.summary || ''}</p>
                    </div>
                </div>
                <div class="contact-bar">
                    <div class="contact-item">📍 ${cv.personalInfo?.address?.city || ''}, ${cv.personalInfo?.address?.country || ''}</div>
                    <div class="contact-item">✉️ ${cv.personalInfo?.email || ''}</div>
                    <div class="contact-item">📞 ${cv.personalInfo?.phone || ''}</div>
                </div>
            </div>
        </div>

        <div class="main-content">
            <div class="left-column">
                <section class="experience-section">
                    <h3 class="section-title">Expériences professionnelles</h3>
                    ${cv.workExperience?.map((exp: WorkExperience) => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h4 class="experience-title">${exp.position}</h4>
                                <p class="company">${exp.company}</p>
                                <p class="period">${exp.startDate} – ${exp.endDate || 'Présent'}</p>
                                ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                            </div>
                        </div>
                    `).join('') || ''}
                </section>
            </div>

            <div class="right-column">
                <section class="skills">
                    <h3 class="section-title">Compétences</h3>
                    <div class="skills-grid">
                        ${cv.skills?.map((skill: Skill) => `<span class="skill-tag">${skill.name}</span>`).join('') || ''}
                    </div>
                </section>

                <section class="education">
                    <h3 class="section-title">Diplômes et Formations</h3>
                    ${cv.education?.map((edu: Education) => `
                        <div class="education-item">
                            <div class="timeline-marker-small"></div>
                            <div>
                                <h4>${edu.degree}</h4>
                                <p class="school">${edu.institution}</p>
                                <p class="period">${edu.endDate ? new Date(edu.endDate).getFullYear() : ''}</p>
                            </div>
                        </div>
                    `).join('') || ''}
                </section>
            </div>
        </div>
    </div>
</body>
</html>`
  }

  /**
   * Generate PDF from CV data
   */
  const generatePDF = async (cv: AdaptedCV): Promise<Blob> => {
    const htmlContent = generateCVHTML(cv)

    // Create a temporary div to hold the content
    const element = document.createElement('div')
    element.innerHTML = htmlContent

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename: `CV_${cv.personalInfo?.firstName}_${cv.personalInfo?.lastName}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false
      },
      jsPDF: {
        unit: 'in' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const
      }
    }

    // Generate PDF from HTML
    const pdfBlob = await html2pdf().set(opt).from(element).output('blob')
    return pdfBlob
  }

  /**
   * Generate PDF from cover letter
   */
  const generateLetterPDF = async (content: string): Promise<Blob> => {
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

    const element = document.createElement('div')
    element.innerHTML = htmlContent

    const opt = {
      margin: [1, 1, 1, 1] as [number, number, number, number],
      filename: 'Lettre_Motivation.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'in' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const
      }
    }

    const pdfBlob = await html2pdf().set(opt).from(element).output('blob')
    return pdfBlob
  }

  return {
    generatePDF,
    generateLetterPDF
  }
}