<template>
  <div class="cv-template cv-container w-full max-w-5xl mx-auto bg-white shadow-2xl">
    <!-- Header Section avec gradient -->
    <div class="cv-header">
      <div class="header-content">
        <div class="profile-section">
          <!-- Photo de profil -->
          <div class="profile-image">
            <img
              :src="cvData.personalInfo.photo || '/placeholder-profile.jpg'"
              :alt="cvData.personalInfo.name"
              class="profile-img"
            >
          </div>

          <!-- Informations personnelles -->
          <div class="profile-info">
            <h1 class="profile-name">{{ cvData.personalInfo.name }}</h1>
            <h2 class="profile-title">{{ cvData.personalInfo.title }}</h2>
            <p class="profile-bio">{{ cvData.summary }}</p>
          </div>

          <!-- LinkedIn -->
          <div v-if="cvData.personalInfo.linkedin" class="linkedin-section">
            <a :href="cvData.personalInfo.linkedin" target="_blank" class="linkedin-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              {{ cvData.personalInfo.name }}
            </a>
          </div>
        </div>

        <!-- Barre de contact -->
        <div class="contact-bar">
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {{ cvData.personalInfo.location }}
          </div>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            {{ cvData.personalInfo.email }}
          </div>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            {{ cvData.personalInfo.phone }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content avec layout 2 colonnes -->
    <div class="main-content">
      <!-- Colonne de gauche - Expériences -->
      <div class="left-column">
        <section class="experience-section">
          <h3 class="section-title">Expériences professionnelles</h3>

          <div
            v-for="(experience, index) in cvData.experiences"
            :key="experience.id || index"
            class="timeline-item"
          >
            <div class="timeline-marker"/>
            <div class="timeline-content">
              <h4 class="experience-title">{{ experience.title }}</h4>
              <p class="company">{{ experience.company }}</p>
              <p class="period">
                {{ experience.startDate }} – {{ experience.endDate }}
                <span class="location">{{ experience.location }}</span>
              </p>
              <p v-if="experience.description" class="description">
                {{ experience.description }}
              </p>
              <ul v-if="experience.bullets && experience.bullets.length > 0">
                <li
                  v-for="(bullet, bulletIndex) in experience.bullets"
                  :key="bulletIndex"
                >
                  {{ bullet }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- Colonne de droite - Compétences, Formation, etc. -->
      <div class="right-column">
        <!-- Section Compétences -->
        <section class="skills">
          <h3 class="section-title">Compétences</h3>
          <div class="skills-grid">
            <span
              v-for="(skill, index) in cvData.skills.technical"
              :key="index"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </section>

        <!-- Section Formation -->
        <section class="education">
          <h3 class="section-title">Diplômes et Formations</h3>

          <div
            v-for="(education, index) in cvData.education"
            :key="education.id || index"
            class="education-item"
          >
            <div class="timeline-marker-small"/>
            <div>
              <h4>{{ education.degree }}</h4>
              <p class="school">{{ education.institution }}</p>
              <p class="period">{{ education.year }} <span class="location">{{ education.location || 'France' }}</span></p>
              <p v-if="education.description" class="compact-description">{{ education.description }}</p>
            </div>
          </div>
        </section>

        <!-- Section Langues -->
        <section class="languages">
          <h3 class="section-title">Langues</h3>
          <div
            v-for="(language, index) in cvData.skills.languages"
            :key="index"
            class="language-item"
          >
            <strong>{{ language.split(' (')[0] }}</strong>
            <span class="level">{{ language.includes('(') ? language.split(' (')[1]?.replace(')', '') || 'Fluent' : 'Fluent' }}</span>
          </div>
        </section>

        <!-- Section Centres d'intérêt -->
        <section class="interests">
          <h3 class="section-title">Centres d'intérêt</h3>
          <ul class="interests-list">
            <li>La Tech</li>
            <li>Musique</li>
            <li>Développement</li>
            <li>Innovation</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CVData } from "./mockCVData"

// Define props
defineProps<{
  cvData: CVData
}>()
</script>

<style scoped>
@reference "~/assets/css/main.css";

/* Reset styles adapté du design de référence */
.cv-template {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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

/* Header Section avec gradient violet */
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

.linkedin-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.95em;
  white-space: nowrap;
}

.linkedin-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
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

.contact-item svg {
  opacity: 0.9;
}

/* Layout principal 2 colonnes */
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

/* Timeline pour les expériences */
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

.timeline-content h4.experience-title {
  font-size: 1.3em;
  color: #333;
  margin-bottom: 5px;
  font-weight: 600;
}

.company {
  font-size: 1.05em;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 5px;
  margin: 0;
}

.period {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 12px;
  font-style: italic;
  margin: 0 0 12px 0;
}

.location {
  margin-left: 15px;
  padding-left: 15px;
  border-left: 1px solid #ccc;
}

.description {
  margin-bottom: 12px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.timeline-content ul {
  list-style: none;
  margin-top: 10px;
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

/* Section Compétences */
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
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

/* Section Formation */
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
  margin-bottom: 5px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.school {
  color: #667eea;
  font-weight: 500;
  margin-bottom: 5px;
  margin: 0 0 5px 0;
}

.compact-description {
  font-size: 0.9em;
  color: #666;
  padding: 3px 0;
  margin: 8px 0 0 0;
}

/* Section Langues */
.languages {
  margin-bottom: 35px;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.level {
  background-color: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 600;
}

/* Section Centres d'intérêt */
.interests-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.interests-list li {
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.95em;
}

.interests-list li:last-child {
  border-bottom: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .profile-section {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .profile-image {
    margin: 0 auto;
  }

  .linkedin-section {
    display: flex;
    justify-content: center;
  }

  .profile-bio {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .cv-header {
    padding: 30px 20px;
  }

  .main-content {
    padding: 30px 20px;
    gap: 30px;
  }

  .profile-name {
    font-size: 2em;
  }

  .profile-title {
    font-size: 1.2em;
  }

  .contact-bar {
    flex-direction: column;
    gap: 15px;
  }

  .contact-item {
    justify-content: center;
  }
}

/* Styles d'impression */
@media print {
  .cv-template {
    background-color: white;
  }

  .cv-container {
    box-shadow: none;
    max-width: 100%;
  }

  .cv-header {
    background: #667eea;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .skill-tag {
    background-color: #2d3748 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .timeline-item {
    page-break-inside: avoid;
  }
}
</style>
