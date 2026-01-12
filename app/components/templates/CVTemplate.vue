<template>
  <div
    ref="measureRef"
    class="cv-measure-zone light:bg-inverted/5 dark:bg-white"
  >
    <div ref="cvContainer" class="cv-layout-container" :style="containerStyle">
      <div class="cv-wrapper" :style="wrapperStyle">
        <!-- Header Section avec gradient -->
        <div class="cv-header">
          <div class="header-content">
            <div class="profile-section">
              <!-- Photo de profil -->
              <div class="profile-image">
                <img
                  :src="cvData.personalInfo.photo || '/placeholder-profile.jpg'"
                  :alt="
                    cvData.personalInfo.firstName +
                    ' ' +
                    cvData.personalInfo.lastName
                  "
                  class="profile-img"
                />
              </div>

              <!-- Informations personnelles -->
              <div class="profile-info">
                <div style="display: flex; justify-content: space-between">
                  <div>
                    <h1 class="profile-name">
                      {{
                        cvData.personalInfo.firstName +
                        " " +
                        cvData.personalInfo.lastName
                      }}
                    </h1>
                  </div>
                  <div
                    v-if="cvData.personalInfo.linkedin"
                    class="linkedin-section"
                  >
                    <a
                      :href="cvData.personalInfo.linkedin"
                      target="_blank"
                      class="linkedin-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                        />
                      </svg>
                      {{
                        cvData.personalInfo.firstName +
                        " " +
                        cvData.personalInfo.lastName
                      }}
                    </a>
                  </div>
                </div>
                <h2 class="profile-title">{{ cvData.personalInfo.title }}</h2>
                <p class="profile-bio">{{ cvData.summary }}</p>
              </div>

              <!-- LinkedIn -->
            </div>

            <!-- Barre de contact -->
            <div class="contact-bar">
              <div class="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
                {{ cvData.personalInfo.location }}
              </div>
              <div class="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  />
                </svg>
                {{ cvData.personalInfo.email }}
              </div>
              <div class="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  />
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
                v-for="(experience, index) in cvData.workExperiences"
                :key="experience.id || index"
                class="timeline-item"
              >
                <div class="timeline-marker" />
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
                  <ul
                    v-if="experience.bullets && experience.bullets.length > 0"
                  >
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

            <section class="project">
              <h3 class="section-title">Projets</h3>
              <div class="project-item">
                <p>https://job-ai-mu.vercel.app</p>
                <p>https://www.re-ne-sens.com</p>
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
                <div>
                  <h4>{{ education.degree }}</h4>
                  <p class="school">{{ education.institution }}</p>
                  <p class="period">
                    {{ education.year }}
                    <span class="location">{{
                      education.location || "France"
                    }}</span>
                  </p>
                  <p v-if="education.description" class="compact-description">
                    {{ education.description }}
                  </p>
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
                <p class="language-text">{{ language.split(" (")[0] }} B2</p>
              </div>
            </section>

            <!-- Section Centres d'intérêt -->
            <section class="interests">
              <h3 class="section-title">Centres d'intérêt</h3>
              <ul class="interests-list">
                <li>La Tech</li>
                <li>Musique</li>
                <li>Vêtements</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import type { CV } from "../../../types/cv"

// Define props
defineProps<{
  cvData: CV
}>()

const measureRef = ref<HTMLElement | null>(null)
const scale = ref(1)

// Dimensions A4 en pixels (à 96 DPI)
const A4_WIDTH = 794 // 210mm
const A4_HEIGHT = 1123 // 297mm

