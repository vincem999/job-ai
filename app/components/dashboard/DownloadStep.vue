<template>
  <div class="space-y-6">
    <!-- Header ATS Score -->
    <div v-if="atsData || _fakeATSData" class="mb-6">
      <ATSScoreDisplay
        :score="(atsData || _fakeATSData).score"
        :adaptation-needed="(atsData || _fakeATSData).adaptationNeeded"
      />
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <ATSKeywordInsights
          v-if="atsData || _fakeATSData"
          :keywords="(atsData || _fakeATSData).keywords"
        />
      </div>
      <div>
        <ATSSuggestions
          v-if="atsData || _fakeATSData"
          :suggestions="(atsData || _fakeATSData).suggestions"
        />
      </div>
    </div>

    <!-- Download Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          <UIcon
            name="i-heroicons-arrow-down-tray"
            class="w-5 h-5 inline mr-2"
          />
          Télécharger les documents
        </h3>

        <!-- Toggle entre Preview et Edition -->
        <div class="flex gap-4 mb-4">
          <UButton
            :variant="viewMode === 'preview' ? 'solid' : 'outline'"
            icon="i-heroicons-eye"
            @click="viewMode = 'preview'"
          >
            Aperçu
          </UButton>
          <UButton
            :variant="viewMode === 'edit' ? 'solid' : 'outline'"
            icon="i-heroicons-pencil"
            @click="viewMode = 'edit'"
          >
            Modifier expériences
          </UButton>
          <UButton
            :loading="isDownloadingCV"
            :disabled="isDownloadingCV"
            class="download-btn"
            icon="i-heroicons-arrow-down-tray"
            @click="downloadCV"
          >
            {{ isDownloadingCV ? "Téléchargement..." : "Télécharger CV" }}
          </UButton>
        </div>
      </div>

      <!-- Layout 2 colonnes -->
      <div class="grid sm:grid-flow-col auto-cols-fr gap-4">
        <!-- Colonne gauche: ATS Insights -->
        <div v-if="showEditor && editableCvData" class="">
          <ExperienceEditor
            :cv-data="editableCvData"
            @update:cv-data="updateCV"
          />
        </div>

        <!-- CV Preview -->
        <div>
          <div class="sticky" style="width: 100%">
            <CVTemplate :cv-data="editableCvData" ref="cvTemplate" />
          </div>
        </div>
      </div>

      <!-- Actions footer -->
      <div class="flex justify-between items-center mt-8">
        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="$emit('back')"
          >
            Retour à l'analyse
          </UButton>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
  </div>
</template>

<script setup lang="ts">
import CVTemplate from "~/components/templates/CVTemplate.vue"
import ExperienceEditor from "~/components/dashboard/ExperienceEditor.vue"
import ATSScoreDisplay from "~/components/dashboard/ATSScoreDisplay.vue"
import ATSKeywordInsights from "~/components/dashboard/ATSKeywordInsights.vue"
import ATSSuggestions from "~/components/dashboard/ATSSuggestions.vue"
import type { AdaptedCV } from "../../../types/cv"
import type { ATSOptimization, JobAnalysisResponse } from "../../../types/ats"
import type { CoverLetter, ExportFormat } from "../../../types/api"

interface Props {
  cvData?: AdaptedCV
  letterData?: CoverLetter
  jobAnalysis?: JobAnalysisResponse
  atsData?: ATSOptimization
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  restart: []
}>()

const { generatePDF } = usePDFExport()

