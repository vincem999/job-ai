<template>
  <div class="letter-template">
    <!-- Header Section -->
    <header class="letter-header">
      <div class="sender-info">
        <h1 class="sender-name">{{ letterData.senderInfo.name }}</h1>
        <div class="sender-contact">
          <p class="contact-line">{{ letterData.senderInfo.address }}</p>
          <p class="contact-line">{{ letterData.senderInfo.email }}</p>
          <p class="contact-line">{{ letterData.senderInfo.phone }}</p>
        </div>
      </div>

      <div class="recipient-info">
        <div class="date">{{ formatDate(letterData.date) }}</div>
        <div class="recipient-details">
          <p class="recipient-name">{{ letterData.recipientInfo.name }}</p>
          <p class="company-name">{{ letterData.recipientInfo.company }}</p>
          <p v-if="letterData.recipientInfo.address" class="recipient-address">
            {{ letterData.recipientInfo.address }}
          </p>
        </div>
      </div>
    </header>

    <!-- Subject Line -->
    <div class="subject-section">
      <p class="subject-label">Objet :</p>
      <p class="subject-content">{{ letterData.subject }}</p>
    </div>

    <!-- Salutation -->
    <div class="salutation-section">
      <p class="salutation">{{ letterData.salutation }},</p>
    </div>

    <!-- Letter Body -->
    <div class="letter-body">
      <!-- Opening Paragraph -->
      <div class="letter-paragraph">
        <p class="paragraph-text">{{ letterData.content.opening }}</p>
      </div>

      <!-- Main Content Paragraphs -->
      <div
        v-for="(paragraph, index) in letterData.content.body"
        :key="`body-${index}`"
        class="letter-paragraph"
      >
        <p class="paragraph-text">{{ paragraph }}</p>
      </div>

      <!-- Closing Paragraph -->
      <div class="letter-paragraph">
        <p class="paragraph-text">{{ letterData.content.closing }}</p>
      </div>
    </div>

    <!-- Closing Section -->
    <div class="closing-section">
      <p class="closing-phrase">{{ letterData.closing.phrase }}</p>
      <div class="signature-space">
        <div class="signature-line" />
        <p class="signature-name">{{ letterData.senderInfo.name }}</p>
      </div>
    </div>

    <!-- Attachments (if any) -->
    <div v-if="letterData.attachments?.length" class="attachments-section">
      <p class="attachments-label">Pièces jointes :</p>
      <ul class="attachments-list">
        <li
          v-for="attachment in letterData.attachments"
          :key="attachment"
          class="attachment-item"
        >
          {{ attachment }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SenderInfo {
  name: string
  address: string
  email: string
  phone: string
}

interface RecipientInfo {
  name: string
  company: string
  address?: string
}

interface LetterContent {
  opening: string
  body: string[]
  closing: string
}

interface ClosingInfo {
  phrase: string
}

interface LetterData {
  senderInfo: SenderInfo
  recipientInfo: RecipientInfo
  date: string | Date
  subject: string
  salutation: string
  content: LetterContent
  closing: ClosingInfo
  attachments?: string[]
}

interface Props {
  letterData: LetterData
}

defineProps<Props>()

// Utility function to format date
const formatDate = (date: string | Date): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return date.toLocaleDateString('fr-FR', options)
}
</script>

<style scoped>
.letter-template {
  @apply max-w-4xl mx-auto bg-white p-8 shadow-sm font-serif text-gray-900;
  font-family: 'Times New Roman', Times, serif;
  line-height: 1.6;
}

/* Header Section */
.letter-header {
  @apply flex justify-between items-start mb-8 pb-6 border-b border-gray-200;
}

.sender-info .sender-name {
  @apply text-xl font-bold mb-2 text-gray-800;
}

.sender-contact .contact-line {
  @apply text-sm text-gray-600 mb-1;
}

.recipient-info {
  @apply text-right;
}

.date {
  @apply text-sm text-gray-600 mb-4;
}

.recipient-details .recipient-name {
  @apply font-semibold text-gray-800;
}

.recipient-details .company-name {
  @apply font-medium text-gray-700;
}

.recipient-details .recipient-address {
  @apply text-sm text-gray-600 mt-1;
}

/* Subject Section */
.subject-section {
  @apply mb-6 flex items-baseline gap-2;
}

.subject-label {
  @apply font-semibold text-gray-800;
}

.subject-content {
  @apply font-medium text-gray-700 underline;
}

/* Salutation */
.salutation-section {
  @apply mb-4;
}

.salutation {
  @apply text-gray-800;
}

/* Letter Body */
.letter-body {
  @apply space-y-4 mb-6;
}

.letter-paragraph {
  @apply text-justify;
}

.paragraph-text {
  @apply text-gray-700 leading-relaxed;
  text-indent: 1.5rem;
}

/* Closing Section */
.closing-section {
  @apply mt-8 text-right;
}

.closing-phrase {
  @apply text-gray-800 mb-12;
}

.signature-space {
  @apply flex flex-col items-end;
}

.signature-line {
  @apply w-48 h-px bg-gray-300 mb-2;
}

.signature-name {
  @apply font-medium text-gray-800;
}

/* Attachments */
.attachments-section {
  @apply mt-8 pt-6 border-t border-gray-200;
}

.attachments-label {
  @apply font-semibold text-gray-800 mb-2;
}

.attachments-list {
  @apply list-disc list-inside space-y-1;
}

.attachment-item {
  @apply text-gray-700 text-sm;
}

/* Print-specific styles */
@media print {
  .letter-template {
    @apply shadow-none p-6;
    max-width: none;
    font-size: 12pt;
  }

  .letter-header {
    @apply border-b border-gray-400;
  }

  .attachments-section {
    @apply border-t border-gray-400;
  }

  .signature-line {
    @apply bg-gray-600;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .letter-template {
    @apply p-4;
  }

  .letter-header {
    @apply flex-col space-y-4;
  }

  .recipient-info {
    @apply text-left;
  }

  .closing-section {
    @apply text-left;
  }

  .signature-space {
    @apply items-start;
  }
}
</style>