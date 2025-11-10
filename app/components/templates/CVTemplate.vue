<template>
  <div class="cv-template cv-container w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
    <!-- Header Section -->
    <UCard class="cv-header shadow-lg" variant="subtle">
      <template #header>
        <div class="personal-info">
          <h1 class="name cv-name">{{ cvData.personalInfo.name }}</h1>
          <h2 class="title cv-title">{{ cvData.personalInfo.title }}</h2>
        </div>
      </template>

      <div class="contact-info cv-contact-info flex flex-wrap gap-2 md:gap-3">
        <UBadge variant="outline" color="neutral" size="sm" icon="i-lucide-mail" class="text-xs md:text-sm break-all">
          {{ cvData.personalInfo.email }}
        </UBadge>

        <UBadge variant="outline" color="neutral" size="sm" icon="i-lucide-phone" class="text-xs md:text-sm">
          {{ cvData.personalInfo.phone }}
        </UBadge>

        <UBadge variant="outline" color="neutral" size="sm" icon="i-lucide-map-pin" class="text-xs md:text-sm">
          {{ cvData.personalInfo.location }}
        </UBadge>

        <UBadge v-if="cvData.personalInfo.linkedin" variant="outline" color="primary" size="sm" icon="i-lucide-linkedin" class="text-xs md:text-sm break-all">
          {{ cvData.personalInfo.linkedin }}
        </UBadge>

        <UBadge v-if="cvData.personalInfo.github" variant="outline" color="neutral" size="sm" icon="i-lucide-github" class="text-xs md:text-sm break-all">
          {{ cvData.personalInfo.github }}
        </UBadge>
      </div>
    </UCard>

    <!-- Summary Section -->
    <UCard class="cv-section summary-section shadow-md hover:shadow-lg transition-shadow duration-200" variant="outline">
      <template #header>
        <h3 class="section-title">Résumé Professionnel</h3>
      </template>

      <p class="summary-text">{{ cvData.summary }}</p>
    </UCard>

    <!-- Experience Section -->
    <UCard class="cv-section experience-section shadow-md hover:shadow-lg transition-shadow duration-200" variant="outline">
      <template #header>
        <h3 class="section-title">Expérience Professionnelle</h3>
      </template>

      <div class="space-y-6">
        <UCard
          v-for="(experience, index) in cvData.experiences"
          :key="experience.id || index"
          class="experience-item cv-experience-item hover:shadow-md transition-shadow duration-200"
          variant="subtle"
        >
          <template #header>
            <div class="experience-header">
              <h4 class="experience-title cv-job-title text-lg md:text-xl font-semibold">{{ experience.title }}</h4>
              <div class="experience-meta flex flex-wrap gap-2 md:gap-3 mt-2">
                <UBadge variant="soft" color="primary" size="sm" class="text-xs md:text-sm cv-company">
                  {{ experience.company }}
                </UBadge>
                <UBadge variant="outline" color="neutral" size="sm" icon="i-lucide-map-pin" class="text-xs md:text-sm">
                  {{ experience.location }}
                </UBadge>
                <UBadge variant="outline" color="neutral" size="sm" icon="i-lucide-calendar" class="text-xs md:text-sm cv-date-range">
                  {{ experience.startDate }} - {{ experience.endDate }}
                </UBadge>
              </div>
            </div>
          </template>

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
              <div class="mb-2">
                <strong>Technologies utilisées:</strong>
              </div>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="skill in experience.skills"
                  :key="skill"
                  variant="solid"
                  color="primary"
                  size="xs"
                >
                  {{ skill }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>

    <!-- Education Section -->
    <UCard class="cv-section education-section shadow-md hover:shadow-lg transition-shadow duration-200" variant="outline">
      <template #header>
        <h3 class="section-title">Formation</h3>
      </template>

      <div class="space-y-4">
        <UCard
          v-for="(education, index) in cvData.education"
          :key="education.id || index"
          class="education-item hover:shadow-md transition-shadow duration-200"
          variant="subtle"
        >
          <template #header>
            <div class="education-header">
              <h4 class="education-degree text-lg md:text-xl font-semibold">{{ education.degree }}</h4>
              <div class="education-meta flex flex-wrap gap-2 md:gap-3 mt-2">
                <UBadge variant="soft" color="primary" size="sm" icon="i-lucide-graduation-cap" class="text-xs md:text-sm">
                  {{ education.institution }}
                </UBadge>
                <UBadge variant="outline" color="neutral" size="sm" icon="i-lucide-calendar" class="text-xs md:text-sm">
                  {{ education.year }}
                </UBadge>
              </div>
            </div>
          </template>

          <p v-if="education.description" class="education-description">
            {{ education.description }}
          </p>
        </UCard>
      </div>
    </UCard>

    <!-- Skills Section -->
    <UCard class="cv-section skills-section shadow-md hover:shadow-lg transition-shadow duration-200" variant="outline">
      <template #header>
        <h3 class="section-title">Compétences</h3>
      </template>

      <div class="space-y-6">
        <div v-if="cvData.skills.technical && cvData.skills.technical.length > 0" class="skill-category">
          <h4 class="skill-category-title">
            <UBadge variant="soft" color="primary" icon="i-lucide-code" size="md">
              Compétences Techniques
            </UBadge>
          </h4>
          <div class="skills-grid flex flex-wrap gap-2 md:gap-3">
            <UBadge
              v-for="(skill, index) in cvData.skills.technical"
              :key="index"
              variant="outline"
              color="primary"
              size="sm"
              class="text-xs md:text-sm"
            >
              {{ skill }}
            </UBadge>
          </div>
        </div>

        <div v-if="cvData.skills.languages && cvData.skills.languages.length > 0" class="skill-category">
          <h4 class="skill-category-title">
            <UBadge variant="soft" color="neutral" icon="i-lucide-globe" size="md">
              Langues
            </UBadge>
          </h4>
          <div class="skills-grid flex flex-wrap gap-2 md:gap-3">
            <UBadge
              v-for="(language, index) in cvData.skills.languages"
              :key="index"
              variant="outline"
              color="neutral"
              size="sm"
              class="text-xs md:text-sm"
            >
              {{ language }}
            </UBadge>
          </div>
        </div>

        <div v-if="cvData.skills.soft && cvData.skills.soft.length > 0" class="skill-category">
          <h4 class="skill-category-title">
            <UBadge variant="soft" color="neutral" icon="i-lucide-users" size="md">
              Compétences Transversales
            </UBadge>
          </h4>
          <div class="skills-grid flex flex-wrap gap-2 md:gap-3">
            <UBadge
              v-for="(soft, index) in cvData.skills.soft"
              :key="index"
              variant="outline"
              color="neutral"
              size="sm"
              class="text-xs md:text-sm"
            >
              {{ soft }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Certifications Section (Optional) -->
    <UCard v-if="cvData.certifications && cvData.certifications.length > 0" class="cv-section certifications-section shadow-md hover:shadow-lg transition-shadow duration-200" variant="outline">
      <template #header>
        <h3 class="section-title">Certifications</h3>
      </template>

      <div class="space-y-4">
        <UCard
          v-for="(certification, index) in cvData.certifications"
          :key="certification.id || index"
          class="certification-item hover:shadow-md transition-shadow duration-200"
          variant="subtle"
        >
          <template #header>
            <div class="certification-header">
              <h4 class="certification-name text-lg md:text-xl font-semibold">{{ certification.name }}</h4>
              <div class="certification-meta flex flex-wrap gap-2 md:gap-3 mt-2">
                <UBadge variant="soft" color="primary" size="sm" icon="i-lucide-award" class="text-xs md:text-sm">
                  {{ certification.issuer }}
                </UBadge>
                <UBadge v-if="certification.date" variant="outline" color="neutral" size="sm" icon="i-lucide-calendar" class="text-xs md:text-sm">
                  {{ certification.date }}
                </UBadge>
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </UCard>

    <!-- Projects Section (Optional) -->
    <UCard v-if="cvData.projects && cvData.projects.length > 0" class="cv-section projects-section shadow-md hover:shadow-lg transition-shadow duration-200" variant="outline">
      <template #header>
        <h3 class="section-title">Projets</h3>
      </template>

      <div class="space-y-4">
        <UCard
          v-for="(project, index) in cvData.projects"
          :key="project.id || index"
          class="project-item hover:shadow-md transition-shadow duration-200"
          variant="subtle"
        >
          <template #header>
            <div class="project-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <h4 class="project-name text-lg md:text-xl font-semibold">{{ project.name }}</h4>
              <UBadge v-if="project.date" variant="outline" color="neutral" size="sm" icon="i-lucide-calendar" class="text-xs md:text-sm self-start">
                {{ project.date }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <p v-if="project.description" class="project-description">
              {{ project.description }}
            </p>

            <div v-if="project.technologies && project.technologies.length > 0" class="project-technologies">
              <div class="mb-2">
                <strong>Technologies:</strong>
              </div>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="tech in project.technologies"
                  :key="tech"
                  variant="solid"
                  color="primary"
                  size="xs"
                >
                  {{ tech }}
                </UBadge>
              </div>
            </div>

            <div v-if="project.url" class="project-url">
              <UBadge variant="outline" color="primary" size="sm" icon="i-lucide-external-link">
                {{ project.url }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CVData } from './mockCVData'

// Define props
defineProps<{
  cvData: CVData
}>()
</script>

<style scoped>
@reference "~/assets/css/main.css";

/* Use Tailwind utilities with scoped override capability */
.cv-template {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  @apply bg-linear-to-br from-gray-50 to-white text-gray-800 leading-relaxed;
}

.name {
  @apply text-3xl md:text-4xl font-bold mb-2;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title {
  @apply text-lg md:text-xl font-medium text-gray-600 mb-4;
}

.section-title {
  @apply text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2;
}

.summary-text {
  @apply text-sm md:text-base leading-relaxed text-justify;
}

.description-text {
  @apply text-sm md:text-base italic text-gray-700 mb-3;
}

.education-description,
.project-description {
  @apply text-sm md:text-base text-gray-700;
}

.bullets-list {
  @apply ml-5 mb-3 space-y-1;
}

.bullet-item {
  @apply text-sm md:text-base leading-relaxed;
}

.skill-category {
  @apply mb-6;
}

.skill-category-title {
  @apply mb-3;
}

/* Print optimizations */
@media print {
  .cv-template {
    @apply p-6 text-xs max-w-none;
    font-size: 11pt;
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

  .cv-section,
  .experience-item,
  .education-item,
  .certification-item,
  .project-item {
    page-break-inside: avoid;
  }
}
</style>