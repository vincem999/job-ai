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
          class="download-btn ml-4"
          icon="i-heroicons-arrow-down-tray"
          @click="downloadCV"
        >
          {{ "Télécharger CV" }}
        </UButton>
      </div>

      <CVTemplate :cv-data="mockCVData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CVTemplate from "~/components/templates/CVTemplate.vue"
// import type { AdaptedCV } from "../../types/cv"
import type { ExportFormat } from "~~/types/api"
import { mockCVData } from "~/components/templates/mockCVData"

// Use the imported mockCVData directly

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
    const pdfBlob = await generatePDF(mockCVData)

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

<style scoped></style>
