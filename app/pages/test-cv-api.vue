<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">CV API Test</h1>

    <UButton color="primary" @click="testCVData">
      Test CV Data Fetching
    </UButton>

    <div v-if="loading" class="mt-4">
      <p>Loading...</p>
    </div>

    <div v-if="error" class="mt-4 text-red-600">
      <p>Error: {{ error }}</p>
    </div>

    <div v-if="cvData" class="mt-6">
      <h2 class="text-xl font-semibold mb-4">CV Data Successfully Loaded</h2>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 class="font-semibold">Personal Info</h3>
          <p>Name: {{ cvData.personalInfo.firstName }} {{ cvData.personalInfo.lastName }}</p>
          <p>Email: {{ cvData.personalInfo.email }}</p>
        </div>
        <div>
          <h3 class="font-semibold">Data Counts</h3>
          <p>Work Experience: {{ cvData.workExperience.length }}</p>
          <p>Education: {{ cvData.education.length }}</p>
          <p>Skills: {{ cvData.skills.length }}</p>
        </div>
      </div>

      <!-- CV Template Test -->
      <UCard class="mt-6">
        <template #header>
          <h3 class="text-lg font-semibold">CV Template Rendering Test</h3>
        </template>

        <div v-if="transformedData" class="border p-4">
          <CVTemplate :cv-data="transformedData" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import CVTemplate from '~/components/templates/CVTemplate.vue'
import type { CVData as APICVData } from '~/server/utils/validation/schemas'
import type { CVData as TemplateCVData } from '~/components/templates/mockCVData'

const loading = ref(false)
const error = ref('')
const cvData = ref<APICVData | null>(null)

const testCVData = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('🚀 Testing CV API...')
    const response = await $fetch('/api/cv')

    if (response.success && response.data) {
      cvData.value = response.data
      console.log('✅ CV Data fetched:', response.data)
    } else {
      throw new Error(response.error || 'Failed to fetch CV data')
    }
  } catch (err) {
    console.error('❌ CV API Error:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

const transformedData = computed((): TemplateCVData | null => {
  if (!cvData.value) return null

  const apiData = cvData.value
  console.log('🔄 Transforming data for template...')

  try {
    const transformed = {
      personalInfo: {
        name: `${apiData.personalInfo.firstName} ${apiData.personalInfo.lastName}`,
        title: apiData.personalInfo.summary || 'Professional',
        email: apiData.personalInfo.email,
        phone: apiData.personalInfo.phone || '',
        location: apiData.personalInfo.address ?
          `${apiData.personalInfo.address.city}, ${apiData.personalInfo.address.country}` : '',
        linkedin: apiData.personalInfo.linkedin,
        github: apiData.personalInfo.github
      },
      summary: apiData.personalInfo.summary || '',
      experiences: apiData.workExperience.map(exp => ({
        id: exp.id,
        title: exp.position,
        company: exp.company,
        location: exp.location || '',
        startDate: exp.startDate ? new Date(exp.startDate).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }) : '',
        endDate: exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }) : exp.isCurrentPosition ? 'Présent' : '',
        description: exp.description,
        bullets: exp.achievements || [],
        skills: exp.technologies || []
      })),
      education: apiData.education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        institution: edu.institution,
        year: edu.endDate ? new Date(edu.endDate).getFullYear().toString() : new Date(edu.startDate).getFullYear().toString(),
        description: edu.description || ''
      })),
      skills: {
        technical: apiData.skills.filter(s => s.category === 'technical').map(s => s.name),
        languages: apiData.languages?.map(l => `${l.name} (${l.level})`) || [],
        soft: apiData.skills.filter(s => s.category === 'soft').map(s => s.name)
      },
      certifications: apiData.certifications?.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : undefined
      })),
      projects: apiData.projects?.map(proj => ({
        id: proj.id,
        name: proj.name,
        description: proj.description,
        technologies: proj.technologies,
        url: proj.url,
        date: proj.endDate ? new Date(proj.endDate).getFullYear().toString() : undefined
      }))
    }

    console.log('✅ Data transformation successful')
    return transformed
  } catch (transformError) {
    console.error('❌ Data transformation error:', transformError)
    return null
  }
})
</script>