const wrapperStyle = computed(() => ({
  width: `${A4_WIDTH}px`,
  height: `${A4_HEIGHT}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: "top center",
  transition: "transform 0.2s ease-out", // Transition fluide
}))

const containerStyle = computed(() => ({
  height: `${A4_HEIGHT * scale.value}px`, // S'adapte au scale
  width: "100%",
  display: "flex",
  justifyContent: "center",
  transition: "height 0.2s ease-out", // Transition fluide de la hauteur
}))

const calculateScale = () => {
  if (!measureRef.value) return

  // On mesure l'espace disponible dans le parent de mesure
  const availableWidth = measureRef.value.clientWidth
  const margin = 40
  const widthToUse = availableWidth - margin * 2

  // On ne scale que sur la largeur pour éviter le blocage vertical
  const scaleX = widthToUse / A4_WIDTH

  // Max 1 pour ne pas pixeliser, Min 0.1 pour la sécurité
  scale.value = Math.max(0.1, Math.min(scaleX, 1))
}

let observer: ResizeObserver | null = null

onMounted(() => {
  calculateScale()
  observer = new ResizeObserver(() => {
    calculateScale()
  })

  if (measureRef.value) {
    observer.observe(measureRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.cv-measure-zone {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  border-radius: calc(var(--ui-radius) * 2);
}
/* Conteneur A4 - Dimensions réelles de la feuille A4 */
.cv-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  overflow: auto;
  background: #f0f0f0; /* optionnel */
}

.cv-wrapper {
  background: white;
  box-shadow: 0 14px 20px rgba(102, 76, 76, 0.1);
  flex-shrink: 0;
}

/* Header Section avec gradient violet */
.cv-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4mm;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 3mm;
}

.profile-section {
  display: grid;
  grid-template-columns: 30mm 1fr;
  gap: 8mm;
  align-items: start;
}

.profile-image {
  width: 30mm;
  height: 30mm;
  border-radius: 50%;
  overflow: hidden;
  border: 0.3mm solid white;
  box-shadow: 0 1mm 2mm rgba(0, 0, 0, 0.1);
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 18pt;
  font-weight: 700;
  letter-spacing: -0.3pt;
  color: white !important;
}

.profile-title {
  font-size: 12pt;
  font-weight: 500;
  margin-bottom: 1mm;
  opacity: 0.95;
  color: white !important;
}

.profile-bio {
  font-size: 9.5pt;
  line-height: 1.4;
  opacity: 0.9;
  max-width: 160mm;
  margin: 0;
  color: white !important;
}

.linkedin-link {
  display: flex;
  align-items: center;
  gap: 2mm;
  color: white;
  text-decoration: none;
  padding: 2mm 4mm;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2mm;
  transition: all 0.3s ease;
  font-size: 8pt;
  white-space: nowrap;
}

.linkedin-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1pt);
}

.contact-bar {
  display: flex;
  gap: 8mm;
  padding: 3mm 8mm;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3mm;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 2.5mm;
  font-size: 8.5pt;
}

.contact-item svg {
  opacity: 0.9;
}

/* Layout principal 2 colonnes */
.main-content {
  display: grid;
  grid-template-columns: 1fr 60mm;
  gap: 8mm;
  margin-top: 0;
  padding: 5mm;
}

.section-title {
  font-size: 11pt;
  color: #667eea;
  margin-bottom: 2mm;
  padding-bottom: 2mm;
  border-bottom: 0.8mm solid #667eea;
  font-weight: 600;
}

/* Timeline pour les expériences */
.timeline-item {
  position: relative;
  padding-left: 5mm;
  padding-bottom: 1.5mm;
}

.timeline-item:last-child {
  border-left: 0.5mm solid transparent;
  margin-bottom: 0;
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 1.8mm;
  width: 2mm;
  height: 2mm;
  background-color: #667eea;
  border-radius: 50%;
  border: 1px solid white;
  box-shadow: 0 0 0 0.5mm #667eea;
}

.timeline-content h4.experience-title {
  font-size: 10pt;
  color: #333;
  margin-bottom: 1.5mm;
  font-weight: 600;
}

.company {
  font-size: 9pt;
  color: #667eea;
  font-weight: 500;
  margin: 0 0 1mm 0;
}

.period {
  font-size: 8pt;
  color: #666;
  font-style: italic;
  margin: 0 0 3mm 0;
}

.location {
  margin-left: 4mm;
  padding-left: 4mm;
  border-left: 0.3mm solid #ccc;
}

.description {
  font-size: 9.5pt;
  line-height: 1.4;
  margin: 0 0 3mm 0;
  color: #666;
}

.timeline-content ul {
  list-style: none;
  margin: 2.5mm 0 0 0;
  padding: 0;
  color: #666;
}

.timeline-content ul li {
  padding-left: 5mm;
  margin-bottom: 1.5mm;
  position: relative;
  line-height: 1.4;
  font-size: 9.5pt;
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
  margin-bottom: 7mm;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5mm;
}

.skill-tag {
  display: inline-block;
  padding: 1mm 2mm;
  background-color: #2d3748;
  color: white;
  border-radius: 1.5mm;
  font-size: 8.5pt;
  font-weight: 500;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background-color: #667eea;
  transform: translateY(-0.5pt);
  box-shadow: 0 1mm 2mm rgba(102, 126, 234, 0.3);
}

.project {
  margin-bottom: 7mm;
}

.project-item p {
  font-size: 9pt;
  color: #333;
  font-weight: 600;
  margin: 0 0 1.5mm 0;
}

/* Section Formation */
.education {
  margin-bottom: 7mm;
}

.education-item {
  position: relative;
  margin-bottom: 5mm;
}

.timeline-marker-small {
  position: absolute;
  left: 0;
  top: 1.5mm;
  width: 2.5mm;
  height: 2.5mm;
  background-color: #667eea;
  border-radius: 50%;
}

.education-item h4 {
  font-size: 9pt;
  color: #333;
  font-weight: 600;
  margin: 0 0 1.5mm 0;
}

.school {
  font-size: 8.5pt;
  color: #667eea;
  font-weight: 500;
  margin: 0 0 1.5mm 0;
}

.compact-description {
  font-size: 9pt;
  color: #666;
  line-height: 1.3;
  margin: 2mm 0 0 0;
}

/* Section Langues */
.languages {
  margin-bottom: 7mm;
}

.language-item {
  display: flex;
  align-items: center;
  padding: 2.5mm 0;
  font-size: 9pt;
}

.language-text {
  color: #666 !important;
}

.level {
  color: #666;
  padding: 1mm 3mm;

  font-size: 7pt;
  /* font-weight: 600; */
}

/* Section Centres d'intérêt */
.interests-list {
  display: flex;

  list-style: none;
  margin: 0;
  padding: 0;
  color: #666;
}

.interests-list li {
  padding-right: 2mm;
  padding-left: 2mm;
  border-right: 0.3mm solid #e0e0e0;
  font-size: 9pt;
}

.interests-list li:last-child {
  border-right: none;
}
</style>