const cvTemplate = ref(null)
const viewMode = ref<"preview" | "edit">("preview")
const showEditor = ref(false)
const isDownloadingCV = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Données factices pour le développement UX/UI
const _fakeCvData: AdaptedCV = {
  id: "fake-cv-123",
  originalCVId: "original-123",
  jobAnalysisId: "job-analysis-456",
  adaptations: [
    {
      section: "workExperience" as any,
      field: "description",
      originalValue: "Développement web généraliste",
      adaptedValue: "Développement full-stack avec expertise React/Node.js",
      reason: "Adaptation aux compétences recherchées",
      confidence: 0.9,
    },
  ],
  matchScore: 85,
  adaptedAt: new Date(),
  personalInfo: {
    firstName: "Marie",
    lastName: "Dupont",
    title: "Développeuse Full-Stack Senior",
    email: "marie.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    linkedin: "https://linkedin.com/in/marie-dupont",
    github: "https://github.com/marie-dupont",
  },
  summary:
    "Développeuse Full-Stack passionnée avec 5+ années d'expérience dans la création d'applications web modernes. Expertise en React, Node.js, et architecture cloud. Proven track record de livraison de produits performants dans des environnements agiles.",
  workExperiences: [
    {
      id: "exp-1",
      title: "Senior Full-Stack Developer",
      company: "TechCorp",
      location: "Paris, France",
      startDate: "2022-01",
      endDate: "2024-12",
      description: "Lead développement d'applications web complexes",
      bullets: [
        "Développement d'une plateforme SaaS utilisée par 10k+ utilisateurs",
        "Réduction des temps de chargement de 40% via optimisation React",
        "Mise en place d'une architecture microservices avec Docker",
        "Mentoring d'une équipe de 3 développeurs juniors",
      ],
    },
    {
      id: "exp-2",
      title: "Front-End Developer",
      company: "StartupInnovante",
      location: "Lyon, France",
      startDate: "2020-03",
      endDate: "2021-12",
      description: "Développement d'interfaces utilisateur modernes",
      bullets: [
        "Création d'interfaces réactives avec React et TypeScript",
        "Intégration d'APIs REST et GraphQL",
        "Amélioration de l'accessibilité (WCAG 2.1 AA)",
        "Tests automatisés avec Jest et Cypress",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Master en Informatique",
      institution: "École Polytechnique",
      year: "2020",
      location: "Paris, France",
      description: "Spécialisation en génie logiciel et systèmes distribués",
    },
  ],
  skills: {
    technical: [
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      "Docker",
      "AWS",
      "PostgreSQL",
    ],
    languages: [
      "Français (natif)",
      "Anglais (courant)",
      "Espagnol (intermédiaire)",
    ],
    soft: [
      "Leadership",
      "Communication",
      "Résolution de problèmes",
      "Travail en équipe",
    ],
  },
  projects: [
    {
      id: "proj-1",
      name: "EcoTracker",
      description: "Application mobile de suivi d'empreinte carbone",
      technologies: ["React Native", "Node.js", "MongoDB"],
      url: "https://github.com/marie-dupont/ecotracker",
      date: "2023",
    },
    {
      id: "proj-2",
      name: "TaskFlow",
      description: "Outil de gestion de projets en temps réel",
      technologies: ["Vue.js", "Express", "Socket.io"],
      date: "2022",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-06",
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "2023-03",
    },
  ],
}

const _fakeJobAnalysis = {
  requiredSkills: ["React", "Node.js", "TypeScript", "AWS", "Git", "Agile"],
  preferredSkills: ["Docker", "Kubernetes", "CI/CD", "GraphQL", "Jest"],
  responsibilities: [
    "Développer des fonctionnalités front-end et back-end",
    "Collaborer avec l'équipe produit et design",
    "Maintenir et améliorer l'architecture technique",
    "Participer aux code reviews et mentoring",
  ],
  requirements: [
    "5+ années d'expérience en développement web",
    "Maîtrise de React et Node.js",
    "Expérience avec les architectures cloud",
    "Compétences en méthodologies agiles",
  ],
  experienceLevel: "Senior" as const,
  industryKeywords: [
    "SaaS",
    "Fintech",
    "Scalabilité",
    "Performance",
    "UX/UI",
    "API REST",
  ],
}

const _fakeATSData = {
  score: 87,
  adaptationNeeded: true,
  keywords: {
    matched: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Agile"],
    missing: ["Kubernetes", "GraphQL", "CI/CD", "Jest", "Microservices"],
    recommended: ["DevOps", "TDD", "Scrum Master", "Product Management"],
    priority: ["Kubernetes", "GraphQL", "CI/CD"],
  },
  suggestions: [
    "Ajouter plus de détails sur votre expérience Kubernetes dans les projets",
    "Mettre en avant votre expérience avec GraphQL si applicable",
    "Détailler votre approche des méthodologies CI/CD",
    "Inclure des métriques quantifiées sur vos réalisations",
    "Ajouter des mots-clés liés à l'écosystème DevOps moderne",
  ],
}

const _fakeCoverLetter = {
  id: "letter-123",
  jobAnalysisId: "job-analysis-456",
  adaptedCVId: "fake-cv-123",
  content: `Madame, Monsieur,

Je vous écris pour exprimer mon vif intérêt pour le poste de Senior Full-Stack Developer au sein de votre équipe. Avec plus de 5 années d'expérience dans le développement d'applications web modernes, je suis convaincue que mon profil correspond parfaitement à vos besoins.

Mon expertise technique couvre l'ensemble de la stack que vous recherchez : React, Node.js, et TypeScript. Chez TechCorp, j'ai dirigé le développement d'une plateforme SaaS servrant plus de 10 000 utilisateurs, en réduisant les temps de chargement de 40% grâce à des optimisations React avancées.

Ce qui me passionne particulièrement dans votre offre, c'est l'opportunité de travailler sur des architectures cloud modernes. Mon expérience avec AWS et Docker, notamment la mise en place d'une architecture microservices, m'a permis de développer une vision globale des enjeux de scalabilité et de performance.

Je serais ravie d'échanger avec vous sur la manière dont mon expérience pourrait contribuer aux objectifs de votre équipe.

Cordialement,
Marie Dupont`,
  structure: {
    header: { type: "header", content: "En-tête professionnel" },
    introduction: { type: "intro", content: "Présentation et motivation" },
    body: [
      {
        type: "experience",
        content: "Mise en avant de l'expérience technique",
      },
      { type: "skills", content: "Compétences spécifiques au poste" },
    ],
    closing: { type: "closing", content: "Formule de politesse" },
    signature: { type: "signature", content: "Signature" },
  },
  tone: "professional" as const,
  length: "medium" as const,
  keyPoints: [
    "5+ années d'expérience",
    "Expertise React/Node.js/TypeScript",
    "Architecture cloud et microservices",
    "Réalisations quantifiées",
  ],
  generatedAt: new Date(),
  version: "1.0",
}

const editableCvData = ref<AdaptedCV | undefined>(
  props.cvData ? { ...props.cvData } : _fakeCvData
)

// Watch pour synchroniser les props
watch(
  () => props.cvData,
  (newData) => {
    if (newData) {
      editableCvData.value = { ...newData }
    }
  },
  { deep: true, immediate: true }
)

const downloadCV = async () => {
  if (!props.cvData) return

  isDownloadingCV.value = true
  errorMessage.value = null

  try {
    // Use client-side PDF generation with html2pdf.js
    const pdfBlob = await generatePDF(props.cvData)

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

    successMessage.value = `CV téléchargé avec succès`
  } catch (error) {
    console.error("Erreur lors du téléchargement du CV:", error)
    errorMessage.value =
      "Erreur lors du téléchargement du CV. Veuillez réessayer."
  } finally {
    isDownloadingCV.value = false
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

// Mise à jour du CV
const updateCV = (updatedCV: AdaptedCV) => {
  editableCvData.value = updatedCV
}

// Synchroniser showEditor avec viewMode pour compatibilité
watch(viewMode, (newMode) => {
  showEditor.value = newMode === "edit"
})

watch(showEditor, (show) => {
  viewMode.value = show ? "edit" : "preview"
})
</script>
