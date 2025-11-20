import type { CV } from '~/types/cv'
import type { CVData } from '~/components/templates/mockCVData'

/**
 * Adapte les données CV du format master vers le format template Vue
 */
export function adaptCVDataForTemplate(cv: CV): CVData {
  return {
    personalInfo: {
      name: `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`,
      title: "Développeur Front-end Vue.js", // Titre par défaut
      email: cv.personalInfo.email,
      phone: cv.personalInfo.phone || '',
      location: cv.personalInfo.address ? `${cv.personalInfo.address.city}, ${cv.personalInfo.address.country}` : '',
      linkedin: cv.personalInfo.linkedin,
      github: cv.personalInfo.github
    },
    summary: cv.personalInfo.summary || '',
    experiences: cv.workExperience.map(exp => ({
      id: exp.id,
      title: exp.position,
      company: exp.company,
      location: exp.location || '',
      startDate: formatDate(exp.startDate),
      endDate: exp.endDate ? formatDate(exp.endDate) : 'Present',
      description: exp.description,
      bullets: exp.achievements,
      skills: exp.technologies
    })),
    education: cv.education.map(edu => ({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      year: formatYear(edu.endDate || edu.startDate),
      description: edu.description
    })),
    skills: {
      technical: cv.skills
        .filter(skill => skill.category === 'technical' || skill.category === 'framework' || skill.category === 'tool')
        .map(skill => skill.name),
      languages: cv.languages.map(lang => {
        const levelMap = {
          'native': '(natif)',
          'fluent': '(courant)',
          'conversational': '(conversationnel)',
          'basic': '(base)'
        }
        return `${lang.name} ${levelMap[lang.level] || ''}`
      }),
      soft: cv.skills
        .filter(skill => skill.category === 'soft')
        .map(skill => skill.name)
    },
    certifications: cv.certifications?.map(cert => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      date: formatDate(cert.issueDate)
    })),
    projects: cv.projects?.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      url: project.url,
      date: formatYear(project.startDate)
    }))
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit' })
}

function formatYear(date: Date): string {
  return date.getFullYear().toString()
}