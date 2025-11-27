<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          CV Vincent Monneger
        </h1>
        <UBadge variant="soft" color="primary" size="lg">
          Template avec données réelles
        </UBadge>
        <UButton
          class="download-btn"
          icon="i-heroicons-arrow-down-tray"
          @click="downloadCV"
        >
          {{ "Télécharger CV" }}
        </UButton>
      </div>

      <CVTemplate :cv-data="cvData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CVTemplate from "~/components/templates/CVTemplate.vue"
import type { AdaptedCV } from "../../types/cv"
import type { ExportFormat } from "~~/types/api"

// Données du CV mises à jour avec les vraies informations
const cvData = ref<AdaptedCV>({
  id: "cv-vincent-1",
  personalInfo: {
    name: "Vincent MONNEGER",
    title: "Développeur Front-end Vue.js",
    email: "vincentmonneger@gmail.com",
    phone: "06 51 89 31 49",
    location: "Louveciennes, France",
    linkedin: "linkedin.com/in/vincent-monneger",
    github: "github.com/vincentmonneger",
    photo: "/profile.jpg",
  },
  summary:
    "Développeur Front-end passionné avec 5+ années d'expérience en Vue.js, TypeScript et développement d'applications web modernes. Expert en architecture frontend et optimisation des performances.",
  experiences: [
    {
      id: "exp1",
      title: "Lead Developer Front-end",
      company: "TechCorp",
      location: "Paris, France",
      startDate: "2021",
      endDate: "Présent",
      description: "Lead technique sur des projets Vue.js complexes",
      bullets: [
        "Architecture et développement d'applications Vue.js/Nuxt.js",
        "Encadrement d'équipe de 4 développeurs",
        "Optimisation des performances et SEO",
        "Mise en place de CI/CD et bonnes pratiques",
      ],
      skills: ["Vue.js", "Nuxt.js", "TypeScript", "Leadership"],
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "Master en Informatique",
      institution: "Université Paris-Saclay",
      year: "2018",
      location: "Paris, France",
    },
  ],
  skills: {
    technical: [
      "Vue.js",
      "Nuxt.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
    ],
    languages: ["Français", "Anglais"],
    soft: ["Leadership", "Communication", "Résolution de problèmes"],
  },
  // Propriétés AdaptedCV
  originalCVId: "original-cv-1",
  jobAnalysisId: "job-analysis-1",
  adaptations: [],
  matchScore: 95,
  adaptedAt: new Date(),
})

// Meta pour la page
useHead({
  title: "CV Vincent Monneger",
  meta: [
    {
      name: "description",
      content: "CV de Vincent Monneger - Développeur Front-end Vue.js",
    },
  ],
})

const { generatePDF } = usePDFExport()

const downloadCV = async () => {
  try {
    // Use client-side PDF generation with html2pdf.js
    const pdfBlob = await generatePDF(cvData.value)

    // Create download result manually
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `CV_${timestamp}.pdf`
    const downloadUrl = URL.createObjectURL(pdfBlob)

    const result = {
      downloadUrl,
      filename,
      format: "pdf" as ExportFormat,
      size: pdfBlob.size,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      metadata: {
        pages: 1, // Estimate
        wordCount: 500, // Estimate
        generatedAt: new Date(),
      },
    }

    downloadFile(result.downloadUrl, result.filename)
  } catch (error) {
    console.error("Erreur lors du téléchargement du CV:", error)
  }
}

function downloadFile(downloadUrl: string, filename: string): void {
  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the object URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl)
  }, 1000)
}
</script>
