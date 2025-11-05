<template>
  <div class="cv-template">
    <!-- Header Section -->
    <header class="cv-header">
      <div class="personal-info">
        <h1 class="name">{{ cvData.personalInfo.name }}</h1>
        <h2 class="title">{{ cvData.personalInfo.title }}</h2>

        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-label">Email:</span>
            <span class="contact-value">{{ cvData.personalInfo.email }}</span>
          </div>

          <div class="contact-item">
            <span class="contact-label">Téléphone:</span>
            <span class="contact-value">{{ cvData.personalInfo.phone }}</span>
          </div>

          <div class="contact-item">
            <span class="contact-label">Localisation:</span>
            <span class="contact-value">{{ cvData.personalInfo.location }}</span>
          </div>

          <div v-if="cvData.personalInfo.linkedin" class="contact-item">
            <span class="contact-label">LinkedIn:</span>
            <span class="contact-value">{{ cvData.personalInfo.linkedin }}</span>
          </div>

          <div v-if="cvData.personalInfo.github" class="contact-item">
            <span class="contact-label">GitHub:</span>
            <span class="contact-value">{{ cvData.personalInfo.github }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Summary Section -->
    <section class="cv-section summary-section">
      <h3 class="section-title">Résumé Professionnel</h3>
      <div class="section-content">
        <p class="summary-text">{{ cvData.summary }}</p>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="cv-section experience-section">
      <h3 class="section-title">Expérience Professionnelle</h3>
      <div class="section-content">
        <div
          v-for="(experience, index) in cvData.experiences"
          :key="experience.id || index"
          class="experience-item"
        >
          <div class="experience-header">
            <h4 class="experience-title">{{ experience.title }}</h4>
            <div class="experience-meta">
              <span class="company">{{ experience.company }}</span>
              <span class="location">{{ experience.location }}</span>
              <span class="duration">{{ experience.startDate }} - {{ experience.endDate }}</span>
            </div>
          </div>

          <div class="experience-description">
            <p v-if="experience.description" class="description-text">{{ experience.description }}</p>

            <ul v-if="experience.bullets && experience.bullets.length > 0" class="bullets-list">
              <li
                v-for="(bullet, bulletIndex) in experience.bullets"
                :key="bulletIndex"
                class="bullet-item"
              >
                {{ bullet }}
              </li>
            </ul>

            <div v-if="experience.skills && experience.skills.length > 0" class="experience-skills">
              <strong>Technologies utilisées:</strong>
              <span class="skills-list">{{ experience.skills.join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Education Section -->
    <section class="cv-section education-section">
      <h3 class="section-title">Formation</h3>
      <div class="section-content">
        <div
          v-for="(education, index) in cvData.education"
          :key="education.id || index"
          class="education-item"
        >
          <div class="education-header">
            <h4 class="education-degree">{{ education.degree }}</h4>
            <div class="education-meta">
              <span class="institution">{{ education.institution }}</span>
              <span class="education-date">{{ education.year }}</span>
            </div>
          </div>

          <p v-if="education.description" class="education-description">
            {{ education.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="cv-section skills-section">
      <h3 class="section-title">Compétences</h3>
      <div class="section-content">
        <div v-if="cvData.skills.technical && cvData.skills.technical.length > 0" class="skill-category">
          <h4 class="skill-category-title">Compétences Techniques</h4>
          <div class="skills-grid">
            <span
              v-for="(skill, index) in cvData.skills.technical"
              :key="index"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <div v-if="cvData.skills.languages && cvData.skills.languages.length > 0" class="skill-category">
          <h4 class="skill-category-title">Langues</h4>
          <div class="skills-grid">
            <span
              v-for="(language, index) in cvData.skills.languages"
              :key="index"
              class="skill-tag"
            >
              {{ language }}
            </span>
          </div>
        </div>

        <div v-if="cvData.skills.soft && cvData.skills.soft.length > 0" class="skill-category">
          <h4 class="skill-category-title">Compétences Transversales</h4>
          <div class="skills-grid">
            <span
              v-for="(soft, index) in cvData.skills.soft"
              :key="index"
              class="skill-tag"
            >
              {{ soft }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications Section (Optional) -->
    <section v-if="cvData.certifications && cvData.certifications.length > 0" class="cv-section certifications-section">
      <h3 class="section-title">Certifications</h3>
      <div class="section-content">
        <div
          v-for="(certification, index) in cvData.certifications"
          :key="certification.id || index"
          class="certification-item"
        >
          <div class="certification-header">
            <h4 class="certification-name">{{ certification.name }}</h4>
            <div class="certification-meta">
              <span class="issuer">{{ certification.issuer }}</span>
              <span v-if="certification.date" class="certification-date">{{ certification.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section (Optional) -->
    <section v-if="cvData.projects && cvData.projects.length > 0" class="cv-section projects-section">
      <h3 class="section-title">Projets</h3>
      <div class="section-content">
        <div
          v-for="(project, index) in cvData.projects"
          :key="project.id || index"
          class="project-item"
        >
          <div class="project-header">
            <h4 class="project-name">{{ project.name }}</h4>
            <span v-if="project.date" class="project-date">{{ project.date }}</span>
          </div>

          <p v-if="project.description" class="project-description">
            {{ project.description }}
          </p>

          <div v-if="project.technologies && project.technologies.length > 0" class="project-technologies">
            <strong>Technologies:</strong>
            <span class="technologies-list">{{ project.technologies.join(', ') }}</span>
          </div>

          <div v-if="project.url" class="project-url">
            <strong>URL:</strong>
            <span class="url-link">{{ project.url }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
}

interface Experience {
  id?: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description?: string
  bullets?: string[]
  skills?: string[]
  relevance?: string[]
}

interface Education {
  id?: string
  degree: string
  institution: string
  year: string
  description?: string
}

interface Skills {
  technical: string[]
  languages: string[]
  soft: string[]
}

interface Certification {
  id?: string
  name: string
  issuer: string
  date?: string
}

interface Project {
  id?: string
  name: string
  description?: string
  technologies?: string[]
  url?: string
  date?: string
}

interface CVData {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: Skills
  certifications?: Certification[]
  projects?: Project[]
}

// Define props
defineProps<{
  cvData: CVData
}>()
</script>

<style scoped>
.cv-template {
  max-width: 210mm; /* A4 width */
  margin: 0 auto;
  padding: 20mm;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  background: white;
}

/* Header Section */
.cv-header {
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1.5rem;
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.title {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  color: #6b7280;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  gap: 0.5rem;
}

.contact-label {
  font-weight: 600;
  color: #374151;
}

.contact-value {
  color: #6b7280;
}

/* Section Styles */
.cv-section {
  margin-bottom: 2rem;
  page-break-inside: avoid;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #111827;
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 0.5rem;
}

.section-content {
  margin-left: 0;
}

/* Summary */
.summary-text {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
  text-align: justify;
}

/* Experience */
.experience-item {
  margin-bottom: 1.5rem;
  page-break-inside: avoid;
}

.experience-header {
  margin-bottom: 0.75rem;
}

.experience-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #111827;
}

.experience-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.company {
  font-weight: 600;
  color: #374151;
}

.description-text {
  margin: 0 0 0.75rem 0;
  font-style: italic;
}

.bullets-list {
  margin: 0 0 0.75rem 0;
  padding-left: 1.25rem;
}

.bullet-item {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.experience-skills {
  font-size: 0.875rem;
  color: #6b7280;
}

.skills-list {
  margin-left: 0.5rem;
}

/* Education */
.education-item {
  margin-bottom: 1rem;
  page-break-inside: avoid;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.education-degree {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.education-meta {
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
}

.institution {
  font-weight: 600;
  color: #374151;
  display: block;
}

.education-description {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Skills */
.skill-category {
  margin-bottom: 1.5rem;
}

.skill-category-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #374151;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

/* Certifications */
.certification-item {
  margin-bottom: 1rem;
  page-break-inside: avoid;
}

.certification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.certification-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.certification-meta {
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
}

.issuer {
  font-weight: 600;
  color: #374151;
  display: block;
}

/* Projects */
.project-item {
  margin-bottom: 1.5rem;
  page-break-inside: avoid;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.project-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.project-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.project-description {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
}

.project-technologies,
.project-url {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.technologies-list,
.url-link {
  margin-left: 0.5rem;
}

/* Print optimizations */
@media print {
  .cv-template {
    padding: 15mm;
    font-size: 11pt;
    max-width: none;
  }

  .name {
    font-size: 24pt;
  }

  .title {
    font-size: 14pt;
  }

  .section-title {
    font-size: 16pt;
  }

  .cv-section {
    page-break-inside: avoid;
  }

  .experience-item,
  .education-item,
  .certification-item,
  .project-item {
    page-break-inside: avoid;
  }
}
</style>