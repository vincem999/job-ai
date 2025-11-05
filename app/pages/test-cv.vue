<template>
  <div class="test-cv-page">
    <div class="test-controls">
      <h1>Test du Template CV</h1>
      <p>Cette page permet de tester le rendu du template CV avec des données mock.</p>
      <div class="actions">
        <button class="btn btn-primary" @click="printPreview">
          Aperçu d'impression
        </button>
        <button class="btn btn-secondary" @click="toggleData">
          {{ showMinimalData ? 'Données complètes' : 'Données minimales' }}
        </button>
      </div>
    </div>

    <div class="cv-preview">
      <CVTemplate :cv-data="currentCVData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CVTemplate from '~/components/templates/CVTemplate.vue'
import { mockCVData, type CVData } from '~/components/templates/mockCVData'

// État pour basculer entre données complètes et minimales
const showMinimalData = ref(false)

// Données CV minimales pour tester les cas de données manquantes
const minimalCVData: CVData = {
  personalInfo: {
    name: "Marie Martin",
    title: "Développeuse Junior",
    email: "marie.martin@email.com",
    phone: "+33 6 98 76 54 32",
    location: "Toulouse, France"
    // linkedin et github sont optionnels, donc omis
  },
  summary: "Développeuse passionnée et motivée, récemment diplômée, à la recherche de nouvelles opportunités pour développer mes compétences.",
  experiences: [
    {
      id: "exp-1",
      title: "Stage Développeur Web",
      company: "Agence Locale",
      location: "Toulouse, France",
      startDate: "2023-04",
      endDate: "2023-07",
      description: "Stage de fin d'études en développement web.",
      bullets: [
        "Développement de sites web responsive",
        "Collaboration avec l'équipe design"
      ],
      skills: ["HTML", "CSS", "JavaScript"]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "BTS Services Informatiques aux Organisations",
      institution: "Lycée Technique de Toulouse",
      year: "2023"
    }
  ],
  skills: {
    technical: ["HTML5", "CSS3", "JavaScript", "Git"],
    languages: ["Français (natif)", "Anglais (scolaire)"],
    soft: ["Apprentissage rapide", "Travail en équipe", "Motivation"]
  }
  // certifications et projects sont optionnels, donc omis
}

// Données CV actuelles basées sur l'état
const currentCVData = computed(() => {
  return showMinimalData.value ? minimalCVData : mockCVData
})

// Méthodes
const printPreview = () => {
  window.print()
}

const toggleData = () => {
  showMinimalData.value = !showMinimalData.value
}

// Métadonnées de la page
useHead({
  title: 'Test CV Template - Job Finder',
  meta: [
    { name: 'description', content: 'Page de test pour le template CV' }
  ]
})
</script>

<style scoped>
.test-cv-page {
  min-height: 100vh;
  background: #f9fafb;
}

.test-controls {
  background: white;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.test-controls h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.test-controls p {
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.cv-preview {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

/* Print styles */
@media print {
  .test-controls {
    display: none;
  }

  .cv-preview {
    padding: 0;
  }

  .test-cv-page {
    background: white;
  }
}
</style>